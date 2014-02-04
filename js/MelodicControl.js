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
            currentSong.setPosition(melodicCircle.getOffsets().playStart);
            return;
        }
        if (this.isPlayingSolo()) {
            this.playingCircle.pause();
        }
        this.playingCircle = melodicCircle;
        melodicCircle.play();
        currentSong.setPosition(melodicCircle.getPosition());
        currentSong.play();
    }

    p.isPlayingSolo = function() {
        return this.playingCircle != this.empty;
    }

    p.tick = function() {
    var me = this; 
        if (me.isPlayingSolo()) {
            if (currentSong.getPosition() > me.playingCircle.getOffsets().playEnd) {
                me.playingCircle.pause();
                me.playingCircle.resetPosition();
                me.playingCircle = me.empty;
                currentSong.pause();
            }
        }
    }

    window.MelodicControl = MelodicControl;
}(window));

