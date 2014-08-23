(function() {

var objects = [];
var particles = [];

var levelComplete = false;

var selected = null;

var counter = 0;

var VOID = null;

var populationLost = 0;
var populationSaved = 0;
var totalPopulation = 0;

var planetPool = [];
var PLANET_TYPES = 12;

window.getPopulationInfo = function() {
    return { total : totalPopulation, lost : populationLost, saved : populationSaved };
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
    input.onClicked(onClicked);
    startLevel();
    tick();
}

function startLevel() {
    initStars();
    resetPlanetPool();
    objects = [];
    particles = [];
    populationLost = 0;
    totalPopulation = 0;
    populationSaved = 0;
    VOID = generateVoid(0);
    objects.push(generatePlanet(50, 100));
    objects.push(generatePlanet(200, 10));
    objects.push(generatePlanet(340, 170));
    objects.push(spawn(TYPE.PORTAL, 500, 70));
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
    if (counter % VOID_RATE == 0) {
        VOID = generateVoid(++VOID.to);
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