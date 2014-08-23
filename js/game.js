(function() {

var objects = [];
var particles = [];

var levelComplete = false;

window.getObjects = function() {
    return objects;
};

window.init = init;

function init() {
    startLevel();
    tick();
}

function startLevel() {
    objects.push(spawn(TYPE.PLANET, 0, 0, randomInt(4)));
    objects.push(spawn(TYPE.PLANET, 100, 150, randomInt(4)));
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