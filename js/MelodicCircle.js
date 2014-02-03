(function(window) {
    function MelodicCircle(x, y, soundData, offsetStart, offsetStop) {
        this.initialize(x, y, soundData, offsetStart, offsetStop);
    }
    var p = MelodicCircle.prototype = new createjs.Shape();
        p.circleCount = 16;
        p.isPlaying = false;
        p.instance;
        p.offsetStart;
        p.offsetStop;
        p.position;
        p.Container_initialize = p.initialize;
    p.initialize = function(x, y, soundData, offsetStart, offsetStop) {
        this.Container_initialize();
        this.offsetStart = offsetStart;
        this.position = this.offsetStart;
        this.offsetStop = offsetStop;
        this.makeShape();
        this.x = x;
        this.y = y;
        var self = this;
        (function(self) {
            self.addEventListener('click', function() {
                self.handleClick();
            });
            self.addEventListener('tick', function() {
                self.tick();
            });
        })(this);
    }
    p.generateId = function() {

    }
    p.getId() = function() {

    }
    p.setSlot() = function() {

    }
    p.setPlayStatus() = function() {

    }
    p.getPlayStatus() = function() {

    }
    p.handleClick = function() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    p.play = function () {
        this.isPlaying = true;
        instance.setPosition(this.position);
    }
    p.pause = function() {
        instance.playing = false;
        instance.pause();
    }
    p.handleComplete = function() {
        instance.pause();
    }
    p.rgbToHex = function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    p.makeShape = function()  {
        var offset = 50;
        var mul = 1;
        g = this;
        g.graphics.clear();
        g.graphics.setStrokeStyle(15);
        for (var i = 0; i < this.circleCount-2; i++) {
            var c_r = Math.round(soundData[i] * 0.5),
            var c_g = Math.round(soundData[i+1] * 0.5),
            var c_b = Math.round(soundData[i+2] * 0.5);
            var stroke = createjs.Graphics.getRGB(c_r, c_g, c_b);
            g.graphics.beginFill('#000000').beginStroke(stroke);
            g.graphics.drawCircle(0, 0, (i + 1) * 4);
            g.alpha = 1 - i * 0.02;
            g.compositeOperation = "lighter";
        }
    }
    p.tick = function() { 
        if (this.isPlaying) {
            this.position = instance.getPosition();
            if (instance.getPosition() > this.offsetStop) {
                this.position = this.offsetStart;
                instance.setPosition(this.offsetStart);
            }
            this.makeShape();
        }
    }
    window.MelodicCircle = MelodicCircle;
}(window));

