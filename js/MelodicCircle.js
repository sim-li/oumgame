(function(window) {
    function MelodicCircle(x, y, offsetStart, offsetStop) {
        this.initialize(x, y, offsetStart, offsetStop);
    }
    var p = MelodicCircle.prototype = new createjs.Shape();
        p.circleCount = 16;
        p.isPlaying = false;
        p.instance;
        p.offsetStart;
        p.offsetStop;
        p.position;
        p.id;
        p.slot;
        p.Container_initialize = p.initialize;
    p.initialize = function(x, y, offsetStart, offsetStop) {
        var me = this;

        me.Container_initialize();

        me.x = x;
        me.y = y;
        me.id = -1;

        me.offsetStart = me.position = offsetStart;
        me.offsetStop = offsetStop;

        me.makeShape(me.generateRndSoundData());
        
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

    p.handleClick = function() {
        
    }

    p.makeShape = function(data)  {
        var me = this;
        var offset = 50;
        var mul = 1;
        me.graphics.clear();
        for (var i = 0; i < this.circleCount-2; i++) {
            me.graphics.setStrokeStyle(15);
            var r = Math.round(data[i] * 0.5);
            var g = Math.round(data[i+1] * 0.5);
            var b = Math.round(data[i+2] * 0.5);
            var stroke = createjs.Graphics.getRGB(r, g, b);
            me.graphics.beginFill('#000000').beginStroke(stroke);
            me.graphics.drawCircle(0, 0, (i + 1) * 4);
            me.alpha = 1 - i * 0.02;
            me.compositeOperation = 'lighter';
        }
    }

    p.generateRndSoundData = function() {
        var rndData = [];
        for (i = 0; i < 16; i++) {
            rndData[i] = Math.random() * 255;
        }
        return rndData;
    }

    p.tick = function() { 
        if (!this.isPlaying) {
            return;
        }
        this.makeShape(soundData);
    }
    p.generateId = function(i) {
        this.id = i;
    }
    p.setSlot = function(slot) {
        this.slot = slot;
    }
    p.getId = function() {
        return this.id;
    }
    p.getSlot = function() {
        return this.slot;
    }
    p.play = function () {
        this.isPlaying = true;
    }
    p.pause = function() {
        this.isPlaying = false;
    }
    p.isPlaying = function() {
        return this.isPlaying;
    }
    p.rgbToHex = function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    window.MelodicCircle = MelodicCircle;
}(window));

