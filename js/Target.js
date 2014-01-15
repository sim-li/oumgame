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
        p.docked;
        p.gangTattoo;
        p.Container_initialize = p.initialize;
    p.initialize = function(x, y, color, alpha) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = alpha;
        this.docked = false;
        this.makeShape();
    }
    
    p.dock = function(block) {
        this.docked = block;
    }
    p.undock = function() {
        this.docked = false;
    }
    p.getDocked = function () {
        return this.docked;
    }
    p.sameGang = function() {

    }
    p.makeTattoo = function() {
        var d = new Date();
        var n = d.getTime();
        return tattoo = Math.random * 10000 + n;
    }
    p.setGangTattoo = function() {
        var tattoo = this.makeTattoo();
        this.getDocked.setGangTattoo(tattoo);
        this.gangTattoo = tattoo;
    }
    p.getGangTattoo = function() {
        return this.gangTattoo;
    }
    p.makeShape = function()  {
        g = this;
        g.graphics.clear();
        g.graphics.alpha = this.alpha;
        g.graphics.beginFill(this.color).drawCircle(0,0, (16+1)*4);
    }
    window.Target = Target;
}(window));

