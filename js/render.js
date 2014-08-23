(function() {

var bufferCanvas;
var bufferContext;
var canvas;
var context;
var objects;
var particles;

window.render = render;
window.drawLoaded = function() {
    bufferContext.clearRect(0, 0, WIDTH, HEIGHT);
    bufferContext.font = "53px Aoyagi bold";
    bufferContext.textAlign = "center";
    bufferContext.fillStyle = "#00005A";
    bufferContext.fillText("SALVATION", WIDTH / 2, HEIGHT / 2);
    bufferContext.font = "50px Aoyagi bold";
    bufferContext.textAlign = "center";
    bufferContext.fillStyle = "#DDB500";
    bufferContext.fillText("SALVATION", WIDTH / 2, HEIGHT / 2);
    execute();
};
window.drawLoading = function(value) {
    bufferContext.clearRect(0, 0, WIDTH, HEIGHT);
    //bufferContext.font = "25px Aoyagi bold";
    bufferContext.textAlign = "center";
    bufferContext.fillStyle = "#666";
    bufferContext.fillText("Loading: " + value + "%", WIDTH / 2, HEIGHT / 2);
    execute();
};
window.initRenderer = function(_buffer, _canvas) {
    bufferCanvas = _buffer;
    bufferContext = bufferCanvas.getContext('2d');
    canvas = _canvas;
    context = canvas.getContext('2d');
};

function execute() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bufferCanvas, 0, 0, canvas.width, canvas.height);
}

function render(_objects, _particles) {
    objects = _objects;
    particles = _particles;
    objects.sort(function(a, b){
        if (a.type[1] > b.type[1]) {
            return -1;
        } else if (b.type[1] > a.type[1]) {
            return 1;
        } else return 0;
    });
    renderBackground();

    objects.forEach(function(object) {
        object.render(bufferContext);
    });

    particles.forEach(function(particle) {
        particle.render(bufferContext);
    });

    if (getSelected() != null) {
        var from = getSelected().getCenter();
        var to = input.getMouse();
        bufferContext.strokeStyle = '#AAA';
        bufferContext.beginPath();
        bufferContext.moveTo(from.x, from. y);
        bufferContext.lineTo(to.x, to.y);
        bufferContext.closePath();
        bufferContext.stroke();
    }

    renderVoid();

    renderUI();
    renderDebug();

    execute();
}

var stars;

window.initStars = function() {
    stars = [];
    for (var i = 0; i < WIDTH; i++) {
        //TODO: optimize - map by color to minimize canvas state changes
        stars.push({x : i,  y : randomInt(HEIGHT), color : getRandomStarColor()});
    }
};

function renderVoid() {
    var VOID = getVoid();
    bufferContext.drawImage(res.get('noise'), VOID.offset, 0, VOID.to, HEIGHT, 0, 0, VOID.to, HEIGHT);
    for (var i = 0; i < 4; i++) {
        var chance = 1 - 0.3 * i;
        var x = VOID.to + i;
        for (var y = 0; y < HEIGHT; y++) {
            if (Math.random() < chance) {
                bufferContext.drawImage(res.get('pallete'), randomInt(16), 0, 1, 1, x, y, 1, 1);
            }
        }
    }
}

function renderBackground() {
    bufferContext.clearRect(0, 0, WIDTH, HEIGHT);
    stars.forEach(function(star) {
        bufferContext.fillStyle = star.color;
        bufferContext.fillRect(star.x, star.y, 1, 1);
    });
}

function getRandomStarColor() {
    //its greyscale from #111111 to #AAAAAA
    var value = 1118481 * randomInt(10);
    return '#' + value.toString(16);
}

function renderUI() {

}

function renderDebug() {
    if (!DEBUG) return;

    //objects and particles
    bufferContext.textAlign = "center";
    bufferContext.font = '12px Aoyagi bold';

    bufferContext.fillStyle = "#00005A";
    bufferContext.fillText('Objects:', WIDTH / 10 + 1, HEIGHT / 17 - 1);
    bufferContext.fillText(String(objects.length), WIDTH / 4 + 1, HEIGHT / 17 - 1);
    bufferContext.fillStyle = "#DDB500";
    bufferContext.fillText('Objects:', WIDTH / 10, HEIGHT / 17);
    bufferContext.fillText(String(objects.length), WIDTH / 4, HEIGHT / 17);

    bufferContext.fillStyle = "#00005A";
    bufferContext.fillText('Particles:', WIDTH / 10 + 1, HEIGHT / 8 - 1);
    bufferContext.fillText(String(particles.length), WIDTH / 4 + 1, HEIGHT / 8 - 1);
    bufferContext.fillStyle = "#DDB500";
    bufferContext.fillText('Particles:', WIDTH / 10, HEIGHT / 8);
    bufferContext.fillText(String(particles.length), WIDTH / 4, HEIGHT / 8);

    bufferContext.fillStyle = "#00005A";
    bufferContext.fillText('FPS: ' + debug.getUPS(), WIDTH / 13 + 1, HEIGHT - 5 - 1);
    bufferContext.fillStyle = "#DDB500";
    bufferContext.fillText('FPS: ' + debug.getUPS(), WIDTH / 13, HEIGHT - 5);
}
}());