(function() {

    var MAPS = [];

    var currentLevel = 0;
    var levelUnlocked = 0;

    window.unlocked = function(level) {
        return level <= levelUnlocked;
    };

    window.getCurrentLevel = function() {
        return currentLevel;
    };

    window.nextLevel = function() {
        currentLevel = ++currentLevel % MAPS.length;
    };

    window.unlockLevel = function(level) {
        levelUnlocked = Math.max(level, levelUnlocked);
    };

    window.previousLevel = function() {
        if (--currentLevel < 0) currentLevel = MAPS.length - 1;
    };

    window.setLevel = function(level) {
        currentLevel = level;
    };

    window.getMap = function() {
        return MAPS[getCurrentLevel()];
    };

}());