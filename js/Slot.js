(function(window) {
    function Slot(x, y, color, alpha) {
        this.initialize(x, y, color, alpha);
    }
    var p = Slot.prototype = new createjs.Shape();
        p.x;
        p.y;
        p.color;
        p.alpha;
        p.id;
        p.Container_initialize = p.initialize;
    p.initialize = function(x, y, color, alpha) {
        var me = this;
        me.x = x;
        me.y = y;
        me.color = color;
        me.alpha = alpha;
        me.makeShape();
    }
    p.generateId = function() {

    }
    p.getId = function() {

    }
    p.makeShape = function()  {
        me = this;
        me.graphics.clear();
        me.graphics.alpha = this.alpha;
        me.graphics.beginFill(this.color).drawCircle(0, 0, (16 + 1) * 4);
    }
    window.Slot = Slot
;
}(window));

