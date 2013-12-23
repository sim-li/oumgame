var KEYCODE_SPACE = 32,
    FFTSIZE = 32,    
    TICK_FREQ = 100,
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
    analyserNode;

function init() {
    createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
    container = new createjs.Container();
    canvas = document.getElementById('gameCanvas');
    stage = new createjs.Stage(canvas);
    stage.addChild(container);
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
   
    var instance = createjs.Sound.createInstance('shattSong');
    instance.play('shattSong', {
        interrupt: createjs.Sound.INTERRUPT_NONE,
        loop: 0,
        volume: 0.4,
        offset: 10000
        }
    );
    instance.addEventListener('succeeded', handleSucceeded);
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
        var dif;
        var cached = cache[cache.length];
        if (cache.length == 0) {
            dif = TRESH_HOLD;
        } else {
            dif = cache[cache.length-1] - avg;
        }
        
            console.log(dif, cached, avg, cache.length);
        var check =  (dif > TRESH_HOLD);
        if (cache.length <= 1 || check ) {
            cache.push(avg);
        }
        if (cache.length >= 16) {
            if (symbol === undefined) { 
                symbol = new Block(soundData);
                stage.addChild(symbol);
            }
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