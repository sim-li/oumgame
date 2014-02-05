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
var mainStage;
var stage;
var textStage;

function init() {
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    canvas = document.getElementById('gameCanvas');
    mainStage = new createjs.Stage(canvas);
    stage = new createjs.Container();
    textStage = new createjs.Container();
    mainStage.addChild(stage);
    mainStage.addChild(textStage);
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
    me.showPlayAllButton();
    var fragmentSize = (currentSong.getDuration() / me.songDividend) / numberOfCircles;
    for (var i = 0; i < numberOfCircles; i++) {

        var rndPositionX = Math.max(100, Math.random() * mainStage.canvas.width);
        var rndPositionY = Math.max(100, Math.random() * mainStage.canvas.height);

        var melodicCircle = new MelodicCircle(i, rndPositionX, rndPositionY, {
            playStart: fragmentSize * i,
            playEnd: fragmentSize * (i + 1)
        });

        var slot = new Slot(i, 100, 300, melodicCircle.getRadius());

        melodicCircle.setSlot(slot);

        stage.addChild(slot);
        stage.addChild(melodicCircle);

        melodicCircle.on('pressmove', function(evt) {
            dockCircleToSlot(evt);
        });

        stage.sortChildren(function(obj1, obj2, options) {
            if (obj1.getId() > obj2.getId()) { return -1; }
            if (obj1.getId() < obj2.getId()) { return 1; }
            return 0;
        });
    }
    mainStage.update();
}
// Sort by GUEST ID necessary to determine playlist order.... think of smart algorithm,
// maybe when added bla bla
function dockCircleToSlot(evt) {
    var melodicCircle = evt.target;
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
    melodicCircle.setCorrectSlot(false);
    melodicControl.removeFromPlaylist(melodicCircle);
    console.log('Removed ', melodicCircle, 'Now have: ', melodicControl.playlist.length);
    var slot;
    for (var i = 0, size = stage.getNumChildren(); i < size; i++) {
        var element = stage.getChildAt(i);
        if (!element.isMelodicCircle()) {
            slot = element;
            var pt = melodicCircle.localToLocal(10, 10, slot);
            if (slot.hitTest(pt.x, pt.y)) { 
                    melodicCircle.setDockedId(slot.getId());
                    melodicControl.addToPlaylist(melodicCircle);
                    console.log('Added: ', melodicCircle, 'Now have: ', melodicControl.playlist.length);
                if (slot === melodicCircle.getSlot()) {
                    melodicCircle.setCorrectSlot(true);

                }
                melodicCircle.setTransform(slot.x, slot.y);
            } 
            continue;
        }
    }
    mainStage.update(); 
}

// function sortPlayList() {
//     this.playlist.sort(this.sortfunction)
// }

// function sortfunction(a, b){
// //Compare "a" and "b" in some fashion, and return -1, 0, or 1
//     if ()
// }

function tick(event) {
    var me = this;
    if (me.loaded) {
        me.updateSoundData();
    }
    mainStage.update(event);
}

function showWinlabel() {
    var winLabel = new createjs.Text('Game over', 'bold 146px Arial', '#FFFFFF');
    winLabel.alpha = 0.5;
    winLabel.x = 30;
    winLabel.y = 140;
    var winSubLabel =  new createjs.Text('Try harder next time.', 'bold 72px Arial', '#FFFFFF');
    winSubLabel.alpha = 0.5;
    winSubLabel.x = 50;
    winSubLabel.y = 270;
    // this.winLabel.visible = true;
    // this.winSubLabel.visible = true;
    textStage.addChild(winLabel);
    textStage.addChild(winSubLabel);
}

function showPlayAllButton() {
    var playall = new createjs.Text('playall', 'bold 20px Arial', '#FFFFFF');
    playall.alpha = 0.5;
    playall.x = 30;
    playall.y = 140;
    playall.addEventListener('click', function() {
        melodicControl.playAll();
    });
    textStage.addChild(playall);
}

function clearTextStage() {
    textStage.removeAllChildren();
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
