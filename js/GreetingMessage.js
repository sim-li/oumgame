(function(window) {
    function GreetingMessage() {
        this.initialize();
    }
    var p = GreetingMessage.prototype = new createjs.Shape(x, y);
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
        var infoLabel = new createjs.Text('Click to listen. Reconstruct the song in the right order.', 'bold 24px Arial', '#FFFFFF');
        infoLabel.x = 210;
        infoLabel.y = 8; 
        infoLabel.alpha = 0.3;
        this.add(infoLabel);
    });

    }
    window.GreetingMessage = GreetingMessage;
}(window));

