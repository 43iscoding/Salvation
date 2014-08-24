(function() {

    var level1 = {
        planets : [
            { x : 350, y : 90, rate : 2, population : 322, range : 200}],
        portal : { x : 500, y : 90 },
        voidSpeed : 0.5
    };

    var level2 = {
        planets : [
            {x : 220, y : 30},
            { x : 330, y : 140}],
        portal : { x : 500, y : 100},
        voidSpeed : 0.5
    };

    var level3 = {
        planets : [
            { x : 200, y : 10},
            { x : 200, y : 170, rate : 3, population : 300},
            { x : 340, y : 130}],
        portal : { x : 470, y : 100},
        voidSpeed : 0.8
    };

    var level4 = {
        planets : [
            { x : 50, y : 100},
            { x : 200, y : 30},
            { x : 340, y : 170}],
        portal : { x : 500, y : 70},
        voidSpeed : 1
    };

    var MAPS = [level1, level2, level3, level4];

    var currentLevel = 0;
    var levelUnlocked = 0;

    window.unlocked = function(level) {
        return level <= levelUnlocked;
    };

    window.getCurrentLevel = function() {
        return currentLevel;
    };

    window.getCurrentLevelConfig = function() {
        return MAPS[currentLevel];
    };

    window.nextLevel = function() {
        currentLevel = ++currentLevel;
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