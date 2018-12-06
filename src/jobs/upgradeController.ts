import { getDefaultSettings } from "http2";

export default {
    name: 'upgradeController',
    validate: function (creep: Creep) {

        if (!creep.carry.energy) return false

        let controllers = _.filter(Game.structures, s => s.structureType == STRUCTURE_CONTROLLER)
        if (controllers.length == 0) return false;
        let controller = controllers[0];

        creep.memory.job = this.name
        creep.memory.controller_id = controller.id
        return true;
    },
    perform: function (creep: Creep) {
        creep.say("Ĉ++")

        if (!creep.memory.controller_id) throw "Missing controller"

        // move toward it, or...
        let controller: StructureController | null = Game.getObjectById(creep.memory.controller_id)
        if (!controller) throw "Missing controller"

        creep.moveTo(controller, { range: 3 })
        creep.upgradeController(controller)

        if (!creep.carry.energy)
            creep.memory.job = null;
    }
}
