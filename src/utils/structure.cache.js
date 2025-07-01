// @ts-nocheck

/**
 *  作者：Scorpior_gh
 *  版本：1.4.3
 * 
 *  一键呼出房间建筑，含powerBank、deposit、source、mineral
 *  例：creep.room.source; // 得到source的数组
 *      creep.room.spawn; // 得到spawn的数组
 *      creep.room.nuker; // 得到nuker对象
 *  按type取用时一律不加's'
 *  房间唯一建筑取值是对象或者undefined
 *  房间可能有多个的建筑取值是对象数组，长度>=0
 *  缓存存放在local[room.name]，唯一建筑存id, 复数建筑存Set([id])
 *  【重要】拆除建筑会自动移除缓存，新建筑用room.update()更新缓存，不主动调用room.update()则不会识别新建筑
 *  
 * 
 * 
 *  用法：
 *  require('极致建筑缓存');
 *  module.exports.loop = function () {
 *      // your code
 *  }
 * 
 *  例1：room.mass_stores; // 得到包括此房间所有（按此顺序：）storage、terminal、factory、container的数组
 *  例2：room.deposit; // 得到此房间中deposit数组，注意是数组
 *  例3：room.powerBank; // 得到此房间中powerBank数组，注意是数组
 *  例4：room.powerSpawn; // 得到此房间中powerSpawn对象
 *  例5：room.power; // 得到此房间的mass_stores中所有此类资源的总量（数字）
 *  例6：room[RESOURCE_HYDROXIDE]; // 得到此房间的mass_stores中所有此类资源的总量（数字），参数可以是任意资源类型
 *  例7：room[id];  // 如果此id的建筑存在且在视野中，得到此建筑对象，否则得到undefined，可获取实际位置在其他room的建筑
 *  例8：room.my;  // 等同于 room.controller && room.controller.my
 *  例9：room.level;  // 等同于 room.controller && room.controller.level
 *  
 *  changelog：
 *  1.0：实现以type为单位缓存
 *  1.1：实现逐个建筑缓存
 *  1.2: 增加room.mass_stores项，mass_stores中bugfix
 *  1.3：room.update()中bugfix
 *  1.4：小幅提升速度
 *  1.4.1: 删除冗余代码
 *  1.4.2：更新头部注释
 *  1.4.3：小幅提速，精简代码
 *  
 */

const multipleList = new Set([
    STRUCTURE_SPAWN, STRUCTURE_EXTENSION, STRUCTURE_ROAD, STRUCTURE_WALL,
    STRUCTURE_RAMPART, STRUCTURE_KEEPER_LAIR, STRUCTURE_PORTAL, STRUCTURE_LINK,
    STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_CONTAINER, STRUCTURE_POWER_BANK,
]);

const singleList = new Set([
    STRUCTURE_OBSERVER, STRUCTURE_POWER_SPAWN, STRUCTURE_EXTRACTOR, STRUCTURE_NUKER,
    STRUCTURE_FACTORY, STRUCTURE_INVADER_CORE, LOOK_MINERALS,
    //STRUCTURE_TERMINAL,   STRUCTURE_CONTROLLER,   STRUCTURE_STORAGE,
]);

const additionalList = new Set([
    // room[LOOK_*]获取到数组
    LOOK_SOURCES, LOOK_DEPOSITS
]);

const local = {};

/**
 * 初始化 local[room_name]
 * 获取建筑对象放在 local[room_name].data
 * 此tick数存在 local[room_name].time
 * @param {Room} room 
 */

function Hub(room) {
    this.name = room.name;

    let data = _.groupBy(room.find(FIND_STRUCTURES), (s) => s.structureType);
    for (let type in data) {
        if (singleList.has(type)) {
            let id = data[type][0].id;
            this[type] = id;
        } else {
            this[type] = new Set(data[type].map((s) => { return s.id; }));
        }
    }
    for (let type of additionalList) {
        let objects = room.lookForAtArea(type, 1, 1, 49, 49, true);
        if (objects.length) {
            this[type] = new Set(objects.map((o) => { return o[type].id; }));
        }
    }
    let minerals = room.find(FIND_MINERALS);
    if (minerals.length) {
        this[LOOK_MINERALS] = minerals[0].id;
    }

    this.mass_stores = new Set();
    if (room.storage) {
        this.mass_stores.add(room.storage.id);
    }
    if (room.terminal) {
        this.mass_stores.add(room.terminal.id);
    }
    if (this[STRUCTURE_FACTORY]) {
        this.mass_stores.add(this[STRUCTURE_FACTORY]);
    }
    if (this[STRUCTURE_CONTAINER]) {
        this[STRUCTURE_CONTAINER].forEach((id) => this.mass_stores.add(id));
    }

    local[room.name] = this;
}

Room.prototype.__proto__ = new Proxy({}, {
    get(cache, id) {
        return Game.getObjectById(id);
    }
});

singleList.forEach((type) => {
    let bindstring = '_' + type;
    Object.defineProperty(Room.prototype, type, {
        get: function () {
            if (bindstring in this) {
                return this[bindstring];
            } else {
                let cache = local[this.name] ? local[this.name][type] : new Hub(this)[type];
                if (cache) {
                    //console.log(type);
                    return this[bindstring] = Game.getObjectById(cache);
                } else {
                    return this[bindstring] = undefined;
                }
            }
        },
        set: function () {
        },
        enumerable: false,
        configurable: true
    });
})

multipleList.forEach((type) => {
    let bindstring = '_' + type;
    Object.defineProperty(Room.prototype, type, {
        get: function () {
            if (bindstring in this) {
                return this[bindstring];
            } else {
                /**@type {Set<string>} */
                let cache = local[this.name] ? local[this.name][type] : new Hub(this)[type];
                this[bindstring] = [];
                if (cache) {
                    for (let id of cache) {
                        let o = Game.getObjectById(id);
                        if (o) {
                            this[bindstring].push(o);
                        } else {
                            cache.delete(id);
                        }
                    }
                }
                return this[bindstring];
            }
        },
        set: function () {
        },
        enumerable: false,
        configurable: true
    })
})

additionalList.forEach((type) => {
    let bindstring = '_' + type;
    Object.defineProperty(Room.prototype, type, {
        get: function () {
            ////console.log('in add');
            if (bindstring in this) {
                return this[bindstring];
            } else {
                let cache = local[this.name] ? local[this.name][type] : new Hub(this)[type];
                this[bindstring] = [];
                if (cache) {
                    //console.log(type);
                    for (let id of cache) {
                        let o = Game.getObjectById(id);
                        if (o) {
                            this[bindstring].push(o);
                        } else {
                            cache.delete(id);
                        }
                    }
                }
                return this[bindstring];
            }
        },
        set: function () {
        },
        enumerable: false,
        configurable: true
    })
})

Room.prototype.update = function (type) {
    if (!type || !local[this.name]) {   // 更新全部
        new Hub(this);
    } else if (type) {
        // 指定更新一种建筑
        let cache = local[this.name];
        if (additionalList.has(type)) {
            let objects = this.lookForAtArea(type, 1, 1, 49, 49, true);
            if (objects.length) {
                cache[type] = new Set(objects.map((o) => {
                    return o[type].id;
                }));
            } else {
                cache[type] = undefined;
            }
        } else if (type == 'mass_stores') {
            this.update(STRUCTURE_CONTAINER);
            this.update(STRUCTURE_FACTORY);
            cache.mass_stores = new Set();
            if (this.storage) {
                cache.mass_stores.add(this.storage.id);
            }
            if (this.terminal) {
                cache.mass_stores.add(this.terminal.id);
            }
            if (this[STRUCTURE_FACTORY]) {
                cache.mass_stores.add(this[STRUCTURE_FACTORY].id);
            }
            if (this[STRUCTURE_CONTAINER].length) {
                this[STRUCTURE_CONTAINER].forEach((cont) => {
                    cache.mass_stores.add(cont.id);
                });
            }
        } else {
            let objects = this.find(FIND_STRUCTURES, {
                filter: (s) => s.structureType == type
            });
            if (objects.length) {
                if (singleList.has(type)) {
                    cache[type] = objects[0].id;
                } else {
                    cache[type] = new Set(objects.map((s) => {
                        return s.id;
                    }));
                }
            } else {
                cache[type] = undefined;
            }
        }
    }
}

Object.defineProperty(Room.prototype, 'mass_stores', {
    get: function () {
        if ('_mass_stores' in this) {
            return this._mass_stores;
        } else {
            let cache = local[this.name] ? local[this.name].mass_stores : new Hub(this).mass_stores;
            this._mass_stores = [];
            for (let id of cache) {
                let o = Game.getObjectById(id);
                if (o) {
                    this._mass_stores.push(o);
                } else {
                    cache.delete(id);
                }
            }
            return this._mass_stores;
        }
    },
    set: function () {
    },
    enumerable: false,
    configurable: true
})

Object.defineProperty(Room.prototype, 'my', {
    get: function () {
        return this.controller && this.controller.my;
    },
    set: function () {
    },
    enumerable: false,
    configurable: true
})

Object.defineProperty(Room.prototype, 'level', {
    get: function () {
        return this.controller && this.controller.level;
    },
    set: function () {
    },
    enumerable: false,
    configurable: true
})

for (let type of RESOURCES_ALL) {
    let last_fetch_time = 0;
    let sum;
    let reduce_f = function (temp_sum, s) {
        return temp_sum + s.store[type];
    };
    Object.defineProperty(Room.prototype, type, {
        get: function () {
            if (last_fetch_time < Game.time) {
                return sum = this.mass_stores.reduce(reduce_f, 0);
            } else {
                return sum;
            }
        },
        set: function (amount) {
            sum = amount;
        },
        enumerable: false,
        configurable: true
    })
}