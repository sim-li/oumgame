(function(window) { 
    function MelodicControl() {
        this.initialize();
    }
    var p = MelodicControl.prototype = new createjs.Container();
        p.playlist = [];
        p.playlistPosition = -1;
        p.empty = '';
        p.playingCircle = '';
        p.chainMode = false;
        p.noSinglePlay = false;
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
        if (this.noSinglePlay) {
            return;
        }
        if (this.isDefined(melodicCircle) && melodicCircle.isPlaying()) {
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

    p.blockSinglePlay = function() {
        if (!this.chainMode) {
            this.noSinglePlay = true;
        } else {
            this.noSinglePlay = false;
        }
    }

    p.releaseSinglePlay = function() {
        if (!this.chainMode) {
            this.noSinglePlay = false;
        }
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
            if (!me.chainMode || this.playlistPosition === 0) {
                me.stop();
                return;
            }
            this.playlistPosition--;
            var nextItem = this.playlist[this.playlistPosition];
            this.play(nextItem);
        }
    }

    p.addToPlaylist = function(melodicCircle) {
        if (!this.contains(melodicCircle)) {
            this.playlist.push(melodicCircle);
            this.playlistPosition = this.playlist.length - 1;
            this.sortPlaylist();
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

    p.sortPlaylist = function () {
        this.playlist.sort(this.sortfunction)
    }

    p.sortfunction = function (a, b){
        if (a.getDockedId() > b.getDockedId()) {
            return 1;
        }
        if (a.getDockedId() < b.getDockedId()) {
            return -1;
        }
        if (a.getDockedId() === b.getDockedId()) {
            return 0;
        }
    }

    p.checkForWin = function() {
        var i = this.playlist.length;
        while (i--) {
            if (this.playlist[i].hasCorrectSlot() === false) {
                return false;
            }
        }
        if (this.playlist.length === numberOfCircles) {
            return true;
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

