/**
 * Oumshatt Game / Main File
 * 
 * @type {Number} fftsize       Number of samples for analizer node
 * @type {Number} tick_freq     Refresh rate for ticker
 * @type {Number} countDown     Used to force user into a timeout 
 */
var fftsize = 32;
var tick_freq = 100;  
var countDown = 30;
var count = 0;
var songDividend = 8;
var assetsPath = 'assets/';
var canvas;
var manifest;
var stage;
var fData;
var waveformData;
var instance;
var analyserNode;
var soundData = [];

function init() {
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    canvas = document.getElementById('gameCanvas');
    stage = new createjs.Stage(canvas);
    manifest = [{
        id: 'shattSong', 
        src: 'music/shatt.ogg'
    }];
    var preload = new createjs.LoadQueue(true, assetsPath);
    preload.installPlugin(createjs.Sound);
    preload.addEventListener('complete', afterLoad);
    preload.loadManifest(manifest);
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setInterval(tick_freq
);
}

function afterLoad(event) { 
    var context = createjs.WebAudioPlugin.context;
    var dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
    analyserNode = context.createAnalyser();
    analyserNode fftsize = fftsize;
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
    stage.update();
    var fragmentSize = (instance.getDuration() / me.songDividend) / numberOfCircles;
    for (var i = 0; i < numberOfCircles; i++) {

        var melodicCircleX = Math.max(100, Math.random() * stage.canvas.width;);
        var melodicCircleY = Math.max(100, Math.random() * stage.canvas.height);

        var melodicCircle = new MelodicCircle(childX, childY, me.generateRndSoundData(), fragmentSize * i, fragmentSize * (i + 1));
        var slot = new Slot(100 + i*200, 300, '#1C1C1C', 1);
        
        melodicCircle.generateId(i);
        slot.generateId(i);

        melodicCircle.setSlot(slot);
        
        stage.addChild(slot);
        stage.addChild(melodicCircle);

        melodicCircle.on('pressmove', function(evt) {
            // snapOnCorrectObject(evt);
            snapOnAnyObject(evt);
        });

       
        stage.sortChildren(function(obj1, obj2, options) {
            if (obj1.getId() > obj2.getId()) { return -1; }
            if (obj1.getId() < obj2.getId()) { return 1; }
            return 0;
        });
        stage.update();
    }
    stage.update();
}

function snapOnCorrectObject(evt) {
    var melodicCircle = evt.target;
    var slot = melodicCircle.slot;
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
        var slot = stage.getChildAt(i).slot;
        if (slot === undefined) {
            continue;
        }
        var pt = melodicCircle.localToLocal(10, 10, slot);
        if (slot.hitTest(pt.x, pt.y)) { 
            melodicCircle.setTransform(slot.x, slot.y);
        } 
    }
    stage.update(); 
}

function generateRndSoundData() {
    var soundData = [];
    for (i = 0; i < 16; i++) {
        soundData[i] = Math.random() * 255;
    }
    return soundData;
}

function tick(event) {
    var me = this;
    if (me.isPlaying) {
        me.updateCountDown();
        me.updateSoundData();
    }
    stage.update(event);
}

function updateCountDown() {
    // var me = this;
    // me.countdownLabel.text = me.countDown;
    // me.count++;
    // if (me.count >= 50 && me.countDown > 0) {
    //     me.count = 0;
    //     me.countDown--;
    // }
    // if (me.countDown <= 0) {
    //     me.gameoverLabel.visible = true;
    //     me.gameoverSubLabel.visible = true;
    // }
}

function updateSoundData() {
    analyserNode.getFloatFrequencyData(dbData);
    analyserNode.getByteFrequencyData(fData);  
    analyserNode.getByteTimeDomainData(waveformData); 
    var offset = 50;
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
