(function(window) {
    function Block(soundData) {
        this.initialize(soundData);
    }
    var p = Block.prototype = new createjs.Container();
        p.circleCount = 16;
        p.strokeColor = '#000000';
        p.soundData;
    p.melodicCircle;
    p.Container_initialize = p.initialize;
    p.initialize = function(soundData) {
        this.Container_initialize();
        this.soundData = soundData;
        this.melodicCircle = new createjs.Shape();
        this.addChild(this.melodicCircle);
        this.makeShape();
        // createjs.Ticker.addEventListener("tick", tick);
    }
    p.rgbToHex = function(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }
    p.makeShape = function()  {
        g = this.melodicCircle;
        g.graphics.clear();
        for (var i = 0; i < this.circleCount-2; i++) {
            g.graphics.setStrokeStyle(15);
            // console.log(this.soundData);
            var offset = 50,
                mul = 1,
                c_r = Math.round(255 * (this.soundData[i] / 100)),
                c_g = Math.round(255 * (this.soundData[i+1] / 100)),
                c_b = Math.round(255 * (this.soundData[i+2] / 100));
                // console.log(this.soundData);
            var stroke = createjs.Graphics.getRGB(c_r, c_g, c_b);
            // console.log(stroke);
            g.graphics.beginStroke(stroke);
            g.graphics.drawCircle(100,100,(i+1)*2);
            // g.alpha = 1-i*0.02;
            // g.x = Math.random()*550;
            // g.y = Math.random()*400;
            g.compositeOperation = "lighter";
            // var tween = createjs.Tween.get(g).to({x:275,y:200}, (0.5+i*0.04)*1500, createjs.Ease.bounceOut);
            // tweens.push({tween:tween, ref:g});
        }
    }
    p.refresh = function(timeByteData, freqByteData) { 
    }
    p.tick = function() { 
        g.makeShape();
        console.log('HELLO');
    }
    window.Block = Block;
}(window));

