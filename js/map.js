(function() {

    var MAPS = [];

    var currentLevel = 0;

    window.getCurrentLevel = function() {
        return currentLevel;
    };

    window.nextLevel = function() {
        currentLevel = ++currentLevel % MAPS.length;
    };

    window.previousLevel = function() {
        if (--currentLevel < 0) currentLevel = MAPS.length - 1;
    };

    window.getMap = function() {
        return MAPS[getCurrentLevel()];
    };

}());