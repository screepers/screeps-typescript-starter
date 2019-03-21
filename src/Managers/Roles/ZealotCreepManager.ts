import RoomApi from "../../Api/Room.Api";
import MemoryApi from "../../Api/Memory.Api";
import CreepDomesticApi from "Api/CreepDomestic.Api";
import CreepApi from "Api/Creep.Api";
import MiliApi from "Api/CreepMili.Api";
import CreepDomestic from "Api/CreepDomestic.Api";
import {
    ERROR_WARN, DEFAULT_MOVE_OPTS
} from "utils/constants";

// Manager for the miner creep role
export default class ZealotCreepManager {

    /**
     * run the zealot creep
     * @param creep the creep we are running
     */
    public static runCreepRole(creep: Creep): void {

        const creepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
        const targetRoom: string = creep.memory.targetRoom;

        // Check if we need to flee
        if (creepOptions.flee && creep.hits < .25 * creep.hitsMax) {
            MiliApi.fleeCreep(creep, creep.memory.homeRoom);
            return;
        }

        if (!creepOptions.rallyDone) {
            if (MiliApi.setWaitingForRally(creepOptions)) {
                return; // idle if we are waiting on everyone to rally still
            }
            // Have the creep stop checking for rally
            creepOptions.rallyDone = true;
            creep.memory.options = creepOptions;
        }

        // Everyone is rallied, time to move out into the target room as a group if not already there
        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, targetRoom), DEFAULT_MOVE_OPTS);
            return;
        }

        // If creep is on exit tile, move them off
        if (CreepApi.moveCreepOffExit(creep)) {
            return;
        }

        // Find a target for the creep
        const target: Creep | Structure<StructureConstant> | undefined = this.getAttackTarget(creep, creepOptions);
        const isMelee: boolean = true;
        if (!target) {
            return; // idle if no current target
        }
        // If we aren't in attack range, move towards the attack target
        if (!MiliApi.isInAttackRange(creep, target.pos, isMelee)) {
            creep.moveTo(target, DEFAULT_MOVE_OPTS);
            return;
        }

        // We are in attack range and healthy, attack the target
        creep.attack(target);
    }

    /**
     * get an attack target for the zealot creep
     * @param creep the creep we are getting the target for
     * @param creepOptions the creep's military options
     */
    public static getAttackTarget(creep: Creep, creepOptions: CreepOptionsMili): Creep | Structure<StructureConstant> | undefined {

        let path: PathFinderPath;
        let goal: { pos: RoomPosition, range: number } = { pos: new RoomPosition(25, 25, creep.memory.targetRoom), range: 1 }
        let pathFinderOptions: PathFinderOpts = {
            roomCallback: function (roomName): boolean | CostMatrix {

                let room: Room = Game.rooms[roomName];
                let costs = new PathFinder.CostMatrix;
                if (!room) {
                    return false;
                }

                // Set walls and ramparts as unwalkable
                room.find(FIND_STRUCTURES).forEach(function (struct: Structure<StructureConstant>) {
                    if (struct.structureType === STRUCTURE_WALL ||
                        struct.structureType === STRUCTURE_RAMPART) {
                        // Set walls and ramparts as unwalkable
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                });

                // Set creeps as unwalkable
                room.find(FIND_CREEPS).forEach(function (creep: Creep) {
                    costs.set(creep.pos.x, creep.pos.y, 0xff);
                });

                return costs;
            },
        }

        // Check for a straight path to one of the preferred targets
        // Enemy Creeps
        const hostileCreeps: Creep[] = MemoryApi.getHostileCreeps(creep.room);
        const closestCreep: Creep | null = _.first(hostileCreeps);
        if (closestCreep) {
            goal.pos = closestCreep.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return closestCreep;
            }
        }

        // Enemy Towers
        const enemyTower: StructureTower | null = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
            { filter: (struct: Structure) => struct.structureType === STRUCTURE_TOWER }
        ) as StructureTower;
        if (enemyTower) {
            goal.pos = enemyTower.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return enemyTower;
            }
        }

        // Enemy Spawn
        const enemySpawn: StructureSpawn | null = creep.pos.findClosestByRange(FIND_HOSTILE_SPAWNS);
        if (enemySpawn) {
            goal.pos = enemySpawn.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return enemySpawn;
            }
        }

        // Enemy Extensions
        const enemyExtension: StructureExtension = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
            { filter: (struct: Structure) => struct.structureType === STRUCTURE_TOWER }
        ) as StructureExtension;
        if (enemyExtension) {
            goal.pos = enemyExtension.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return enemyExtension;
            }
        }

        // Other Structures
        const enemyStructure: Structure<StructureConstant> = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES,
            {
                filter: (struct: Structure) =>
                    struct.structureType !== STRUCTURE_TOWER &&
                    struct.structureType !== STRUCTURE_SPAWN &&
                    struct.structureType !== STRUCTURE_EXTENSION
            }
        ) as Structure<StructureConstant>;
        if (enemyStructure) {
            goal.pos = enemyStructure.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return enemyStructure;
            }
        }

        // Get a wall target
        return this.getIdealWallTarget(creep);
    }

    /**
     * find the ideal wall to attack
     * TODO make this balance between distance and health (ie if a 9m wall is 2 tiles closer than a 2m wall)
     * @param creep the creep we are checking for
     */
    public static getIdealWallTarget(creep: Creep): StructureWall | StructureRampart | undefined {

        const rampart: StructureRampart = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {
            filter: (struct: Structure) => struct.structureType === STRUCTURE_RAMPART
        }) as StructureRampart;

        const wall: StructureWall = creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (struct: Structure) => struct.structureType === STRUCTURE_WALL
        }) as StructureWall;

        if (!wall && !rampart) {
            return undefined;
        }
        if (wall && rampart) {
            return (wall.pos.getRangeTo(creep.pos) < rampart.pos.getRangeTo(creep.pos) ? wall : rampart);
        }
        return (wall ? wall : rampart);
    }
}
