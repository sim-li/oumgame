(function(window) { 
    function Timeline() {
        this.initialize();
    }
    var p = Timeline.prototype = new createjs.Container();
        p.blockList = [];
        p.count = 0;
        p.Container_initialize = p.initialize;
    p.initialize = function() {
        this.Container_initialize();
        this.on('pressmove', function(evt) {
        evt.currentTarget.x = evt.stageX ;
        evt.currentTarget.y = evt.stageY ;
        stage.update();
    });
    }


    p.randomSoundData = function() {
        var soundData = [];
        for (i = 0; i < 16; i++) {
            soundData[i] = Math.random() * 255;
        }
        return soundData;
    }

    p.build = function(size) {
        for (var i = 0, max = size; i < max; i++) {
            this.blockList[i] =  new Block(100, 300, 0, this.randomSoundData(), 15000, 16010);
            console.log(this.randomSoundData());
            this.addChild(new Block(100, 300, 0, this.randomSoundData(), 15000, 16010));
        }
    }
    p.tick = function() { 
    }
    window.Timeline = Timeline;
}(window));

