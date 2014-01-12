(function(window) {
    function Block(soundData, instance) {
        this.initialize(soundData);
    }
    var p = Block.prototype = new createjs.Container();
        p.circleCount = 16;
        p.strokeColor = '#000000';
        p.soundData;
        p.instance;
        p.melodicCircle;
        p.Container_initialize = p.initialize;
    p.initialize = function(soundData) {
        this.Container_initialize();
        this.soundData = soundData;
        this.instance = instance;
        this.melodicCircle = new createjs.Shape();
        this.addChild(this.melodicCircle);
        this.makeShape();
        createjs.Ticker.addEventListener("tick", tick);
        var helper = new createjs.ButtonHelper(this.melodicCircle, "out", "over", "down", false, this.melodicCircle, "hit");
        this.melodicCircle.addEventListener("click", this.handleClick);
    }
    p.handleClick = function() {
        console.log('HELLLO');
    //     instance.play('shattSong', {
    //     interrupt: createjs.Sound.INTERRUPT_NONE,
    //     loop: 0,
    //     volume: 0.4,
    //     offset: 10000
    // });
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
                c_r = Math.round(this.soundData[i] * 0.5),
                c_g = Math.round(this.soundData[i+1] * 0.5),
                c_b = Math.round(this.soundData[i+2] * 0.5);
            var stroke = createjs.Graphics.getRGB(c_r, c_g, c_b);
            g.graphics.beginFill('#000000').beginStroke(stroke);
            g.graphics.drawCircle(0,0,(i+1)*4);
            g.alpha = 1-i*0.02;
            g.compositeOperation = "lighter";
        }
    }
    p.refresh = function(soundData) { 
        this.soundData = soundData;
    }
    p.tick = function() { 
        this.makeShape();
    }
    window.Block = Block;
}(window));

