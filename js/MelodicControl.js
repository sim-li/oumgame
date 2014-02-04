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
            self.addEventListener('tick', function() {
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
        instance.setPosition(melodicCircle.getPosition());
        instance.play();

    }

    p.isPlayingSolo = function() {
        return this.playingCircle != this.empty;
    }

    p.ticka = function() {
    var me = this; 
    console.log(me.isPlayingSolo());
    console.log('HELLO');
        if (me.isPlayingSolo()) {
            me.playingCircle.setPosition(instance.getPosition());
            console.log(me.playingCircle.getPosition(),  p.playingCircle.getOffsets().playEnd);

            if (me.playingCircle.getPosition() > p.playingCircle.getOffsets().playEnd) {
                me.playingCircle.pause();
                me.isPlayingSolo = me.empty;
                instance.pause();
            }
        }
    }

    window.MelodicControl = MelodicControl;
}(window));

