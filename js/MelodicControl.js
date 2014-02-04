(function(window) { 
    function MelodicControl() {
        this.initialize();
    }
    var p = MelodicControl.prototype = new createjs.Container();
        p.playlist = [];
        p.playlistPosition = 0;
        p.empty = '';
        p.playingCircle = '';
        p.chainMode = false;
        p.Container_initialize = p.initialize;

    p.initialize = function() {
         var self = this;
         (function(self) {
            createjs.Ticker.addEventListener('tick', function() {
                self.tick();
            });
        })(this);
    }

     p.play = function(melodicCircle) {
        if (melodicCircle.isPlaying()) {
            currentSong.setPosition(melodicCircle.getOffsets().playStart);
            return;
        }
        if (this.isDefined(this.playingCircle)) {
            this.playingCircle.pause();
            this.playingCircle.resetIcon();
        }
            this.playingCircle = melodicCircle;
            melodicCircle.play();
            currentSong.setPosition(melodicCircle.getPosition());
            currentSong.play();
    }

    p.playAll = function() {
        var me = this;
        me.chainMode = true;
        me.play(me.playlist[me.playlistPosition]);
        console.log(me.playlist);
    }

  
    p.flushPlaylist = function() {
        me.playlist = [];
    }

    p.stop = function() {
        var me = this;
        me.chainMode = false;
        me.playlistPosition = 0;
        me.playingCircle.pause();
        me.playingCircle.resetPosition();
        me.playingCircle = me.empty;
        // me.flushPlaylist();
        currentSong.pause();
    }

    p.tick = function() {
        var me = this; 
        if (!me.isDefined(me.playingCircle)) {
            return;
        }
        if (currentSong.getPosition() > me.playingCircle.getOffsets().playEnd) {
            if (!me.chainMode || this.playlistPosition === (this.playlist.length - 1)) {
                me.stop();
                return;
            }
            this.playlistPosition++;
            var nextItem = this.playlist[this.playlistPosition];
            this.play(nextItem);
        }
    }

    p.addToPlaylist = function(melodicCircle) {
        this.playlist.push(melodicCircle);
    }
    
    p.isPlaying = function(melodicCircle) {
        return this.playingCircle === melodicCircle;
    }
    
    p.isDefined = function(object) {
        if (object === '') { 
            return false;
        }
        return typeof object != 'undefined';
    }

    window.MelodicControl = MelodicControl;
}(window));

