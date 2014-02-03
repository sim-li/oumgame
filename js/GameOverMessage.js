(function(window) {
    function GameOverMessage() {
        this.initialize();
    }
    var p = GameOverMessage.prototype = new createjs.Shape(x, y);
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
        gameoverLabel = new createjs.Text('Game over', 'bold 146px Arial', '#FFFFFF');
        gameoverLabel.alpha = 0.5;
        gameoverLabel.x = 30;
        gameoverLabel.y = 140;
        gameoverSubLabel =  new createjs.Text('Try harder next time.', 'bold 72px Arial', '#FFFFFF');
        gameoverSubLabel.alpha = 0.5;
        gameoverSubLabel.x = 50;
        gameoverSubLabel.y = 270;
        this.add(gameoverLabel);
        this.add(gameoverSubLabel);
        /* SHOW GAME OVER ON TIME UP */
        gameoverLabel.visible = false;
        gameoverSubLabel.visible = false;
    });

    }
    window.GameOverMessage = GameOverMessage;
}(window));

