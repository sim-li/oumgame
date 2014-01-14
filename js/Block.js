(function(window) {
    function Block(x, y, soundData, offsetStart, offsetStop) {
        this.initialize(x, y, soundData, offsetStart, offsetStop);
    }
    var p = Block.prototype = new createjs.Container();
        p.circleCount = 16;
        p.strokeColor = '#000000';
        p.currentlyPlaying = false;
        // p.soundData;
        p.instance;
        p.melodicCircle;
        p.offsetStart;
        p.offsetStop;
        p.Container_initialize = p.initialize;
    p.initialize = function(x, y, soundData, offsetStart, offsetStop) {
        this.Container_initialize();
        // this.soundData = soundData;
        this.offsetStart = offsetStart;
        instance.setPosition(this.offsetStart);
        this.offsetStop = offsetStop;
        this.melodicCircle = new createjs.Shape();
        this.addChild(this.melodicCircle);
        this.makeShape();
        this.x = x;
        this.y = y;
        createjs.Ticker.addEventListener("tick", tick);
        var helper = new createjs.ButtonHelper(this.melodicCircle, "out", "over", "down", false, this.melodicCircle, "hit");
        var self = this;
        (function(self) {
            self.addEventListener('click', function() {
                self.handleClick();
            });
        })(this);
        // this.addEventListener("click", this.handleClick);
    }
    p.handleClick = function() {
        if (this.currentlyPlaying === true) {
            instance.pause();
            this.currentlyPlaying = false;
            return;
        } 
        instance.play();
        this.currentlyPlaying = true;
    }
    p.rgbToHex = function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    p.makeShape = function()  {
        g = this.melodicCircle;
        g.graphics.clear();
        for (var i = 0; i < this.circleCount-2; i++) {
            g.graphics.setStrokeStyle(15);
            var offset = 50,
                mul = 1,
                c_r = Math.round(soundData[i] * 0.5),
                c_g = Math.round(soundData[i+1] * 0.5),
                c_b = Math.round(soundData[i+2] * 0.5);
            var stroke = createjs.Graphics.getRGB(c_r, c_g, c_b);
            g.graphics.beginFill('#000000').beginStroke(stroke);
            g.graphics.drawCircle(0,0,(i+1)*4);
            g.alpha = 1-i*0.02;
            g.compositeOperation = "lighter";
        }
    }
    // p.refresh = function(soundData) { 
    //     soundData = soundData;
    // }
    p.tick = function() { 
        this.makeShape();
        if (instance.getPosition() > this.offsetStop) {
            instance.setPosition(this.offsetStart);
        }
    }
    window.Block = Block;
}(window));

