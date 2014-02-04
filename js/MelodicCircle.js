(function(window) {
    function MelodicCircle(iNumber, x, y, offsets) {
        this.initialize(iNumber, x, y, offsets);
    }
    var p = MelodicCircle.prototype = new createjs.Shape();
        p.circleCount = 16;
        p.circleSpread = 4;
        p.position = -1;
        p.playing = false;
        p.randomSoundData = [];
        p.iNumber;
        p.x;
        p.y;
        p.offsets = {};
       
        p.id;
        p.slot;
        p.Container_initialize = p.initialize;
    p.initialize = function(iNumber, x, y, offsets) {
        var me = this;
        me.Container_initialize();
        me.iNumber = iNumber;
        me.x = x;
        me.y = y;
        me.offsets = offsets;
        me.generateId(iNumber);
        me.randomSoundData = me.generateRndSoundData();
        me.resetPosition();
        
        var self = this;
        (function(self) {
            self.addEventListener('click', function() {
                self.handleClick();
            });
            createjs.Ticker.addEventListener('tick', function() {
                self.tick();
            });
        })(this);
    }

    p.handleClick = function() {
        melodicControl.triggerPlayback(this);
    }

    p.makeShape = function(data)  {
        var me = this;
        var offset = 150;
        var mul = 1;
        me.graphics.clear();
        for (var i = 0; i < this.circleCount-2; i++) {
            me.graphics.setStrokeStyle(15);
            var cr = Math.round(data[i] * 0.5);
            var cg = Math.round(data[i+1] * 0.5);
            var cb = Math.round(data[i+2] * 0.5);
            var stroke = createjs.Graphics.getRGB(cr, cg, cb);
            me.graphics.beginFill('#000000').beginStroke(stroke);
            me.graphics.drawCircle(0, 0, (i + 1) * me.circleSpread);
            me.alpha = 1 - i * 0.04;
            me.compositeOperation = 'lighter';
        }
    }

    p.resetPosition = function() {
        var me = this;
        me.makeShape(me.randomSoundData);
        me.position = me.offsets.playStart;
    }

    p.generateRndSoundData = function() {
        var rndData = [];
        for (i = 0; i < 16; i++) {
            rndData[i] = Math.random() * 255;
        }
        return rndData;
    }

    p.tick = function() { 
        if (this.isPlaying()) {
            this.makeShape(soundData);
        }
    }

    p.generateId = function(i) {
        this.id = i;
    }
    p.setSlot = function(slot) {
        this.slot = slot;
    }
    p.setPosition = function(position) {
        this.position = position;
    }
    p.getId = function() {
        return this.id;
    }
    p.getSlot = function() {
        return this.slot;
    }
    p.getPosition = function() {
        return this.position;
    }
    p.getRadius = function() {
        return (this.circleCount + 1) * this.circleSpread;
    }
    p.getOffsets = function() {
        return this.offsets;
    }
    p.play = function () {
        this.playing = true;
    }
    p.pause = function() {
        this.playing = false;
    }
    p.isPlaying = function() {
        return this.playing;
    }
    p.isMelodicCircle = function() {
        return true;
    }
    p.rgbToHex = function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    window.MelodicCircle = MelodicCircle;
}(window));

