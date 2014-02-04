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
        if (this.isDefined(melodicCircle)) {
            this.playItem(melodicCircle);
        }
    }

    p.playAll = function() {
        this.chainMode = true;
        this.playListPosition = 0;
        if (this.playlistPosition === (this.playlist.length - 1)) {
            this.chainMode = false;
            this.playlistPosition = 0;
            this.stopCurrentSong();
            return;
        }
        var nextItem = this.playlist[this.playlistPosition];
        this.playingCircle = melodicCircle;
        melodicCircle.play();
        currentSong.setPosition(melodicCircle.getPosition());
        currentSong.play();
        this.playlistPosition++;
    }

  
    p.pause = function() {
        this.chainMode = false;
        var me = this;
        me.playingCircle.pause();
        me.playingCircle.resetPosition();
        me.playingCircle = me.empty;
        currentSong.pause();
    }

   
    p.tick = function() {
        var me = this; 
        if (me.isDefined(me.playingCircle) && currentSong.getPosition() > me.playingCircle.getOffsets().playEnd) {
            me.stopCurrentSong();
            if (me.chainMode) {
                me.playNext();
            }
        }
    }

    p.addToPlaylist = function(melodicCircle) {
        this.playlist.push(melodicCircle);
    }
    
    p.isDefined = function(object) {
        return typeof object != 'undefined';
    }

    window.MelodicControl = MelodicControl;
}(window));

