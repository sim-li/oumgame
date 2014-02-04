/**
 * Oumshatt Game / Main File
 * 
 * @type {Number} fftsize       Number of samples for analizer node
 * @type {Number} tick_freq     Refresh rate for ticker
 * @type {Number} countDown     Used to force user into a timeout 
 */
var fftsize = 32;
var tick_freq = 1;  
var countDown = 30;
var count = 0;
var songDividend = 8;
var assetsPath = 'assets/';
var canvas;
var manifest;
var stage;
var fData;
var waveformData;
var dbData;
var instance;
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
    instance = createjs.Sound.createInstance('shattSong');
    this.createWorld(4);
}

function createWorld(numberOfCircles) {
    me = this;
    var fragmentSize = (instance.getDuration() / me.songDividend) / numberOfCircles;
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
