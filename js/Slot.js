(function(window) {
    function Slot(iNumber, x, y, radius) {
        this.initialize(iNumber, x, y, radius);
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
        me.iNumber = iNumber;
        me.x = x + iNumber * 200;
        me.y = y;
        me.radius = radius;
        me.generateId(iNumber);
        me.makeShape();
    }
    p.generateId = function(i) {
        this.id = Number.POSITIVE_INFINITY - i;
    }
    p.getId = function() {
        return this.id;
    }
    p.isMelodicCircle = function() {
        return false;
    }
    p.makeShape = function()  {
        me = this;
        me.graphics.clear();
        me.graphics.alpha = 1;
        me.graphics.beginFill(me.color).drawCircle(0, 0, me.radius);
    }
    window.Slot = Slot
;
}(window));

