(function() {

var objects = [];
var particles = [];

var levelComplete = false;

var selected = null;

var counter = 0;

var VOID = null;

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
    objects = [];
    VOID = generateVoid(0);
    objects.push(generatePlanet(50, 100));
    objects.push(generatePlanet(200, 10));
    objects.push(generatePlanet(340, 170));
    objects.push(generatePlanet(500, 70));
}

function generateVoid(pos) {
    return {to : pos, offset: randomInt(300)};
}

function generatePlanet(x, y) {
    return spawn(TYPE.PLANET, x, y, { style : randomInt(4), population : 5 + randomInt(10)});
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
        if (planet.destroyed()) {
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
                addOrRemoveTunnel(selected, planet);
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

function removeTunnel(planet) {
    for (var i = objects.length - 1; i >= 0; i--) {
        if (objects[i].type != TYPE.TUNNEL) continue;
        var tunnel = objects[i];
        if (tunnel.from == planet || tunnel.to == planet) {
            objects.splice(i, 1);
        }
    }
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
        updateEntity(objects[i]);
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
    if (entity.type != TYPE.PLANET) return;

    if (entity.destroyed()) {
        if (selected == entity) {
            entity.selected = false;
            selected = null;
        }
        removeTunnel(entity);
    }
}

function updateParticle(particle) {
    if (particle.updateSprite()) {
        return true;
    }

    var collisions = particle.move(particle.xSpeed, particle.ySpeed);

    if (engine.offScreen(particle)) return true;

    var objects = collisions.list();
    for (var i = 0; i < objects.length; i++) {
        if (particle.destroyOnCollision(objects[i])) return true;
        if (particle.stopOnCollision(objects[i])) {
            particle.xSpeed = 0;
            particle.ySpeed = 0;
            particle.static = true;
        }
    }

    return particle.act();
}

function addParticle(type, x, y) {
    particles.push(spawn(type, x, y));
}

}());