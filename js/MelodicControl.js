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
            this.playingCircle = melodicCircle;
            melodicCircle.play();
            currentSong.setPosition(melodicCircle.getPosition());
            currentSong.play();
        }
    }

    p.playAll = function() {
        var me = this;
        me.playListPosition = 1;
        // Plays first item
        me.playingCircle = me.playlist[me.playlistPosition];
        me.playingCircle.play();
        currentSong.setPosition(melodicCircle.getPosition());
        currentSong.play();
        me.chainMode = true;
    }

  
    p.pause = function() {
        var me = this;
        me.chainMode = false;
        me.playlistPosition = 0;
        me.playingCircle.pause();
        me.playingCircle.resetPosition();
        me.playingCircle = me.empty;
        currentSong.pause();
    }

   
    p.tick = function() {
        var me = this; 
        if (!me.isDefined(me.playingCircle)) {
            return;
        }
        console.log(me.playingCircle);
        if ((currentSong.getPosition() > me.playingCircle.getOffsets().playEnd) || 
            this.playlistPosition === (this.playlist.length - 1)) {

            me.pause();
            return;
        }
        if (me.chainMode) {
            var nextItem = this.playlist[this.playlistPosition];
            this.play(nextItem);
            this.playlistPosition++;
        }
    }

    p.addToPlaylist = function(melodicCircle) {
        this.playlist.push(melodicCircle);
    }
    
    p.isDefined = function(object) {
        if (object === '') { 
            return false;
        }
        return typeof object != 'undefined';
    }

    window.MelodicControl = MelodicControl;
}(window));

