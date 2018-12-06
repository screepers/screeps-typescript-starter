export default {
    name: 'transferToSpawn',
    validate: function (creep: Creep) {

        if (!creep.carry.energy) return false

        const spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS, {
            filter: s => (s.structureType == STRUCTURE_SPAWN) && (s.energy < s.energyCapacity)
        });
        if (!spawn) return false;

        creep.memory.job = 'transferToSpawn'
        creep.memory.spawn_id = spawn.id
        return true;
    },
    perform: function (creep: Creep) {
        creep.say("ë→Ŝ")

        if (!creep.memory.spawn_id) throw "Missing spawn"

        // move toward it, or...
        let spawn: StructureSpawn | null = Game.getObjectById(creep.memory.spawn_id)
        if (!spawn) throw "Missing spawn"

        if (spawn.energy == spawn.energyCapacity) {
            console.log("Spawn filled up while en-route.")
            creep.memory.job = null;
            return
        }

        creep.moveTo(spawn)
        creep.transfer(spawn, RESOURCE_ENERGY)

        if (!creep.carry.energy)
            creep.memory.job = null;
    }
}
