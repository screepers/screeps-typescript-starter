import { getDefaultSettings } from "http2";

export default {
    name: 'returnEnergy',
    validate: function (creep: Creep) {

        const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
        if (!spawn) return false;

        creep.memory.job = 'returnEnergy'
        creep.memory.spawn_id = spawn.id
        return true;
    },
    perform: function (creep: Creep) {
        creep.say("ë→Ŝ")

        if (!creep.memory.spawn_id) throw "Missing spawn"

        // move toward it, or...
        let spawn: StructureSpawn | null = Game.getObjectById(creep.memory.spawn_id)
        if (!spawn) throw "Missing spawn"

        creep.moveTo(spawn)
        creep.transfer(spawn, RESOURCE_ENERGY)

        if (!creep.carry.energy)
            creep.memory.job = null;
    }
}
