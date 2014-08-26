(function() {

    var level1 = {
        planets : [
            { x : 250, y : 90, population : 500, range : 280}
        ],
        portal : { x : 500, y : 90 },
        voidSpeed : 0.5,
        text : 'You must escape from the void!',
        text2 : 'Connect planet with wormhole by clicking on them'
    };

    var level2 = {
        planets : [
            { x : 150, y : 20, population : 550, range : 400},
            { x : 150, y : 160, population : 550, range : 400}
        ],
        portal : { x : 500, y : 90 },
        voidSpeed : 1.2,
        text : 'You need to save at least 75% of the galaxy population',
        text2 : 'Check the population meter above'
    };

    var level3 = {
        planets : [
            { x : 220, y : 30, population : 200, range : 180},
            { x : 330, y : 140, population : 200, range : 200}
        ],
        portal : { x : 500, y : 100},
        voidSpeed : 2,
        text : 'Planets cannot receive and send simultaneously',
        text2 : 'You should get your priorities straight'
    };

    var level4 = {
        planets : [
            { x : 200, y : 20, population : 350, range : 200},
            { x : 200, y : 160, population : 350, range : 200},
            { x : 340, y : 80, maxPopulation : 50, range : 150}
        ],
        portal : { x : 470, y : 100},
        voidSpeed : 0.8,
        text : 'Some planets are over-populated and have limited capacity',
        text2 : 'Those bottlenecks are mean'
    };

    var level5 = {
        planets : [
            { x : 130, y : 35, population : 400},
            { x : 130, y : 145, population : 400},
            { x : 330, y : 20, population : 600, escapeRate : 0.5, range : 200},
            { x : 320, y : 125, population : 600, escapeRate : 3, range : 160}
        ],
        portal : { x : 450, y : 140},
        voidSpeed : 1,
        text : 'Planet transfer speed may differ',
        text2 : 'You should choose wisely'
    };

    var level6 = {
        planets : [
            { x : 20, y : 100, population : 200},
            { x : 100, y : 30, population : 100, range : 300},
            { x : 340, y : 170, range : 200}
        ],
        portal : { x : 500, y : 70},
        voidSpeed : 1,
        text : 'Sometimes, you have no time to plan',
        text2 : 'You just have to act'

    };

    var level7 = {
        planets : [
            { x : 90, y : 180, population : 500, escapeRate : 10, range : 450},
            { x : 190, y : 50, population : 300, range : 200},
            { x : 230, y : 150, population : 300, range : 180},
            { x : 380, y : 80, population : 140, escapeRate : 0.1, range : 200}
        ],
        portal : {x : 500, y : 70},
        voidSpeed : 1,
        text : 'Sometimes, situation seems to be hopeless',
        text2 : 'But there\'s always a way out'
    };

    var MAPS = [level1, level2, level3, level4, level5, level6, level7];

    var perfect = parsePerfect(res.getCookie(cookie.PERFECT));

    var TOTAL_LEVELS = DEMO ? 7 : 14;

    var currentLevel = 0;
    var levelUnlocked = res.getCookie(cookie.UNLOCKED, 0);

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
        currentLevel = Math.min(++currentLevel, TOTAL_LEVELS);
    };

    window.epilogue = function() {
        return currentLevel >= TOTAL_LEVELS;
    };

    window.unlockLevel = function(level) {
        levelUnlocked = Math.max(level, levelUnlocked);
        res.setCookie(cookie.UNLOCKED, levelUnlocked);
    };

    window.setPerfect = function(level) {
        perfect[level] = true;
        savePerfect();
    };

    function parsePerfect(data) {
        var perfect = {};
        if (data != null) {
            var levels = data.split(',');
            levels.forEach(function(level) {
                perfect[String(level)] = true;
            });
        }
        return perfect;
    }

    function savePerfect() {
        var data = '';
        for (var level in perfect) {
            if (!perfect.hasOwnProperty(level)) continue;
            data += (parseInt(level)) + ',';
        }
        res.setCookie(cookie.PERFECT, data.substr(0, data.length - 1));
    }

    window.isPerfect = function(level) {
        return perfect[level] == true;
    };

    window.allPerfect = function() {
        for (var i = 0; i < TOTAL_LEVELS; i++) {
            if (!isPerfect(i)) return false;
        }
        return true;
    };

    window.previousLevel = function() {
       currentLevel = Math.max(--currentLevel, 0);
    };

    window.setLevel = function(level) {
        currentLevel = level;
    };

}());