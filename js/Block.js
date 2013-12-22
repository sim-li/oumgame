(function(window) {
    function Block() {
        this.initialize();
    }
    var p = Block.prototype = new createjs.Container(),
        someCircle;
    // Public properties
    p.someCircle;
    // Constructor
    p.Container_initialize = p.initialize;
    p.initialize = function() {
        this.Container_initialize();
        this.someCircle = new createjs.Shape();
        this.addChild(this.someCircle);
        this.makeShape();
    }
    p.makeShape = function()  {
        g = this.someCircle.graphics;
        g.clear();
        g.beginFill('rgba(255,0,0,1)').drawPolyStar(60, 60, 30, 4, 0, 45).moveTo(50, 50);
    }
    p.tick = function() { 
    }
    window.Block = Block;
}(window));

