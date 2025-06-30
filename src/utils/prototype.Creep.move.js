/*
creep对穿
拒绝堵车从你做起
author: Yuandiaodiaodiao Scorpior
data:2019/10/21
version:1.3.3
新增：
1.兼容其他任何对Creep.prototype和PowerCreep.prototype的修改
2.当前tick就对穿，不用延迟
3.兼容无腿球挡路情况
4.存在可行路径时不会被敌对creep挡住
bug fix：
相对于1.2：
1.move参数是creep时会bug
2.被敌对creep挡住的bug
相对于1.3：
1.被中央搬运工挡住的bug
相对于1.3.1：
1.开safemode后被敌对creep挡住导致递归溢出的bug
相对于1.3.2：
1.ignoreCreep = false时无效的bug


Usage:
module :main

require('prototype.Creep.move')
module.exports.loop=function(){

     //your codes go here

}

ps:
1.如果想进行非对穿寻路
creep.moveTo(target,{ignoreCreeps:false})
2.对于不想被对穿的creep（比如没有脚的中央搬运工）, 设置memory：
creep.memory.no_pull = true

 */
var config = {
    changemove: true,//实现对穿
    changemoveTo: true,//优化moveTo寻路默认使用ignoreCreep=true
    roomCallbackWithoutCreep:undefined,//moveTo默认使用的忽视creep的callback函数
    roomCallbackWithCreep: undefined,//moveTo默认使用的计算creep体积的callback函数
    changeFindClostestByPath: true,  //修改findClosestByPath 使得默认按照对穿路径寻找最短
    reusePath: 10 //增大默认寻路缓存
}

if (config.changemove) {
    // Store the original method
    let move = Creep.prototype.move;
    // Create our new function
    Creep.prototype.move = function (target) {
        // target可能是creep（在有puller的情况下），target是creep时pos2direction返回undefined
        const tarpos = pos2direction(this.pos, target);
        
        if (tarpos) {
            let direction = +target;
            const tarcreep = tarpos.lookFor(LOOK_CREEPS)[0] || tarpos.lookFor(LOOK_POWER_CREEPS)[0]
            if (tarcreep && this.ignoreCreeps) {
                if (tarcreep.my && !tarcreep.memory.no_pull){
                    // 挡路的是我的creep/powerCreep, 如果它本tick没移动则操作它对穿
                    if (!tarcreep.moved && move.call(tarcreep, (direction + 3) % 8 + 1) == ERR_NO_BODYPART){
                        // 如果对方是个没有脚的球
                        if(this.pull){
                            // 自己是creep, 就pull他一下 （powerCreep没有pull方法，会堵车）
                            this.pull(tarcreep);
                            move.call(tarcreep, this);
                        }
                    }
                }else if(Game.time&1 && this.memory._move && this.memory._move.dest){
                    // 别人的creep，如果在Memory中有正在reuse的路径（即下一tick本creep还会尝试同样移动），则1/2概率清空路径缓存重新寻路
                    let dest = this.memory._move.dest;
                    let pos = new RoomPosition(dest.x, dest.y, dest.room);
                    if(pos.x != tarpos.x || pos.y != tarpos.y || pos.roomName != tarpos.roomName){
                        // 如果最终目标位置不是当前这一步移动的目标位置（如果是的话绕路也没用）
                        let path = this.pos.findPathTo(pos);
                        if(path.length){
                            this.memory._move.time = Game.time;
                            this.memory._move.path = Room.serializePath(path);
                            return move.call(this, path[0].direction);
                        }
                    }
                }
            }
        }

        this.moved = true;
        return move.call(this, target);
    }
    
    PowerCreep.prototype.move = function (target) {
        if (!this.room) {
            return ERR_BUSY;
        }
        return Creep.prototype.move.call(this, target);
    }
}

if (config.changemoveTo) {
    let moveTo = Creep.prototype.moveTo;
    Creep.prototype.moveTo = function (firstArg, secondArg, opts) {
        let ops = {};
        if (_.isObject(firstArg)) {
            ops = secondArg || {};
        } else {
            ops = opts || {};
        }
        if (!ops.reusePath) {
            ops.reusePath = config.reusePath;
        }
        if (ops.ignoreRoads) {
            ops.plainCost = 1;
            ops.swampCost = 5;
        }else if(ops.ignoreSwanp){
            ops.plainCost = 1;
            ops.swampCost = 1;
        }
        if (ops.ignoreCreeps === undefined || ops.ignoreCreeps === true) {
            this.ignoreCreeps = true;
            ops.ignoreCreeps = true;
            ops.costCallback = config.roomCallbackWithoutCreep;
        } else {
            ops.costCallback = config.roomCallbackWithCreep;
        }

        if (_.isObject(firstArg)) {
            return moveTo.call(this, firstArg, ops);
        } else {
            return moveTo.call(this, firstArg, secondArg, ops);
        }
    }

    PowerCreep.prototype.moveTo = function (firstArg, secondArg, opts) {
        if (!this.room) {
            return ERR_BUSY;
        }
        let ops = {};
        if (_.isObject(firstArg)) {
            ops = secondArg || {};
        } else {
            ops = opts || {};
        }
        if (!ops.reusePath) {
            ops.reusePath = config.reusePath;
        }
        ops.plainCost = 1;
        ops.swampCost = 1;
        if (_.isObject(firstArg)) {
            return moveTo.call(this, firstArg, ops)
        } else {
            return moveTo.call(this, firstArg, secondArg, ops)
        }
    }
}

if (config.changeFindClostestByPath) {
    let origin_findClosestByPath = RoomPosition.prototype.findClosestByPath;
    RoomPosition.prototype.findClosestByPath = function (type, opts) {
        opts = opts || {};
        if (opts.ignoreCreeps === undefined || opts.ignoreCreeps === true) {
            opts.ignoreCreeps = true;
            opts.costCallback = config.roomCallbackWithoutCreep;
        } else {
            opts.costCallback = config.roomCallbackWithCreep;
        }
        return origin_findClosestByPath.call(this, type, opts);
    }
}

function pos2direction(pos, target) {
    if(_.isObject(target)){
        // target 不是方向常数
        return undefined;
    }
    
    const direction = +target;  // 如果是string则由此运算转换成number
    let tarpos = {
        x: pos.x,
        y: pos.y,
    }
    if (direction !== 7 && direction !== 3) {
        if (direction > 7 || direction < 3) {
            --tarpos.y
        } else {
            ++tarpos.y
        }
    }
    if (direction !== 1 && direction !== 5) {
        if (direction < 5) {
            ++tarpos.x
        } else {
            --tarpos.x
        }
    }
    if (tarpos.x < 0 || tarpos.y > 49 || tarpos.x > 49 || tarpos.y < 0) {
        return undefined;
    } else {
        return new RoomPosition(tarpos.x, tarpos.y, pos.roomName);
    }
}