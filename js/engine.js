(function() {
window.engine = {
    offScreen : function(entity) {
        return entity.x + entity.width < 0 || entity.x > WIDTH || entity.y > HEIGHT;
    },
    containsPoint : function(entity, x, y) {
        return inside(entity.x, entity.y, entity.x + entity.width, entity.y + entity.height, x, y);
    },
    distance : function(from, to) {
        var dx = from.x - to.x;
        var dy = from.y - to.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
};

window.DIR = {
    RIGHT : 'RIGHT',
    LEFT : 'LEFT',
    TOP : 'TOP',
    BOTTOM : 'BOTTOM',
    INSIDE : 'INSIDE',
    OFF_SCREEN : 'OFF_SCREEN',
    LEAVING_SCREEN : 'LEAVING_SCREEN'
};

function intersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    return !((x1 > x2 + w2 - 1) ||
             (x1 + w1 - 1 < x2) ||
             (y1 > y2 + h2 - 1) ||
             (y1 + h1 - 1 < y2));
}

function inside(x1, y1, x2, y2, x3, y3) {
    return !((x3 < x1) || (x3 > x2) || (y3 < y1) || (y3 > y2));
}


}());