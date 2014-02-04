(function(window) { 
    function MelodicControl() {
        this.initialize();
    }
    var p = MelodicControl.prototype = new createjs.Container();
        p.playlist = [];
        p.playlistPosition = 0;
        p.empty = '';
        p.playingCircle = '';
        p.Container_initialize = p.initialize;

    p.initialize = function() {
         var self = this;
         (function(self) {
            createjs.Ticker.addEventListener('tick', function() {
                self.tick();
            });
        })(this);
    }

    p.addToPlaylist = function(melodicCircle) {
        this.playlist.push(melodicCircle);
    }

    p.playAll = function() {
        this.playListPosition = 0;
        this.playNext();
    }

    p.playNext = function() {
        console.log('triggered');
        var nextItem = this.playlist[this.playlistPosition];
        this.playItem(nextItem);
        this.playlistPosition++;
    }

    p.pauseAll = function() {
        this.chainMode = false;
    }

    p.playItem = function(melodicCircle) {
        this.playingCircle = melodicCircle;
        melodicCircle.play();
        currentSong.setPosition(melodicCircle.getPosition());
        currentSong.play();
    }

    p.triggerPlayback = function(melodicCircle) {
        if (melodicCircle.isPlaying()) {
            currentSong.setPosition(melodicCircle.getOffsets().playStart);
            return;
        }
        if (this.isPlayingSolo()) {
            this.playingCircle.pause();
            this.playingCircle.resetIcon();
        }
        this.playItem(melodicCircle);
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

