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
    TUNNEL : ['tunnel', 2],
    PORTAL : ['planet', 1],
    PARTICLE : {
        DIED : ['died', -1]
    },
    BUTTON : ['button', -2],
    LEVEL_BUTTON : ['levelButton', -2],
    LINK : ['link']
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
    this.selected = false;
    if (sprite != null && sprite != undefined) {
        this.sprite = new Sprite(res.get(sprite['name']), sprite['pos'], [width, height],
        //frames is array of image per state
        sprite['frames'] == undefined ? [] : sprite['frames'],
        sprite['speed'] == undefined ? 0 : sprite['speed'],
        sprite['once'] == undefined ? false : sprite['once']);
    }
    //physics
    this.static = args == undefined ? false : (args['static'] == undefined ? false : args['static']);
    this.xSpeed = args == undefined ? 0 : (args['xSpeed'] == undefined ? 0 : args['xSpeed']);
    this.ySpeed = args == undefined ? 0 : (args['ySpeed'] == undefined ? 0 : args['ySpeed']);
    this.velocity = args == undefined ? 0 : (args['velocity'] == undefined ? 0 : args['velocity']);
    this.jumpSpeed = args == undefined ? 0 : (args['jump'] == undefined ? 0 : args['jump']);
}

Entity.prototype = {
    mouseOver : function() {
        var mouse = input.getMouse();
        return engine.containsPoint(this, mouse.x, mouse.y);
    },
    update : function() {},
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
                      UI Button
 ****************************************************/

function Button(id, x, y) {
    Entity.call(this, x, y, 38, 38, TYPE.BUTTON);
    this.id = id;
    this.win = id.substr(0,3) == 'win';
    this.lost = id.substr(0,4) == 'lost';
}
Button.prototype = Object.create(Entity.prototype);

/****************************************************
                Level selection Button
 ****************************************************/

function LevelButton(id, x, y) {
    Entity.call(this, x, y, 40, 40, TYPE.LEVEL_BUTTON);
    this.id = id;
    this.level = id.substr(5);
}
LevelButton.prototype = Object.create(Entity.prototype);

/****************************************************
    Object for handling twitter link in epilogue
****************************************************/

function Link(link, x, y) {
    Entity.call(this, x, y, 85, 14, TYPE.LINK);
    this.link = link;
}
Link.prototype = Object.create(Entity.prototype);

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
    this._dead = false;
    this.counter = 0;
    this.population = args['population'];
    this.maxPopulation = args['maxPopulation'] == undefined ? DEFAULT_MAX_POPULATION : args['maxPopulation'];
    this.range = args['range'];
    this.escapeRate = args['escapeRate'];
    this.showTooltip = function(context) {
        if (this.type != TYPE.PLANET) return;
        if (this.escapeRate == 1) return;
        context.font = '25px Aoyagi Bold';
        context.fillStyle = '#888888';
        context.fillText('X' + this.escapeRate, PLANET_SIZE / 2, PLANET_SIZE / 2 + 7);
        context.fillStyle = '#333333';
        context.fillText('X' + this.escapeRate, PLANET_SIZE / 2 - 1, PLANET_SIZE / 2 + 6);
    };
    frames[STATE.IDLE] = 0;
    var sprite = { name : 'planet', 'pos' : [args['style'] * PLANET_SIZE, 0], frames : frames, speed : 0 };
    if (args['sprite']) {
        sprite = args['sprite'];
    }
    Block.call(this, x, y, args['portal'] ? TYPE.PORTAL : TYPE.PLANET, sprite);
}
Planet.prototype = Object.create(Block.prototype);
Planet.prototype.getPopulation = function() {
    return this.population;
};
Planet.prototype.resetPopulation = function() {
    this.population = 0;
};
Planet.prototype.decPopulation = function() {
    if (this.population == 0) return 0;

    if (this.population < this.escapeRate) {
        var result = this.population;
        this.population = 0;
        return result;
    }

    this.population -= this.escapeRate;

    return this.escapeRate;
};
Planet.prototype.incPopulation = function(delta) {
    var result = 0;
    this.population += delta;
    if (this.population > this.maxPopulation) {
        result = this.population - this.maxPopulation;
        this.population = this.maxPopulation;
    }
    return result;
};
Planet.prototype.corrupted = function() {
    return this.x < getVoid().to;
};
Planet.prototype.died = function() {
    if (this.getCorruptionRate() > 0.6 && !this._dead) {
        this._dead = true;
        return true;
    }
};
Planet.prototype.dead = function() {
    return this._dead;
};
Planet.prototype.getCorruptionRate = function() {
    return Math.max(0, Math.min(1, (getVoid().to - this.x) / this.width));
};
Planet.prototype.render = function(context) {
    context.save();
    context.translate(this.x, this.y);
    this.sprite.render(context);
    var offset = Math.floor(this.counter / 10);
    if (this.corrupted()) {
        context.globalAlpha = this.getCorruptionRate();
        context.drawImage(res.get('planetOverlay'), PLANET_SIZE * offset, 0, PLANET_SIZE, PLANET_SIZE, 0, 0, PLANET_SIZE, PLANET_SIZE);
        context.globalAlpha = '1';
    }
    if (this.selected) {
        context.drawImage(res.get('planetOverlay'), PLANET_SIZE, PLANET_SIZE, PLANET_SIZE, PLANET_SIZE, 0, 0, PLANET_SIZE, PLANET_SIZE);
        this.showTooltip(context);
    } else if (this.mouseOver()) {
        context.drawImage(res.get('planetOverlay'), 0, PLANET_SIZE, PLANET_SIZE, PLANET_SIZE, 0, 0, PLANET_SIZE, PLANET_SIZE);
        this.showTooltip(context);

    }
    //render population

    var population = this.maxPopulation != DEFAULT_MAX_POPULATION ? this.population + '/' + this.maxPopulation : this.population;

    context.font = '15px Aoyagi Bold';
    context.fillStyle = '#888888';
    context.fillText(population, PLANET_SIZE / 2, -4);
    context.fillStyle = '#333333';
    context.fillText(population, PLANET_SIZE / 2 - 1, -3);

    context.restore();
};
Planet.prototype.toString = function() {
    return 'Planet-' + this.id +'(' + this.population + ')';
};
Planet.prototype.update = function() {
    this.counter = ++this.counter % 40;
};
Planet.prototype.getRange = function() {
    return this.range;
};

/****************************************************
                         Portal
****************************************************/

function Portal(x, y) {
    var frames = [];
    frames[STATE.IDLE] = 0;
    var sprite = { name : 'planet', 'pos' : [0, PLANET_SIZE], frames : frames, speed : 0 };
    Planet.call(this, x, y, { sprite : sprite, population : 0, portal : true});
}
Portal.prototype = Object.create(Planet.prototype);

Portal.prototype.toString = function() {
    return 'Portal-' + this.id +'(' + this.population + ')';
};
Portal.prototype.died = function() {
    return false;
};
Portal.prototype.dead = function() {
    return false;
};
Portal.prototype.corrupted = function() {
    return false;
};

/****************************************************
                         Tunnel
 ****************************************************/

function Tunnel(x, y, args) {
    this.from = args.from;
    this.to = args.to;
    this.fromCenter = this.from.getCenter();
    this.toCenter = this.to.getCenter();
    this.counter = 1;
    Entity.call(this, x, y, 0, 0, TYPE.TUNNEL);
}
Tunnel.prototype = Object.create(Entity.prototype);
Tunnel.prototype.render = function(context) {
    var gradient = context.createLinearGradient(this.fromCenter.x, this.fromCenter.y, this.toCenter.x, this.toCenter.y);
    gradient.addColorStop(0, '#222');
    gradient.addColorStop(0.2, '#222');
    gradient.addColorStop(0.8, "#AFA");
    gradient.addColorStop(1, "#AFA");
    context.beginPath();
    context.lineWidth = 4;
    context.strokeStyle = 'rgba(256,256,256,0.2)';
    context.moveTo(this.fromCenter.x, this.fromCenter.y);
    context.lineTo(this.toCenter.x, this.toCenter.y);
    context.closePath();
    context.stroke();
    context.beginPath();
    context.lineWidth = 2;
    context.strokeStyle = gradient;
    context.moveTo(this.fromCenter.x, this.fromCenter.y);
    context.lineTo(this.toCenter.x, this.toCenter.y);
    context.closePath();
    context.stroke();
};
Tunnel.prototype.update = function() {
    this.counter = ++this.counter % 1;
    if (this.counter == 0) {
        var value = this.from.decPopulation();
        if (value > 0) {
            value = this.to.incPopulation(value);
            if (value > 0) {
                this.from.incPopulation(value);
            }
        }
    }
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

function ParticleDied(x, y, args) {
    this.value = args['value'];
    this.counter = 0;
    Particle.call(this, x, y, 0, 0, TYPE.PARTICLE.DIED, {}, args);
}
ParticleDied.prototype = Object.create(Particle.prototype);
ParticleDied.prototype.render = function(context) {
    context.font = '18px Aoyagi bold';
    context.fillStyle = 'black';
    context.fillText('-' + String(this.value), this.x - 1, this.y - 1);
    context.font = '18px Aoyagi bold';
    context.fillStyle = '#BB1111';
    context.fillText('-' + String(this.value), this.x, this.y);
};
ParticleDied.prototype.update = function() {
    this.counter++;
    if (this.counter % 5 == 0) {
        this.x--;
    }
    if (this.counter % 2 == 0) {
        this.y--;
    }
    if (this.counter == 50) return true;
};

window.spawn = function(type, x, y, args) {
    switch (type) {
        case TYPE.PLANET : return new Planet(x, y, args);
        case TYPE.TUNNEL : return new Tunnel(x, y, args);
        case TYPE.PORTAL : return new Portal(x, y);
        case TYPE.PARTICLE.DIED : return new ParticleDied(x, y, args);
        case TYPE.BUTTON : return new Button(args, x, y);
        case TYPE.LEVEL_BUTTON : return new LevelButton(args, x, y);
        case TYPE.LINK : return new Link(args, x, y);
        default: {
            console.log("Cannot spawn: unknown type - " + type);
        }
    }
};

}());