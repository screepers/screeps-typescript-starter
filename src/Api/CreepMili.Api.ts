import MemoryApi from "./Memory.Api";
import { DEFAULT_MOVE_OPTS } from "utils/constants";

// Api for military creep's
export default class CreepMili {

    /**
     * check if we're still waiting on creeps to rally
     * @param creepOptions the options for the military creep
     */
    public static setWaitingForRally(creepOptions: CreepOptionsMili): boolean {

        // If these options aren't defined, creep isn't waiting for rally
        if (!creepOptions.rallyLocation || !creepOptions.squadSize || !creepOptions.rallyLocation) {
            return false;
        }
        const squadSize: number = creepOptions.squadSize!;
        const squadUUID: number = creepOptions.squadUUID!;
        const rallyRoom: string = creepOptions.rallyLocation.roomName;
        const creepsInSquad: Creep[] = MemoryApi.getMyCreeps(rallyRoom, (creep: Creep) => {
            const currentCreepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
            if (!currentCreepOptions.squadUUID) {
                return false;
            }
            return currentCreepOptions.squadUUID === squadUUID;
        });

        // If we don't have the full squad spawned yet, creep is waiting
        if (creepsInSquad.length < squadSize) {
            return true;
        }

        // If not every creep is in the rally room, we are waiting
        if (_.some(creepsInSquad, (c: Creep) => c.room.name !== rallyRoom)) {
            return true;
        }

        // Finally, make sure every creep is within an acceptable distance of each other
        const creepsWithinRallyDistance: boolean =
            _.every(creepsInSquad, (cis: Creep) =>  // Check that every creep is within 2 tiles of at least 1 other creep in squad
                _.some(creepsInSquad, (innerC: Creep) => innerC.pos.inRangeTo(cis.pos.x, cis.pos.y, 2))
            ) &&
            _.every(creepsInSquad, (c: Creep) =>    // Check that every creep is within 7 tiles of every creep in the squad
                _.every(creepsInSquad, (innerC: Creep) => c.pos.inRangeTo(innerC.pos.x, innerC.pos.y, 7))
            );

        if (creepsWithinRallyDistance) {
            return true;
        }

        // If we make it to here, we are done waiting
        return false;
    }

    /**
     * check if the creep is in range to attack the target
     * @param creep the creep we are checking for
     * @param target the room position for the target in question
     * @param isMelee if the creep can only melee
     */
    public static isInAttackRange(creep: Creep, target: RoomPosition, isMelee: boolean): boolean {
        if (isMelee) {
            return creep.pos.isNearTo(target);
        }
        return creep.pos.inRangeTo(target, 3);
    }

    /**
     * have the creep flee back to the homestead
     * @param creep the creep that is fleeing
     */
    public static fleeCreep(creep: Creep, homeRoom: string): void {
        creep.moveTo(new RoomPosition(25, 25, homeRoom), DEFAULT_MOVE_OPTS);
    }

    /**
     * get an attack target for the zealot creep
     * @param creep the creep we are getting the target for
     * @param creepOptions the creep's military options
     * @param rangeNum the range the creep is requesting for a target
     */
    public static getAttackTarget(creep: Creep, creepOptions: CreepOptionsMili, rangeNum: number): Creep | Structure<StructureConstant> | undefined {

        let path: PathFinderPath;
        let goal: { pos: RoomPosition, range: number } = { pos: new RoomPosition(25, 25, creep.memory.targetRoom), range: rangeNum }
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

    /**
     * moves the creep away from the target
     */
    public static kiteEnemyCreep(creep: Creep): boolean {
        const hostileCreep: Creep | null = creep.pos.findClosestByPath(MemoryApi.getHostileCreeps(creep.room));
        const CREEP_RANGE: number = 3;
        if (!hostileCreep) {
            return false;
        }
        let path: PathFinderPath;
        let goal: { pos: RoomPosition, range: number } = { pos: new RoomPosition(25, 25, creep.memory.targetRoom), range: CREEP_RANGE }
        let pathFinderOptions: PathFinderOpts = { flee: true }
        path = PathFinder.search(hostileCreep!.pos, goal, pathFinderOptions);
        if (path.path.length > 0) {
            creep.moveTo(path.path[0], DEFAULT_MOVE_OPTS);
            return true;
        }
        return false;
    }
};
