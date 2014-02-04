(function(window) { 
    function MelodicControl() {
        this.initialize();
    }
    var p = MelodicControl.prototype = new createjs.Container();
        p.playlist = [];
        p.empty = '';
        p.playingCircle = '';
        p.Container_initialize = p.initialize;

    p.initialize = function() {
         (function(self) {
            createjs.Ticker.addEventListener('tick', function() {
                self.tick();
            });
        })(this);
    }

    p.addToPlaylist = function(melodicCircle) {
        playlist.push(melodicCircle);
    }

    p.playAll = function() {

    }

    p.triggerPlayback = function(melodicCircle) {
        if (melodicCircle.isPlaying()) {
            instance.setPosition(melodicCircle.getOffsets().playStart);
            return;
        }
        this.playingCircle = melodicCircle;
        melodicCircle.play();
        instance.setPosition(melodicCircle.getPosition());
        instance.play();

    }

    p.isPlayingSolo = function() {
        return this.playingCircle != this.empty;
    }

    p.tick = function() {
    var me = this; 
        if (me.isPlayingSolo()) {
            me.playingCircle.setPosition(instance.getPosition());
            if (me.playingCircle.getPosition() > me.playingCircle.getOffsets().playEnd) {
                me.playingCircle.pause();
                me.playingCircle = me.empty;
                instance.pause();
            }
        }
    }

    window.MelodicControl = MelodicControl;
}(window));

