(function() {
    //ui settings
    window.fps = 60;
    window.WIDTH = 640;
    window.HEIGHT = 240;

    window.SCALE = 2;

    window.PLANET_SIZE = 64;

    window.DEBUG = false;

    window.VOID_RATE = 4;

    window.DEFAULT_RANGE = 250;
    window.DEFAULT_POPULATION = 100;
    window.DEFAULT_ESCAPE_RATE = 1;
    window.DEFAULT_MAX_POPULATION = 99999;

    window.DEMO = true;

    window.GAME_STATE = {
        LEVEL : 'level',
        MAIN_MENU : 'mainmenu',
        AFTER_LEVEL : 'afterlevel',
        THE_END : 'end'
    };

    window.cookie = {
        MUTED : "salvation.muted",
        UNLOCKED : "salvation.unlocked",
        PERFECT : "salvation.perfect"
    };

    window.randomInt = function(to) {
        return Math.round(Math.random() * (to - 1));
    };

    window.currentTime = function() {
        return new Date().getTime();
    };

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