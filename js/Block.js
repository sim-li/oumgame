(function(window) {
    function Block(x, y, soundData, offsetStart, offsetStop) {
        this.initialize(x, y, soundData, offsetStart, offsetStop);
    }
    var p = Block.prototype = new createjs.Shape();
        p.circleCount = 16;
        p.strokeColor = '#000000';
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
            instance.addEventListener('stopAllPlayers', function() {
                self.handleStopAllPlayers();
            });
        })(this);
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
        this.dispatchEvent('stopAllPlayers');
        if (instance.playing != true) {
            instance.play();
            instance.playing = true;
        }
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
        g = this;
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
    window.Block = Block;
}(window));

