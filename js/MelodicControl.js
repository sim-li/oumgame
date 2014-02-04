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
        p.blockSinglePlay = false;
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
        if (this.blockSinglePlay) {
            return;
        }
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
    }

  
    p.flushPlaylist = function() {
        me.playlist = [];
    }

    p.stop = function() {
        var me = this;
        me.chainMode = false;
        me.playlistPosition = 0;
        if (this.isDefined(me.playingCircle)) {
            me.playingCircle.pause();
            me.playingCircle.resetPosition();
            me.playingCircle = me.empty;
        }
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
        if (!this.contains(melodicCircle)) {
            this.playlist.push(melodicCircle);
        }
    }

    p.removeFromPlaylist = function(melodicCircle) {
        var index = this.playlist.indexOf(melodicCircle);
        if (index > -1) {
            this.playlist.splice(index, 1);
        }
    }
    
    p.isPlaying = function(melodicCircle) {
        return this.playingCircle === melodicCircle;
    }

    p.contains = function (melodicCircle) {
        var i = this.playlist.length;
        while (i--) {
           if (this.playlist[i] === melodicCircle) {
               return true;
           }
        }
        return false;
    }

    p.isDefined = function(object) {
        if (object === '') { 
            return false;
        }
        return typeof object != 'undefined';
    }

    window.MelodicControl = MelodicControl;
}(window));

