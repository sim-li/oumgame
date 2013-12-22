var KEYCODE_SPACE = 32,
    FFTSIZE = 32,    
    TICK_FREQ = 20,
    assetsPath = 'assets/',
    playPressed = false,
    update = true,
    offset = {},
    canvas,
    manifest,
    preload,
    stage,
    symbol,
    freqFloatData,
    freqByteData,
    timeByteData,
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
    analyserNode = context.createAnalyser(),
    analyserNode.fftSize = FFTSIZE;
    analyserNode.smoothingTimeConstant = 0.85;
    analyserNode.connect(context.destination);
    dynamicsNode = createjs.WebAudioPlugin.dynamicsCompressorNode;
    dynamicsNode.disconnect();
    dynamicsNode.connect(analyserNode);
    freqFloatData = new Float32Array(analyserNode.frequencyBinCount);
    freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
    timeByteData = new Uint8Array(analyserNode.frequencyBinCount);
    stage.update();
    createjs.Sound.play("shattSong", {
        interrupt: createjs.Sound.INTERRUPT_NONE,
        loop: 0,
        volume: 0.4,
        offset: 10000
        }
    );
}
function updateAnalysis() {

}

function tick(event) {
    analyserNode.getFloatFrequencyData(freqFloatData); // dB
    analyserNode.getByteFrequencyData(freqByteData);   // f
    analyserNode.getByteTimeDomainData(timeByteData);  // waveform
    this.printData();
}

function printData() {
    console.log(freqFloatData);
    console.log(freqByteData);
    console.log(timeByteData);
}