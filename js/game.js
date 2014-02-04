/**
 * Oumshatt Game / Main File
 * ============================
 * 
 * @type {Number} fftsize       Number of samples for analizer node
 * @type {Number} tick_freq     Refresh rate for ticker
 * @type {Number} countDown     Ends game when countDown reaches 0. (refactor to central class later)
 * @type {Number} songDividend  Song is split up by this dividend to use a short sample for gameplay
 * @type {String} assetsPath    Audio and graphic files are loaded from this path
 * @type {Object} canvas        HTML-Canvas used to display game
 * @type {Object} manifest      Preload definitions, asset-files are specified for preload and tagged with an ID
 *                              for later access.
 * @type {Stage} stage          Main stage of the game, all objects like the MelodicCircles, etc. are added here
 * @type {int []} fData         Live frequency data extracted from playing sound file (analyserNodes)
 * @type {int []} waveformData  Live waveform data [...]
 * @type {int []} dbData        Live amplitude data displayed as dB-Values [...]
 * @type {Instance} currentSong Sound instance from the framework, used for central playback / pause of the 
 *                              currently loaded song (no fragmentation here)
 * @type {Analyzer} analyersNode Used to generate [fdata/waveformData/dbData] from song
 * @type {int []} soundData     'Manually' processed sound data used for MelodicCircles. Generated from
 *                               waveformData & fData
 * @type {boolean} loaded        Triggered by callback fct. when sound file is actually loaded,
 *                               avoids nasty errors when trying to access soundData in the main ticker which constantly
 *                               runs.
 * ------------------------------
 * @class MelodicControl         Sound controller, handles logic for playback / chained play, etc. of the MelodicCircles.                   
 *                         
 */
var fftsize = 32;
var tick_freq = 30;  
var countDown = 30;
var songDividend = 8;
var assetsPath = 'assets/';
var canvas;
var manifest;
var stage;
var fData;
var waveformData;
var dbData;
var currentSong;
var analyserNode;
var soundData = [];
var loaded = false;
var melodicControl;

function init() {
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    canvas = document.getElementById('gameCanvas');
    stage = new createjs.Stage(canvas);
    manifest = [{
        id: 'shattSong', 
        src: 'music/shatt.ogg'
    }];
    melodicControl = new MelodicControl();
    var preload = new createjs.LoadQueue(true, assetsPath);
    preload.installPlugin(createjs.Sound);
    preload.addEventListener('complete', afterLoad);
    preload.loadManifest(manifest);
    createjs.Ticker.addEventListener('tick', tick);
    createjs.Ticker.setInterval(tick_freq);
}

function afterLoad(event) { 
    this.loaded = true;
    var context = createjs.WebAudioPlugin.context;
    var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
    analyserNode = context.createAnalyser();
    analyserNode.fftsize = fftsize;
    analyserNode.smoothingTimeConstant = 0.85;
    analyserNode.connect(context.destination);
    dynamicsNode.disconnect();
    dynamicsNode.connect(analyserNode);
    dbData = new Float32Array(analyserNode.frequencyBinCount);
    fData = new Uint8Array(analyserNode.frequencyBinCount);
    waveformData = new Uint8Array(analyserNode.frequencyBinCount);
    currentSong = createjs.Sound.createInstance('shattSong');
    this.createWorld(4);
}

function createWorld(numberOfCircles) {
    me = this;
    var fragmentSize = (currentSong.getDuration() / me.songDividend) / numberOfCircles;
    for (var i = 0; i < numberOfCircles; i++) {

        var rndPositionX = Math.max(100, Math.random() * stage.canvas.width);
        var rndPositionY = Math.max(100, Math.random() * stage.canvas.height);

        var melodicCircle = new MelodicCircle(i, rndPositionX, rndPositionY, {
            playStart: fragmentSize * i,
            playEnd: fragmentSize * (i + 1)
        });

        var slot = new Slot(i, 100, 300, melodicCircle.getRadius());

        melodicCircle.setSlot(slot);

        stage.addChild(slot);
        stage.addChild(melodicCircle);

        melodicControl.addToPlaylist(melodicCircle);

        melodicCircle.on('pressmove', function(evt) {
            snapOnCorrectObject(evt);
            // snapOnAnyObject(evt);
        });

        stage.sortChildren(function(obj1, obj2, options) {
            if (obj1.getId() > obj2.getId()) { return -1; }
            if (obj1.getId() < obj2.getId()) { return 1; }
            return 0;
        });
    }
    melodicControl.playAll();
    stage.update();
}

function snapOnCorrectObject(evt) {
    var melodicCircle = evt.target;
    var slot = melodicCircle.getSlot();
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
    var pt = melodicCircle.localToLocal(10, 10, slot);
    if (slot.hitTest(pt.x, pt.y)) { 
        melodicCircle.setTransform(slot.x, slot.y);
        console.log('I am correct');
    }
    stage.update(); 
}

function snapOnAnyObject(evt) {
    var melodicCircle = evt.target;
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
    for (var i = 0, size = stage.getNumChildren(); i < size; i++) {
        var child = stage.getChildAt(i);
        if (child.isMelodicCircle() === false) {
            continue;
        }
        var slot = child.getSlot();
        var pt = melodicCircle.localToLocal(10, 10, slot);
        if (slot.hitTest(pt.x, pt.y)) { 
            melodicCircle.setTransform(slot.x, slot.y);
        } 
    }
    stage.update(); 
}

function tick(event) {
    var me = this;
    if (me.loaded) {
        me.updateSoundData();
    }
    stage.update(event);
}

function updateSoundData() {
    analyserNode.getFloatFrequencyData(dbData);
    analyserNode.getByteFrequencyData(fData);  
    analyserNode.getByteTimeDomainData(waveformData); 
    var offset = 100;
    var i = waveformData.length;
    while(i--) {
        if (fData[i] === 0) {
            fData[i] = 100;
        }
        if (waveformData[i] === 0) {
            waveformData[i] = 1;
        }
        soundData[i] = Math.abs(Math.round(fData[i] * waveformData[i] / 100) - offset);
    }
}
