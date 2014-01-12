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
    analyserNode;

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
    if (symbol === undefined) { 
        symbol = this.createSymbol();
    }
    
}

function randomSoundData() {
    var soundData = [];
    for (i = 0; i < 16; i++) {
        soundData[i] = Math.random() * 255;
    }
    return soundData;
}
function createSymbol() {
    var mySymbol = new Block(this.randomSoundData(), 15000, 16010);
    mySymbol.x = 300;
    mySymbol.y = 300;
    var dragger = new createjs.Container();
    dragger.addChild(mySymbol);
    stage.addChild(mySymbol);
    stage.update();
    mySymbol.on('pressmove', function(evt) {
        evt.currentTarget.x = evt.stageX ;
        evt.currentTarget.y = evt.stageY ;
        stage.update();
    });
    return mySymbol;
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
        var soundData = [];
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
            symbol.refresh(soundData);
            symbol.tick();
            stage.update();
            cache = [];
        }
    }
}

function printData() {
    console.log(dbData);
    console.log(fData);
    console.log(waveformData);
}