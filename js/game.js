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
    this.createWorld();
}

function drawTarget(color, alpha) {
    var target = new createjs.Shape();
    target.graphics.alpha = alpha;
    target.graphics.beginFill(color).drawCircle(0,0, (16+1)*4);
    return target;
}
function createWorld() {
    stage.update();
    var numberOfCircles = 4;
    var totalDuration = instance.getDuration();
    var usedDuration = totalDuration / 8; 
    var fragmentSize = usedDuration / numberOfCircles;
    var lastChild;
    for (var i = 0; i < numberOfCircles; i++) {
        soundData = this.randomSoundData();
        var childX = Math.max(100, Math.random() * 700);
        var childY = Math.max(100, Math.random() * 500);
        var child = new Block(childX, childY, this.randomSoundData(), fragmentSize * i, fragmentSize * (i + 1));
        child.id = i;
        var target = new Target(100 + i*200, 300, '#1C1C1C', 1);
        
        target.id = 10000-i;
        child.target = target;
        if (lastChild != undefined) {
            target.nextFather = lastChild; // HERE IS THE SALAD
        }
        stage.addChild(child.target);
        stage.addChild(child);
        lastChild = child;

        child.on("pressmove", function(evt) {
            // snapOnCorrectObject(evt);
            snapOnAnyObject(evt);
        });

        var sortFunction = function(obj1, obj2, options) {
            if (obj1.id > obj2.id) { return -1; }
            if (obj1.id < obj2.id) { return 1; }
            return 0;
        }
        stage.sortChildren(sortFunction);
        stage.update();
    }
    stage.update();
}

function snapOnCorrectObject(evt) {
    var myChild = evt.target;
    var myTarget = evt.target.target;
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
    var pt = myChild.localToLocal(10, 10, myTarget);
    if (myTarget.hitTest(pt.x, pt.y)) { 
        myChild.setTransform(myTarget.x, myTarget.y);
        console.log('I am correct');
    }
    stage.update(); 
}

function snapOnAnyObject(evt) {
    var myChild = evt.target;
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
    for (var i = 0, size = stage.getNumChildren(); i < size; i++) {
        var myTarget = stage.getChildAt(i).target;
        if (myTarget == undefined) {
            continue;
        }
        var pt = myChild.localToLocal(10, 10, myTarget);
        if (myTarget.hitTest(pt.x, pt.y)) { 
            myChild.setTransform(myTarget.x, myTarget.y);
        } 
    }
    stage.update(); 
}

function randomSoundData() {
    var soundData = [];
    for (i = 0; i < 16; i++) {
        soundData[i] = Math.random() * 255;
    }
    return soundData;
}
function createSymbol() {
    var mySymbol = new Block(10, 300, this.randomSoundData(), 15000, 16010);
    stage.addChild(mySymbol);
    stage.update();
    mySymbol.on('pressmove', function(evt) {
        evt.currentTarget.x = evt.stageX ;
        evt.currentTarget.y = evt.stageY ;
        stage.update();
    });
    return mySymbol;
}

function createTarget() {
    target.alpha = 0.5;
        var pt = dragger.localToLocal(10,10,target);
        if (target.hitTest(pt.x, pt.y)) { 
            target.alpha = 1; 
            dragger.setTransform(target.x, target.y);
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
