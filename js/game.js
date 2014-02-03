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
    //melodicCircle
    //child
    me = this;


    stage.update();
    var fragmentSize = (instance.getDuration() / me.songDividend) / numberOfCircles;
    for (var i = 0; i < numberOfCircles; i++) {

        var melodicCircleX = Math.max(100, Math.random() * stage.canvas.width;);
        var melodicCircleY = Math.max(100, Math.random() * stage.canvas.height);

        var melodicCircle = new Block(childX, childY, me.generateRndSoundData(), fragmentSize * i, fragmentSize * (i + 1));
        var slot = new slot(100 + i*200, 300, '#1C1C1C', 1);
        
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
            if (obj1.id > obj2.id) { return -1; }
            if (obj1.id < obj2.id) { return 1; }
            return 0;
        });
        stage.update();
    }
    stage.update();
}

function snapOnCorrectObject(evt) {
    var melodicCircle = evt.target;
    var slot = melodicCircle.slot;
    evt.target.x = evt.stageX;
    evt.target.y = evt.stageY;
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
function createSymbol() {
    var mySymbol = new Block(10, 300, this.generateRndSoundData(), 15000, 16010);
    stage.addChild(mySymbol);
    stage.update();
    mySymbol.on('pressmove', function(evt) {
        evt.currentslot.x = evt.stageX ;
        evt.currentslot.y = evt.stageY ;
        stage.update();
    });
    return mySymbol;
}

function createslot() {
    slot.alpha = 0.5;
        var pt = dragger.localToLocal(10,10,slot);
        if (slot.hitTest(pt.x, pt.y)) { 
            slot.alpha = 1; 
            dragger.setTransform(slot.x, slot.y);
        }
}

function handleSucceeded() {
    this.isPlaying = true;
}

function tick(event) {
    if (this.isPlaying) {
        this.updateCountDown();
        this.updateSoundData();
    }
    stage.update(event);
}

function updateCountDown() {
    this.countdownLabel.text = this.countDown;
    this.count++;
    if (this.count >= 50 && this.countDown > 0) {
        this.count = 0;
        this.countDown--;
    }
    if (this.countDown <= 0) {
        this.gameoverLabel.visible = true;
        this.gameoverSubLabel.visible = true;
    }

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
