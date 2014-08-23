(function() {
    //ui settings
    window.fps = 60;
    window.WIDTH = 320;
    window.HEIGHT = 240;

    window.PLANET_SIZE = 64;

    window.DEBUG = false;

    window.cookie = {
        MUTED : "muted",
        HIGHSCORE : "highscore"
    };

    window.GRAVITY = 0.12;
    window.FREE_FALL = 5;
    window.FRICTION = 0.15;
    window.ICE_SLIDING = 0.37;

    window.SEASON = {
        SPRING : 'Spring',
        SUMMER : 'Summer',
        AUTUMN : 'Autumn',
        WINTER : 'Winter'
    };

    window.randomInt = function(to) {
        return Math.round(Math.random() * (to - 1));
    };

    window.currentTime = function() {
        return new Date().getTime();
    };

    window.SEASON_COOLDOWN = 1000;

    window.DEFAULT_SEASON = SEASON.SUMMER;

    window.PIXEL_RATIO = function () {
        var ctx = document.getElementById("canvas").getContext("2d"),
            dpr = window.devicePixelRatio || 1,
            bsr = ctx.webkitBackingStorePixelRatio ||
                ctx.mozBackingStorePixelRatio ||
                ctx.msBackingStorePixelRatio ||
                ctx.oBackingStorePixelRatio ||
                ctx.backingStorePixelRatio || 1;
        return dpr / bsr;
    };

}());