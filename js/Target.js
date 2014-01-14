(function(window) {
    function Target(x, y, color, alpha) {
        this.initialize(x, y, color, alpha);
    }
    var p = Target.prototype = new createjs.Shape();
        p.x;
        p.y;
        p.color;
        p.alpha;
        p.Container_initialize = p.initialize;
    p.initialize = function(x, y, color, alpha) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.alpha = alpha;
        this.makeShape();
        var self = this;
        (function(self) {
            // self.addEventListener('click', function() {
            //     self.handleClick();
            // });
            // self.addEventListener('tick', function() {
            //     self.tick();
            // });
            // instance.addEventListener('startingplayback', function() {
            //     self.handlePlayStart();
            // });
            // instance.addEventListener('complete ', function() { 
            //     if (self.isRowPlay) {
            //         console.log('Next!');
            //         self.handleComplete(); 
            //     }
            // })
        })(this);
    }
    p.makeShape = function()  {
        g = this;
        g.graphics.clear();
        g.graphics.alpha = this.alpha;
        g.graphics.beginFill(this.color).drawCircle(0,0, (16+1)*4);
    }
    p.tick = function() { 
    }
    window.Target = Target;
}(window));

