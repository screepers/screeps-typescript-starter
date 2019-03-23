import MemoryApi from "./Memory.Api";
import { DEFAULT_MOVE_OPTS } from "utils/constants";
import CreepApi from "./Creep.Api";

// Api for military creep's
export default class CreepMili {

    /**
     * check if we're still waiting on creeps to rally
     * @param creepOptions the options for the military creep
     * @param creep the creep we're checking on
     */
    public static setWaitingForRally(creep: Creep, creepOptions: CreepOptionsMili): boolean {

        // If these options aren't defined, creep isn't waiting for rally
        if (!creepOptions.rallyLocation || !creepOptions.squadSize || !creepOptions.rallyLocation) {
            return false;
        }
        const squadSize: number = creepOptions.squadSize!;
        const squadUUID: number = creepOptions.squadUUID!;
        const rallyRoom: string = creepOptions.rallyLocation.roomName;
        const creepsInSquad: Creep[] | null = MemoryApi.getCreepsInSquad(creep.room.name, squadUUID);


        // If we don't have the full squad spawned yet, creep is waiting
        if (!creepsInSquad && creepsInSquad!.length < squadSize) {
            return true;
        }

        // If not every creep is in the rally room, we are waiting
        if (_.some(creepsInSquad!, (c: Creep) => c.room.name !== rallyRoom)) {
            return true;
        }

        // Finally, make sure every creep is within an acceptable distance of each other
        const creepsWithinRallyDistance: boolean =
            _.every(creepsInSquad!, (cis: Creep) =>  // Check that every creep is within 2 tiles of at least 1 other creep in squad
                _.some(creepsInSquad!, (innerC: Creep) => innerC.pos.inRangeTo(cis.pos.x, cis.pos.y, 2))
            ) &&
            _.every(creepsInSquad!, (c: Creep) =>    // Check that every creep is within 7 tiles of every creep in the squad
                _.every(creepsInSquad!, (innerC: Creep) => c.pos.inRangeTo(innerC.pos.x, innerC.pos.y, 7))
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
     * @param fleeRoom the room the creep is running too
     */
    public static fleeCreep(creep: Creep, fleeRoom: string): void {
        creep.moveTo(new RoomPosition(25, 25, fleeRoom), DEFAULT_MOVE_OPTS);
    }

    /**
     * get an attack target for the attack creep
     * @param creep the creep we are getting the target for
     * @param creepOptions the creep's military options
     * @param rangeNum the range the creep is requesting for a target
     */
    public static getAttackTarget(creep: Creep, creepOptions: CreepOptionsMili, rangeNum: number): Creep | Structure<StructureConstant> | undefined {

        let path: PathFinderPath;
        const goal: { pos: RoomPosition, range: number } = { pos: new RoomPosition(25, 25, creep.memory.targetRoom), range: rangeNum }
        const pathFinderOptions: PathFinderOpts = {
            roomCallback: (roomName): boolean | CostMatrix => {

                const room: Room = Game.rooms[roomName];
                const costs = new PathFinder.CostMatrix;
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
                room.find(FIND_CREEPS).forEach(function (currentCreep: Creep) {
                    costs.set(currentCreep.pos.x, currentCreep.pos.y, 0xff);
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
     * get a target for a domestic defender
     * @param creep the defender creep
     * @param creepOptions the options for the defender creep
     */
    public static getDomesticDefenseAttackTarget(creep: Creep, creepOptions: CreepOptionsMili, CREEP_RANGE: number): Creep | null {

        const hostileCreeps: Creep[] = MemoryApi.getHostileCreeps(creep.room);

        if (hostileCreeps.length > 0) {
            return creep.pos.findClosestByPath(hostileCreeps);
        }
        return null;
    }

    /**
     * get a healing target for the healer creep
     * @param creep the creep we are geting the target for
     * @param creepOptions the options for the military creep
     */
    public static getHealingTarget(creep: Creep, creepOptions: CreepOptionsMili): Creep | null {

        let healingTarget: Creep | null;
        const squadMembers: Creep[] | null = MemoryApi.getCreepsInSquad(creep.room.name, creepOptions.squadUUID!);

        // If squad, find closest squad member with missing health
        if (creepOptions.squadUUID && squadMembers) {

            // Squad implied, find closest squadMember with missing health
            healingTarget = creep.pos.findClosestByPath(squadMembers!, {
                filter: (c: Creep) => c.hits < c.hitsMax
            });

            return healingTarget;
        }

        // No squad members, find closest creep
        const creepsInRoom: Creep[] = creep.room.find(FIND_MY_CREEPS);
        return creep.pos.findClosestByPath(creepsInRoom, { filter: (c: Creep) => c.hits < c.hitsMax });
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
        const goal: { pos: RoomPosition, range: number } = { pos: new RoomPosition(25, 25, creep.memory.targetRoom), range: CREEP_RANGE }
        const pathFinderOptions: PathFinderOpts = { flee: true }
        path = PathFinder.search(hostileCreep!.pos, goal, pathFinderOptions);
        if (path.path.length > 0) {
            creep.moveTo(path.path[0], DEFAULT_MOVE_OPTS);
            return true;
        }
        return false;
    }

    /**
     * perform the basic operations for military creeps
     * This includes: Fleeing, Rallying, moving into target room, and moving off exit tile
     * @param creep the creep we are doing the operations for
     * @param creepOptions the options for the military creep
     */
    public static checkMilitaryCreepBasics(creep: Creep, creepOptions: CreepOptionsMili): boolean {
        const targetRoom: string = creep.memory.targetRoom;
        const fleeLocation = creepOptions.rallyLocation ? creepOptions.rallyLocation.roomName : creep.memory.homeRoom;
        // Check if we need to flee
        if (creepOptions.flee && creep.hits < .25 * creep.hitsMax) {
            this.fleeCreep(creep, fleeLocation);
            return true;
        }

        if (!creepOptions.rallyDone) {
            if (this.setWaitingForRally(creep, creepOptions)) {
                return true; // idle if we are waiting on everyone to rally still
            }
            // Have the creep stop checking for rally
            creepOptions.rallyDone = true;
            creep.memory.options = creepOptions;
        }

        // Everyone is rallied, time to move out into the target room as a group if not already there
        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, targetRoom), DEFAULT_MOVE_OPTS);
            return true;
        }

        // If creep is on exit tile, move them off
        if (CreepApi.moveCreepOffExit(creep)) {
            return true;
        }

        // Return false if we didn't need to do any of this
        return false;
    }
};
