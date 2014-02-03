(function(window) {
    function Slot(x, y, radius) {
        this.initialize(x, y, radius);
    }
    var p = Slot.prototype = new createjs.Shape();
        p.x;
        p.y;
        p.id;
        p.iNumber;
        p.color = '#1C1C1C';
        p.radius;
        p.Container_initialize = p.initialize;
    p.initialize = function(iNumber, x, y, radius) {
        var me = this;
        me.x = x;
        me.y = y;
        me.iNumber = iNumber;
        me.radius = radius;
        me.makeShape();
    }
    p.generateId = function(i) {
        this.id = Number.POSITIVE_INFINITY - i;
    }
    p.getId = function() {
        return this.id;
    }
    p.makeShape = function()  {
        me = this;
        me.graphics.clear();
        me.graphics.alpha = 1;
        me.graphics.beginFill(me.color).drawCircle(0, 0, (16 + 1) * 4);
    }
    window.Slot = Slot
;
}(window));

