(function(window) {
    function Block(timeByteData, freqByteData) {
        this.initialize(timeByteData, freqByteData);
    }
    var p = Block.prototype = new createjs.Container();
        p.circleCount = 16;
        p.strokeColor = '#000000';
        p.timeByteData;
        p.freqByteData;
    // Public properties
    p.melodicCircle;
    // Constructor
    p.Container_initialize = p.initialize;
    p.initialize = function(timeByteData, freqByteData) {
        this.Container_initialize();
        this.timeByteData = timeByteData;
        this.freqByteData = freqByteData;
        this.melodicCircle = new createjs.Shape();
        this.addChild(this.melodicCircle);
        this.makeShape(this.strokeColor);
    }
    p.makeShape = function()  {
        g = this.melodicCircle;
        g.graphics.clear();
        for (var i = 0; i < this.circleCount--; i++) {
            g.graphics.setStrokeStyle(15);
            var stroke = '#' + String(Math.abs(this.timeByteData[i] * -1))
                             + String(Math.abs(this.timeByteData[i+1] * -1))
                             + String(Math.abs(this.freqByteData[i]));
            // var stroke = '#FFFFFF';
            // console.log(stroke);
            g.graphics.beginStroke();
            g.graphics.drawCircle(0,0,(i+1)*4);
            g.alpha = 1-i*0.02;
            // g.x = Math.random()*550;
            // g.y = Math.random()*400;
            g.compositeOperation = "lighter";
            var tween = createjs.Tween.get(g).to({x:275,y:200}, (0.5+i*0.04)*1500, createjs.Ease.bounceOut);
            // tweens.push({tween:tween, ref:g});
        }
    }
    p.refresh = function(timeByteData, freqByteData) { 
        this.timeByteData = timeByteData;
        this.freqByteData = freqByteData;
        this.makeShape();
    }
    p.tick = function() { 
    }
    window.Block = Block;
}(window));

