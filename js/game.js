var KEYCODE_SPACE = 32,
    FFTSIZE = 32,    
    TICK_FREQ = 1,
    ONE_SEC = 1000 / TICK_FREQ,
    countDown = 30,
    count = 0,
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
    titleLabel,
    countdownLabel,
    gameoverLabel,
    gameoverSubLabel,
    winLabel,
    winSubLabel,
    soundData = [],
    startTime,
    currentTime,
    currentDate;


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
    // instance.addEventListener('succeeded', handleSucceeded);
    this.createWorld();
}

function drawTarget(color, alpha) {
    var target = new createjs.Shape();
    target.graphics.alpha = alpha;
    target.graphics.beginFill(color).drawCircle(0,0, (16+1)*4);
    return target;
}
function createWorld() {
    //CountDown Label
    countdownLabel = new createjs.Text('30', 'bold 36px Arial', '#FFFFFF');
    countdownLabel.alpha = 0.5;
    countdownLabel.x = 0;
    countdownLabel.y = 0;
    //GameOverMessage
    gameoverLabel = new createjs.Text('Game over', 'bold 146px Arial', '#FFFFFF');
    gameoverLabel.alpha = 0.5;
    gameoverLabel.x = 30;
    gameoverLabel.y = 140;
    gameoverSubLabel =  new createjs.Text('Try harder next time.', 'bold 72px Arial', '#FFFFFF');
    gameoverSubLabel.alpha = 0.5;
    gameoverSubLabel.x = 50;
    gameoverSubLabel.y = 270;
    stage.addChild(gameoverLabel);
    stage.addChild(countdownLabel);
    stage.addChild(gameoverSubLabel);
    this.gameoverLabel.visible = false;
    this.gameoverSubLabel.visible = false;
    //You made it Message
    winLabel = new createjs.Text('Game over', 'bold 146px Arial', '#FFFFFF');
    winLabel.alpha = 0.5;
    winLabel.x = 30;
    winLabel.y = 140;
    winSubLabel =  new createjs.Text('Try harder next time.', 'bold 72px Arial', '#FFFFFF');
    winSubLabel.alpha = 0.5;
    winSubLabel.x = 50;
    winSubLabel.y = 270;
    stage.addChild(winLabel);
    stage.addChild(winSubLabel);
    this.winLabel.visible = false;
    this.winSubLabel.visible = false;



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
     if (myTarget == undefined) {
        return;
    }
    evt.currentTarget.x = evt.stageX;
    evt.currentTarget.y = evt.stageY;
    var pt = myChild.localToLocal(10, 10, myTarget);
    if (myTarget.hitTest(pt.x, pt.y)) { 
        // myTarget.alpha = 1; 
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
            // myTarget.alpha = 1; 
            myChild.setTransform(myTarget.x, myTarget.y);
            // myChild.rowPlay();
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
    // Needs callback from outside
    if (this.isPlaying) {
        this.countdownLabel.text = this.countDown;
        stage.update(event);
        this.count++;
        if (this.count >= 100 && this.countDown > 0) {
            this.count = 0;
            this.countDown--;
        }
        if (this.countDown <= 0) {
            this.gameoverLabel.visible = true;
            this.gameoverSubLabel.visible = true;
        }
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
    }
    stage.update(event);
}

function printData() {
    console.log(dbData);
    console.log(fData);
    console.log(waveformData);
}