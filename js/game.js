(function() {

var objects = [];
var particles = [];

var levelComplete = false;

var selected = null;

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
    objects.push(generatePlanet(0, 0));
    objects.push(generatePlanet(100, 150));
    objects.push(generatePlanet(250, 50));
}

function generatePlanet(x, y) {
    return spawn(TYPE.PLANET, x, y, { style : randomInt(4), population : randomInt(10)});
}

function tick() {
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
        if (engine.containsPoint(objects[i], x, y)) {
            if (selected == null) {
                selected = objects[i];
                objects[i].setSelected(true);
            } else {
                //make tunnel
                objects.push(spawn(TYPE.TUNNEL, 0, 0, {from: selected, to : objects[i]}));
                selected = null;
            }
            return;
        }
    }
    selected = null;
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
        input.clearInput(input.keys.F.key);
        loader.toggleFullscreen();
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
}

function updateEntity(entity) {

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