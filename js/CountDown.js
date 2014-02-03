(function(window) {
    function Countdown() {
        this.initialize();
    }
    var p = Countdown.prototype = new createjs.Shape(x, y);
        p.instance;
        p.Container_initialize = p.initialize;
    p.initialize = function(x, y) {
        this.Container_initialize();
        this.makeShape();
        this.x = x;
        this.y = y;
        var self = this;
    }
    p.makeShape = function()  {
        g = this;
        g.graphics.clear();
        countdownLabel = new createjs.Text('30', 'bold 36px Arial', '#FFFFFF');
        countdownLabel.alpha = 0.5;
        countdownLabel.x = 0;
        countdownLabel.y = 0;
        resetLabel =  new createjs.Text('Restart', 'bold 36px Arial', '#FFFFFF');
        resetLabel.alpha = 0.5;
        resetLabel.x = 60;
        resetLabel.y = 0;
        resetLabel.on('click', function(evt) {
        countDown = 30;
    });

    }
    window.Countdown = Countdown;
}(window));

