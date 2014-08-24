(function() {

    var level1 = {
        planets : [
            { x : 350, y : 90, population : 322, range : 200}],
        portal : { x : 500, y : 90 },
        voidSpeed : 0.5,
        text : 'You must escape from the void!',
        text2 : 'Connect planet with wormhole by clicking on them'
    };

    var level2 = {
        planets : [
            {x : 220, y : 30},
            { x : 330, y : 140}],
        portal : { x : 500, y : 100},
        voidSpeed : 0.5,
        text : 'You need to save at least 75% of the galaxy population',
        text2 : 'You can see the population meter on top'
    };

    var level3 = {
        planets : [
            { x : 200, y : 20},
            { x : 200, y : 160, escapeRate : 3, population : 300},
            { x : 340, y : 130}],
        portal : { x : 470, y : 100},
        voidSpeed : 0.8,
        text : 'You need to save at least 75% of the galaxy population',
        text2 : 'You can see the population meter on top'
    };

    var level4 = {
        planets : [
            { x : 50, y : 100},
            { x : 200, y : 30},
            { x : 340, y : 170}],
        portal : { x : 500, y : 70},
        voidSpeed : 1,
        text : 'You need to save at least 75% of the galaxy population',
        text2 : 'You can see the population meter on top'

    };

    var level5 = level1;
    var level6 = level2;
    var level7 = level3;

    var MAPS = [level1, level2, level3, level4, level5, level6, level7];

    var TOTAL_LEVELS = DEMO ? 7 : 14;

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

    window.epilogue = function() {
        return currentLevel == TOTAL_LEVELS;
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