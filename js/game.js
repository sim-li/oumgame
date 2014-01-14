var KEYCODE_SPACE = 32,
    FFTSIZE = 32,    
    TICK_FREQ = 1,
    assetsPath = 'assets/',
    isPlaying = false,
    update = true,
    offset = {},
    canvas,
    manifest,
    preload,
    stage,
    symbol,
    dbData,
    fData,
    cache = [],
    waveformData,
    instance,
    analyserNode,
    soundData = [];

function init() {
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    canvas = document.getElementById('gameCanvas');
    stage = new createjs.Stage(canvas);
    manifest = [{
        id: 'shattSong', 
        src: 'music/shatt.ogg'
    }];
    preload = new createjs.LoadQueue(true, assetsPath);
    preload.installPlugin(createjs.Sound);
    preload.addEventListener('complete', afterLoad);
    preload.loadManifest(manifest);
    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setInterval(TICK_FREQ);
}

function afterLoad(event) { 
    //Initalize Analyser
    var context = createjs.WebAudioPlugin.context,
        dynamicsNode;
    analyserNode = context.createAnalyser();
    analyserNode.fftSize = FFTSIZE;
    analyserNode.smoothingTimeConstant = 0.85;
    analyserNode.connect(context.destination);
    dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
    dynamicsNode.disconnect();
    dynamicsNode.connect(analyserNode);
    dbData = new Float32Array(analyserNode.frequencyBinCount);
    fData = new Uint8Array(analyserNode.frequencyBinCount);
    waveformData = new Uint8Array(analyserNode.frequencyBinCount);
    //Play song
    instance = createjs.Sound.createInstance('shattSong');
    instance.addEventListener('succeeded', handleSucceeded);
    this.createWorld();
}

function drawTarget(color, alpha) {
    var target = new createjs.Shape();
    target.graphics.alpha = alpha;
    target.graphics.beginFill("black").drawCircle(0,0, (16+1)*4);
    return target;
}
function createWorld() {
    var numberOfCircles = 4;
    var totalDuration = instance.getDuration();
    var usedDuration = totalDuration / 4; 
    var fragmentSize = usedDuration / numberOfCircles;
    for (var i = 0; i < numberOfCircles; i++) {
        soundData = this.randomSoundData();
        var childX = Math.random() * 800;
        var childY = Math.random() * 600;
        // var childX = 100 + i*200;
        // var childY = 100;
        // console.log(fragmentSize * i, fragmentSize * (i + 1));
        var child = new Block(childX, childY, this.randomSoundData(), fragmentSize * i, fragmentSize * (i + 1));
        child.id = i;

        var target = this.drawTarget('black', 0.2);

         // Don't touch circle directly, change x-y coords of target instead!
        target.x = 100 + i*200;
        target.y = 400;
        target.id = 10000-i;

        child.target = target;
        stage.addChild(child.target);
        stage.addChild(child);


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
     if (myTarget == undefined) {
        return;
    }
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
    var pt = myChild.localToLocal(10, 10, myTarget);
    if (myTarget.hitTest(pt.x, pt.y)) { 
        myTarget.alpha = 1; 
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
            myTarget.alpha = 1; 
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
                //console.log(target.x, target.y);
            }
            
}
function handleSucceeded() {
    this.isPlaying = true;
}
function tick(event) {
    if (isPlaying) {
        analyserNode.getFloatFrequencyData(dbData); // dB
        analyserNode.getByteFrequencyData(fData);   // f
        analyserNode.getByteTimeDomainData(waveformData);  // waveform
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
        var avg = ((soundData[0] + soundData[1] + soundData[2] + soundData[3]) / 4);
        var TRESH_HOLD = 10;
        if (cache.length <= 1 || (Math.abs(cache[cache.length-1] - avg) > TRESH_HOLD)) {
            cache.push(avg);
        }
        if (cache.length >= 16) {
            // symbol.refresh(soundData);
            // symbol.tick();
            // stage.tick();
           
            cache = [];
        }
    }
    // for (var i = 0, size = stage.getNumChildren(); i < size; i++) {
    //     stage.getChildAt(i).tick();
    // }
    stage.update(event);
}

function printData() {
    console.log(dbData);
    console.log(fData);
    console.log(waveformData);
}