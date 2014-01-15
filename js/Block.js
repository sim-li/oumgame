(function(window) {
    function Block(x, y, soundData, offsetStart, offsetStop) {
        this.initialize(x, y, soundData, offsetStart, offsetStop);
    }
    var p = Block.prototype = new createjs.Shape();
        p.circleCount = 16;
        p.strokeColor = '#000000';
        p.currentlyPlaying = false;
        p.instance;
        p.melodicCircle;
        p.offsetStart;
        p.offsetStop;
        p.position;
        p.playing;
        p.isRowPlay;
        p.Container_initialize = p.initialize;
        p.gangTattoo;
    p.initialize = function(x, y, soundData, offsetStart, offsetStop) {
        console.log(offsetStart, offsetStop);
        this.Container_initialize();
        this.offsetStart = offsetStart;
        this.position = this.offsetStart;
        this.offsetStop = offsetStop;
        this.melodicCircle = new createjs.Shape();
        this.melodicCircle.x = 0;
        this.melodicCircle.y = 0;
        this.makeShape();
        this.isRowPlay = false;
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
            instance.addEventListener('startingplayback', function() {
                self.handlePlayStart();
            });
            instance.addEventListener('playbackComplete', function() { 
                if (self.isRowPlay) {
                    self.handleComplete(); 
                }
            })
        })(this);
    }
    p.handleClick = function() {
        if (this.playing === true) {
            this.pause();
            return;
        } 
        this.play();
    }
    p.handlePlayStart = function() {
        this.pause();
    }
    p.play = function() {
        instance.dispatchEvent('startingplayback');
        instance.setPosition(this.position);
        this.playing = true;
        instance.play();
    }
    p.pause = function() {
        this.playing = false;
        instance.pause();
    }
    p.rowPlay = function() {
        this.isRowPlay = true;
         console.log('rowplay');
        this.position = this.offsetStart;
        instance.setPosition(this.offsetStart);
        instance.play();
    }
    p.rowPlayStop = function() {
        this.isRowPlay = false;
        console.log('Ropwlay stop');
    }
    p.setGangTattoo = function(tattoo) {
        this.gangTattoo = tattoo;
    }
    p.getGangTattoo = function() {
        return this.gangTattoo;
    }
    p.handleComplete = function() {
        console.log('next!');
       if (this.target.nextTarget.father != undefined) {
        this.rowPlay = false;
        instance.pause();
        this.target.nextTarget.father.rowPlay();
       }
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
        if (this.playing) {
            this.position = instance.getPosition();
            if (instance.getPosition() > this.offsetStop) {
                instance.setPosition(this.offsetStart);
                instance.dispatchEvent('playbackComplete');
            }
            this.makeShape();
        }
    }
    window.Block = Block;
}(window));

