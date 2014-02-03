(function(window) {
    function WinMessage() {
        this.initialize();
    }
    var p = WinMessage.prototype = new createjs.Shape(x, y);
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
        winLabel = new createjs.Text('Game over', 'bold 146px Arial', '#FFFFFF');
        winLabel.alpha = 0.5;
        winLabel.x = 30;
        winLabel.y = 140;
        winSubLabel =  new createjs.Text('Try harder next time.', 'bold 72px Arial', '#FFFFFF');
        winSubLabel.alpha = 0.5;
        winSubLabel.x = 50;
        winSubLabel.y = 270;
        this.winLabel.visible = false;
        this.winSubLabel.visible = false;
        this.add(winLabel);
        this.add(winSubLabel);
    }
    window.WinMessage = WinMessage;
}(window));

