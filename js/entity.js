(function() {

/****************************************************************************
    Every possible state of entities, which defines behaviour and sprite.
 ***************************************************************************/

window.STATE = {
    IDLE : 'IDLE',
    WALK_RIGHT : 'WALK_RIGHT',
    WALK_LEFT : 'WALK_LEFT',
    FALL : 'FALL',
    JUMP : 'JUMP',
    JUMP_RIGHT : 'JUMP_RIGHT',
    JUMP_LEFT : 'JUMP_LEFT',
    FALL_RIGHT : 'FALL_RIGHT',
    FALL_LEFT : 'FALL_LEFT',
    DEAD : 'DEAD',
    IDLE_RIGHT : 'IDLE_RIGHT',
    IDLE_LEFT : 'IDLE_LEFT',
    FROZEN : 'FROZEN',
    WITHERED : 'WITHERED',
    SLEEPING : 'SLEEPING'
};

window.TYPE = {
    DUMMY : ['dummy', 0],
    PLANET : ['planet', 1],
    TUNNEL : ['tunnel', 2]
};

var ID = 0;

/*****************************************
        Entity - Every object in game
 ****************************************/

function Entity(x, y, width, height, type, sprite, args) {
    this.id = ID++;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this._type = type;
    this.dead = false;
    this.selected = false;
    if (sprite != null && sprite != undefined) {
        this.sprite = new Sprite(res.get(sprite['name']), sprite['pos'], [width, height],
        //frames is array of image per state
        sprite['frames'] == undefined ? [] : sprite['frames'],
        sprite['speed'] == undefined ? 0 : sprite['speed'],
        sprite['once'] == undefined ? false : sprite['once']);
    } else if (type != TYPE.DUMMY && type != TYPE.TUNNEL) {
        console.log('Warning - no sprite info for ' + type);
    }
    //physics
    this.static = args == undefined ? false : (args['static'] == undefined ? false : args['static']);
    this.xSpeed = args == undefined ? 0 : (args['xSpeed'] == undefined ? 0 : args['xSpeed']);
    this.ySpeed = args == undefined ? 0 : (args['ySpeed'] == undefined ? 0 : args['ySpeed']);
    this.velocity = args == undefined ? 0 : (args['velocity'] == undefined ? 0 : args['velocity']);
    this.jumpSpeed = args == undefined ? 0 : (args['jump'] == undefined ? 0 : args['jump']);
}

Entity.prototype = {
    getId : function() {
        return this.id;
    },
    canLeaveScreen : function() {
        return false;
    },
    move : function(dx, dy) {
        return engine.move(this, dx, dy);
    },
    getCenter : function() {
        return { x : this.x + this.width / 2, y : this.y + this.height / 2};
    },
    get type() {
        return this._type;
    },
    act : function() {},
    updateSprite : function() {
        if (this.sprite == null || this.sprite == undefined) return;
        return this.sprite.update(this.getState());
    },
    die : function() {
        this.dead = true;
        this.static = true;
        this.updateSprite();
    },
    isPlatform : function() {
        return false;
    },
    isBouncy : function() {
        return false;
    },
    isFatal : function() {
        return false;
    },
    getState : function() {
        if (this.dead) return STATE.DEAD;

        if (this.xSpeed > 0) {
            if (this.ySpeed < 0) {
                return STATE.JUMP_RIGHT;
            } else if (this.ySpeed > 0 && !this.grounded) {
                return STATE.FALL_RIGHT;
            } else return STATE.WALK_RIGHT;
        } else if (this.xSpeed < 0) {
            if (this.ySpeed < 0) {
                return STATE.JUMP_LEFT;
            } else if (this.ySpeed > 0 && !this.grounded) {
                return STATE.FALL_LEFT;
            } else return STATE.WALK_LEFT;
        } else {
            if (this.ySpeed < 0) {
                return STATE.JUMP;
            } else if (this.ySpeed > 0 && !this.grounded) {
                return STATE.FALL;
            } else return STATE.IDLE;
        }
    },
    render : function(context) {
        context.save();
        context.translate(this.x, this.y);
        this.sprite.render(context);
        context.restore();
    },
    moveRight : function(ratio) {
        this.xSpeed = Math.min(this.xSpeed + this.velocity / 5 * ratio, this.velocity);
    },
    moveLeft : function(ratio) {
        this.xSpeed = Math.max(this.xSpeed - this.velocity / 5 * ratio, -this.velocity);
    },
    jump : function() {
        this.ySpeed = -this.jumpSpeed;
    },
    applyFriction : function(friction) {
        if (this.xSpeed > 0) {
            this.xSpeed = Math.max(this.xSpeed - friction, 0);
        } else if (this.xSpeed < 0) {
            this.xSpeed = Math.min(this.xSpeed + friction, 0);
        }
    },
    applyGravity : function(gravity) {
        this.ySpeed = Math.min(this.ySpeed + gravity, FREE_FALL);
    },
    forceMovement : function() {
        return false;
    },
    destroyOnCollision : function(entity) {
        return false;
    },
    setSelected : function(selected) {
        this.selected = selected;
    }
};

/****************************************************
                      Dummy cell
 ****************************************************/

window.DUMMY_CELL = new Entity(0,0,0,0, TYPE.DUMMY);

/***************************************************
                    Generic block
 ***************************************************/

function Block(x, y, type, sprite, args) {
    var width = PLANET_SIZE;
    var height = PLANET_SIZE;
    if (args) {
        width = args['width'] == undefined ? PLANET_SIZE : args['width'];
        height = args['height'] == undefined ? PLANET_SIZE : args['height'];
        args.static = true;
    } else {
        args = {static : true};
    }
    Entity.call(this, x, y, width, height, type, sprite, args);
}
Block.prototype = Object.create(Entity.prototype);
Block.prototype.isPlatform = function() {
    return true;
};

/****************************************************
                         Planet
 ****************************************************/

function Planet(x, y, args) {
    var frames = [];
    this.population = args['population'];
    frames[STATE.IDLE] = 0;
    var sprite = { name : 'planet', 'pos' : [args['style'] * PLANET_SIZE, 0], frames : frames, speed : 0};
    Block.call(this, x, y, TYPE.PLANET, sprite);
}
Planet.prototype = Object.create(Block.prototype);
Planet.prototype.getPopulation = function() {
    return this.population;
};
Planet.prototype.render = function(context) {
    context.save();
    context.translate(this.x, this.y);
    this.sprite.render(context);
    if (this.selected) {
        context.fillStyle = 'rgba(1, 1, 1, 0.5)';
        context.fillRect(0, 0, PLANET_SIZE, PLANET_SIZE);
    }
    //render population
    context.fillStyle = '#888888';
    context.font = '15px Aoyagi Bold';
    context.fillText(this.population, PLANET_SIZE / 2, PLANET_SIZE / 2);

    context.restore();
};
Planet.prototype.toString = function() {
    return 'Planet-' + this.id +'(' + this.population + ')';
};

/****************************************************
                         Tunnel
 ****************************************************/

function Tunnel(x, y, args) {
    this.from = args.from;
    this.to = args.to;
    this.fromCenter = this.from.getCenter();
    this.toCenter = this.to.getCenter();
    Entity.call(this, x, y, 0, 0, TYPE.TUNNEL);
}
Tunnel.prototype = Object.create(Entity.prototype);
Tunnel.prototype.render = function(context) {
    context.strokeStyle = '#FFF';
    context.beginPath();
    context.moveTo(this.fromCenter.x, this.fromCenter.y );
    context.lineTo(this.toCenter.x, this.toCenter.y);
    context.closePath();
    context.stroke();
};

/****************************************************
                        Particle
 ****************************************************/
function Particle(x, y, width, height, type, sprite, args) {
    if (args == undefined) args = {};
    sprite.once = args == undefined ? true : (args['once'] == undefined ? true : args['once']);
    Entity.call(this, x, y, width, height, type, sprite, args);
}
Particle.prototype = Object.create(Entity.prototype);
Particle.prototype.getState = function() {
    return STATE.IDLE;
};
Particle.prototype.canLeaveScreen = function() {
    return true;
};
Particle.prototype.stopOnCollision = function(entity) {
    return false;
};
Particle.prototype.act = function() {
    return false;
};

window.spawn = function(type, x, y, args) {
    switch (type) {
        case TYPE.PLANET : return new Planet(x, y, args);
        case TYPE.TUNNEL : return new Tunnel(x, y, args);
        default: {
            console.log("Cannot spawn: unknown type - " + type);
        }
    }
};

}());