(function() {

var objects = [];
var particles = [];

var levelComplete = false;

var selected = null;

var counter = 0;

var VOID = null;

var populationLost = 0;
var totalPopulation = 0;

var uiEntities = [];

var portal;

var planetPool = [];
var PLANET_TYPES = 12;

var saveThreshold = 0.75;

var state = STATE.MAIN_MENU;

window.getState = function() {
    return state;
};

window.getPopulationInfo = function() {
    return {
        total : totalPopulation,
        lost : populationLost,
        saved : portal.getPopulation(),
        thresh : saveThreshold,
        weLost : function() {
            return this.lost >= this.total * (1 - this.thresh);
        },
        weWon : function() {
            return this.saved >= this.total * this.thresh;
        }
    };
};

window.getVoid = function() {
    return VOID;
};

window.getObjects = function() {
    return objects;
};
window.getSelected = function() {
    return selected;
};

window.init = init;

function init() {
    initUI();
    input.onClicked(onClicked);
    startLevel();
    tick();
    //sound.play('noise1', true);
}

function initUI() {
    uiEntities = [];
    uiEntities.push(spawn(TYPE.BUTTON, 0, 50, 'level1'));
    uiEntities.push(spawn(TYPE.BUTTON, 50, 50, 'level2'));
    uiEntities.push(spawn(TYPE.BUTTON, 50, 50, 'level3'));
    uiEntities.push(spawn(TYPE.BUTTON, 50, 50, 'level4'));
    uiEntities.push(spawn(TYPE.BUTTON, 279, 123, 'loseMenu'));
    uiEntities.push(spawn(TYPE.BUTTON, 324, 123, 'loseRestart'));
    uiEntities.push(spawn(TYPE.BUTTON, 259, 124, 'winMenu'));
    uiEntities.push(spawn(TYPE.BUTTON, 301, 124, 'winRestart'));
    uiEntities.push(spawn(TYPE.BUTTON, 342, 124, 'winNext'));
}

function startLevel() {
    state = GAME_STATE.LEVEL;
    initStars();
    resetPlanetPool();
    objects = [];
    particles = [];
    populationLost = 0;
    totalPopulation = 0;
    selected = null;
    VOID = generateVoid(0);
    objects.push(generatePlanet(50, 100));
    objects.push(generatePlanet(200, 30));
    objects.push(generatePlanet(340, 170));
    portal = spawn(TYPE.PORTAL, 500, 70);
    objects.push(portal);
}

function generateVoid(pos) {
    return {to : pos, offset: randomInt(300)};
}

function generatePlanet(x, y) {
    var style = planetPool.pop();
    var population = 150 + randomInt(20) * 10;
    totalPopulation += population;
    return spawn(TYPE.PLANET, x, y, { style : style, population : population});
}

function resetPlanetPool() {
    planetPool = [];
    for (var i = 0; i < PLANET_TYPES; i++) {
        planetPool.push(i);
    }
    shuffle(planetPool);
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function tick() {
    counter++;
    if (DEBUG) debug.calculateUPS();
    var from = currentTime();
    processInput();
    update();
    render(objects, particles);
    if (levelComplete) win();
    setTimeout(tick, 1000 / fps - (currentTime() - from));
}

function win() {
    //TODO: move to next level
}

function onClicked(x, y) {
    objects.forEach(function(object) {
        object.setSelected(false);
    });

    if (state == GAME_STATE.LEVEL) {
        for (var i = 0; i < objects.length; i++) {
            if (objects[i].type != TYPE.PLANET) continue;
            var planet = objects[i];
            if (planet.dead()) {
                if (planet == selected) {
                    selected = null;
                    return;
                }
                continue;
            }

            if (engine.containsPoint(planet, x, y)) {
                if (selected == null) {
                    selected = planet;
                    planet.setSelected(true);
                } else if (selected == planet) {
                    selected = null;
                } else {
                    //make tunnel
                    if (engine.distance(selected.getCenter(), planet.getCenter()) < TUNNEL_RADIUS) {
                        addOrRemoveTunnel(selected, planet);
                    }
                    selected = null;
                }
                return;
            }
        }
        selected = null;
    } else if (state == GAME_STATE.AFTER_LEVEL) {
        var info = getPopulationInfo();

        for (var j = 0; j < uiEntities.length; j++) {
            if (engine.containsPoint(uiEntities[j], x, y)) {
                if (!uiEntities[j].win && info.weWon()) continue;
                if (uiEntities[j].win && info.weLost()) continue;

                if (uiEntities[j].id.indexOf('Restart') > 0) {
                    startLevel();
                } else if (uiEntities[j].id.indexOf('Next') > 0) {
                    nextLevel();
                    startLevel();
                } else if (uiEntities[j].id.indexOf('Menu') > 0) {
                    state = GAME_STATE.MAIN_MENU;
                } else {
                    console.log('Unknown button: ' + uiEntities[j].id);
                }
            }
        }
    } else if (state == GAME_STATE.MAIN_MENU) {
        console.log('clicked in main menu!');
    }
}

function addOrRemoveTunnel(from, to) {
    for (var i = objects.length - 1; i >= 0; i--) {
        if (objects[i].type != TYPE.TUNNEL) continue;
        var tunnel = objects[i];
        if (tunnel.from == from) {
            objects.splice(i, 1);
            if (tunnel.to == to) return;
        } else if (tunnel.from == to && tunnel.to == from) {
            objects.splice(i, 1);
        }
    }
    objects.push(spawn(TYPE.TUNNEL, 0, 0, {from: from, to : to}));
}

function processInput() {
    if (levelComplete) return;
    //movement

    if (input.isPressed(input.keys.RIGHT.key)) {

    } else if (input.isPressed(input.keys.LEFT.key)) {

    } else if (input.isPressed(input.keys.UP.key)) {

    } else if (input.isPressed(input.keys.DOWN.key)) {

    }

    //special
    if (input.isPressed(input.keys.R.key)) {
        input.clearInput(input.keys.R.key);
        startLevel();
    }

    if (input.isPressed(input.keys.F.key)) {
        //input.clearInput(input.keys.F.key);
        //loader.toggleFullscreen();
    }

    if (input.isPressed(input.keys.LEFT_BRACKET.key)) {
        input.clearInput(input.keys.LEFT_BRACKET.key);
        previousLevel();
        startLevel();
    }

    if (input.isPressed(input.keys.RIGHT_BRACKET.key)) {
        input.clearInput(input.keys.RIGHT_BRACKET.key);
        nextLevel();
        startLevel();
    }
}

function update() {
    for (var i = objects.length - 1; i >= 0; i--) {
        if (updateEntity(objects[i])) objects.splice(i, 1);
    }

    //process particles
    for (var j = particles.length - 1; j >= 0; j--) {
        if (updateParticle(particles[j])) {
            particles.splice(j, 1);
        }
    }
    var info = getPopulationInfo();

    if (info.weLost()) {
        VOID = generateVoid(VOID.to + 2);
    } else if (!info.weWon() && counter % VOID_RATE == 0) {
        VOID = generateVoid(++VOID.to);
    }

    if (state == GAME_STATE.LEVEL) {
        if (info.weLost() || info.weWon()) {
            selected = null;
            state = GAME_STATE.AFTER_LEVEL;
        }
    }
}

function updateEntity(entity) {
    entity.update();
    if (entity.type == TYPE.PLANET) {
        if (entity.died()) {
            var center = entity.getCenter();
            if (entity.getPopulation() > 0) {
                addParticle(TYPE.PARTICLE.DIED, center.x, center.y, {value : entity.getPopulation()});
            }
            //sound.play('explosion', false);
            populationLost += entity.getPopulation();
            entity.resetPopulation();
            if (selected == entity) {
                entity.selected = false;
                selected = null;
            }
        } else if (entity.getPopulation() == 0) {
            if (selected == entity) {
                entity.selected = false;
                selected = null;
            }

        }
    } else if (entity.type == TYPE.TUNNEL) {
        return (entity.to.dead() || entity.from.dead() || entity.from.getPopulation() == 0);
    }
    return false;
}

function updateParticle(particle) {
    if (particle.updateSprite()) {
        return true;
    }

    if (engine.offScreen(particle)) return true;

    return particle.update();
}

function addParticle(type, x, y, args) {
    particles.push(spawn(type, x, y, args));
}

}());