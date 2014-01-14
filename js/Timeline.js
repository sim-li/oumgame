(function(window) { 
    function Timeline() {
        this.initialize();
    }
    var p = Timeline.prototype = new createjs.Container();
        p.blockList = [];
        p.count = 0;
    p.initialize = function() {
        this.Container_initialize();
    }
    p.addBlock(block) {

    }
    p.build() {

    }
    p.tick = function() { 
    }
    window.Block = Block;
}(window));

