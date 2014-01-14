(function(window) {
    function Target(x, y, color, alpha) {
        this.initialize(x, y, color, alpha);
    }
    var p = Target.prototype = new createjs.Shape();
        p.x;
        p.y;
        p.color;
        p.alpha;
        p.id;
        p.father;
        p.Container_initialize = p.initialize;
    p.initialize = function(x, y, color, alpha) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = alpha;
        this.makeShape();
    }
    
    p.setFather = function(parent) {
        this.father = parent;
    }
    p.getFather = function(parent) {
        return this.father;
    }

    p.makeShape = function()  {
        g = this;
        g.graphics.clear();
        g.graphics.alpha = this.alpha;
        g.graphics.beginFill(this.color).drawCircle(0,0, (16+1)*4);
    }
    window.Target = Target;
}(window));

