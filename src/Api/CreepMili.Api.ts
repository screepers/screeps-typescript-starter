import { MemoryApi, CreepApi, MiliHelper, UserException, RoomHelper, PathfindingApi } from "utils/internals";

// Api for military creep's
export class MiliApi {
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
        const rangeForEvery: number = creepsInSquad !== null ? creepsInSquad.length - 1 : 1;

        // If we don't have the full squad spawned yet, creep is waiting
        if (creepsInSquad && creepsInSquad!.length < squadSize) {
            return true;
        }

        // If not every creep is in the rally room, we are waiting
        if (_.some(creepsInSquad!, (c: Creep) => c.room.name !== rallyRoom)) {
            return true;
        }

        // Finally, make sure every creep is within an acceptable distance of each other
        const creepsWithinRallyDistance: boolean =
            _.every(creepsInSquad!, (
                cis: Creep // Check that every creep is within 2 tiles of at least 1 other creep in squad
            ) => _.some(creepsInSquad!, (innerC: Creep) => innerC.pos.inRangeTo(cis.pos.x, cis.pos.y, 1))) &&
            _.every(creepsInSquad!, (
                c: Creep // Check that every creep is within 7 tiles of every creep in the squad
            ) =>
                _.every(creepsInSquad!, (innerC: Creep) => c.pos.inRangeTo(innerC.pos.x, innerC.pos.y, rangeForEvery))
            );

        return creepsWithinRallyDistance;
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
        creep.moveTo(new RoomPosition(25, 25, fleeRoom), PathfindingApi.GetDefaultMoveOpts());
    }

    /**
     * get an attack target for the attack creep
     * @param creep the creep we are getting the target for
     * @param creepOptions the creep's military options
     * @param rangeNum the range the creep is requesting for a target
     */
    public static getAttackTarget(
        creep: Creep,
        creepOptions: CreepOptionsMili,
        rangeNum: number
    ): Creep | Structure<StructureConstant> | undefined {
        if (!creepOptions) {
            throw new UserException(
                "No Creep Options for mili creep",
                "getAttackTarget/CreepMiliApi, creep name: [ " + creep.name + " ]",
                ERROR_ERROR
            );
        }

        // Check if a squad member already has an attack target, if so choose that (so squads stay on the same page)
        const squadMembers: Creep[] | null = MemoryApi.getCreepsInSquad(creep.room.name, creepOptions.squadUUID!);
        if (squadMembers) {
            const squadOptions: CreepOptionsMili[] = _.map(
                squadMembers,
                (c: Creep) => c.memory.options as CreepOptionsMili
            );
            let targetOptions: Creep | Structure<StructureConstant> | undefined;
            for (const opt of squadOptions) {
                if (!opt.attackTarget) {
                    continue;
                }
                targetOptions = opt.attackTarget!;
                break;
            }

            if (targetOptions) {
                return targetOptions;
            }
        }

        // Find a fresh target if no creep in squad has a target yet
        let path: PathFinderPath;
        const goal: { pos: RoomPosition; range: number } = {
            pos: new RoomPosition(25, 25, creep.memory.targetRoom),
            range: rangeNum
        };
        const pathFinderOptions: PathFinderOpts = {
            roomCallback: (roomName): boolean | CostMatrix => {
                const room: Room = Game.rooms[roomName];
                const costs = new PathFinder.CostMatrix();
                if (!room) {
                    return false;
                }

                // Set walls and ramparts as unwalkable
                room.find(FIND_STRUCTURES).forEach(function(struct: Structure<StructureConstant>) {
                    if (struct.structureType === STRUCTURE_WALL || struct.structureType === STRUCTURE_RAMPART) {
                        // Set walls and ramparts as unwalkable
                        costs.set(struct.pos.x, struct.pos.y, 0xff);
                    }
                } as any);

                // Set creeps as unwalkable
                room.find(FIND_CREEPS).forEach(function(currentCreep: Creep) {
                    costs.set(currentCreep.pos.x, currentCreep.pos.y, 0xff);
                });

                return costs;
            }
        };

        // Check for a straight path to one of the preferred targets
        // Enemy Creeps
        const hostileCreeps: Creep[] = MemoryApi.getHostileCreeps(creep.room.name, undefined, true);
        const closestCreep: Creep | null = _.first(hostileCreeps);
        if (closestCreep) {
            goal.pos = closestCreep.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return closestCreep;
            }
        }

        // Enemy Towers
        const enemyTower: StructureTower | null = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: (struct: Structure) => struct.structureType === STRUCTURE_TOWER
        }) as StructureTower;
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
                return (enemySpawn as any) as Structure;
            }
        }

        // Enemy Extensions
        const enemyExtension: StructureExtension = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: (struct: Structure) => struct.structureType === STRUCTURE_TOWER
        }) as StructureExtension;
        if (enemyExtension) {
            goal.pos = enemyExtension.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return enemyExtension;
            }
        }

        // Other Structures
        const enemyStructure: Structure<StructureConstant> = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: (struct: Structure) =>
                struct.structureType !== STRUCTURE_TOWER &&
                struct.structureType !== STRUCTURE_SPAWN &&
                struct.structureType !== STRUCTURE_EXTENSION
        }) as Structure<StructureConstant>;
        if (enemyStructure) {
            goal.pos = enemyStructure.pos;
            path = PathFinder.search(creep.pos, goal, pathFinderOptions);
            if (!path.incomplete) {
                return enemyStructure;
            }
        }

        // Neutral structures
        if (RoomHelper.isAllyRoom(creep.room) === false) {
            const neutralStructure: Structure<StructureConstant> = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (struct: Structure) =>
                    struct.structureType === STRUCTURE_CONTAINER || struct.structureType === STRUCTURE_ROAD
            }) as Structure<StructureConstant>;
            if (neutralStructure) {
                goal.pos = neutralStructure.pos;
                path = PathFinder.search(creep.pos, goal, pathFinderOptions);
                if (!path.incomplete) {
                    return neutralStructure;
                }
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
    public static getDomesticDefenseAttackTarget(
        creep: Creep,
        creepOptions: CreepOptionsMili,
        CREEP_RANGE: number
    ): Creep | null {
        const hostileCreeps: Creep[] = MemoryApi.getHostileCreeps(creep.room.name);

        if (hostileCreeps.length > 0) {
            return creep.pos.findClosestByRange(hostileCreeps);
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
        const creepsInRoom: Creep[] = MiliApi.getAllyCreepsInRoom(creep.room);
        return creep.pos.findClosestByPath(creepsInRoom, { filter: (c: Creep) => c.hits < c.hitsMax });
    }

    /**
     * find the ideal wall to attack
     * @param creep the creep we are checking for
     */
    public static getIdealWallTarget(creep: Creep): StructureWall | StructureRampart | undefined {
        // Check for any significantly lower walls first (ie 25% lower than other walls, and also accessible)
        // TODO
        // Look for ALL enemy walls/ramparts, average them, then find the closest one by path that is also X% below the average
        // If none found, just target the closest as normally occurs below

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
            return wall.pos.getRangeTo(creep.pos) < rampart.pos.getRangeTo(creep.pos) ? wall : rampart;
        }
        return wall ? wall : rampart;
    }

    /**
     * moves the creep away from the target
     */
    public static kiteEnemyCreep(creep: Creep): boolean {
        const hostileCreep: Creep | null = creep.pos.findClosestByRange(MemoryApi.getHostileCreeps(creep.room.name));
        if (!hostileCreep) {
            return false;
        }
        let path: PathFinderPath;
        const pathFinderOptions: PathFinderOpts = { flee: true };
        path = PathFinder.search(creep.pos, hostileCreep.pos, pathFinderOptions);
        if (path.path.length > 0) {
            creep.moveTo(path.path[0]);
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
        if (!creepOptions) {
            throw new UserException(
                "Mili Creep has no creep options",
                "CreepMiliApi/CheckMiliCreepBasics, creep name: [ " + creep.name + " ]",
                ERROR_ERROR
            );
        }

        const targetRoom: string = creep.memory.targetRoom;
        const fleeLocation = creepOptions.rallyLocation ? creepOptions.rallyLocation.roomName : creep.memory.homeRoom;
        // Check if we need to flee
        if (creepOptions.flee && creep.hits < 0.25 * creep.hitsMax) {
            this.fleeCreep(creep, fleeLocation);
            if (creepOptions.healer) {
                creep.heal(creep);
            }
            return true;
        }

        if (!creepOptions.rallyDone) {
            if (this.setWaitingForRally(creep, creepOptions)) {
                // Move the creeps together while waiting for rally so they move out as a team more quickly
                this.moveCreepToFurthestSquadMember(creep);
                return true; // idle if we are waiting on everyone to rally still
            }
            // Have the creep stop checking for rally
            creepOptions.rallyDone = true;
            creep.memory.options = creepOptions;
        }

        // Everyone is rallied, time to move out into the target room as a group if not already there
        if (creep.room.name !== targetRoom) {
            creep.moveTo(new RoomPosition(25, 25, targetRoom));
            return true;
        }

        // If creep is on exit tile, move them off
        if (CreepApi.moveCreepOffExit(creep)) {
            return true;
        }

        // Return false if we didn't need to do any of this
        return false;
    }

    /**
     * move the creep to the furthest squad member
     * @param
     */
    public static moveCreepToFurthestSquadMember(creep: Creep): void {
        const creepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
        const creepsInSquad: Creep[] | null = MemoryApi.getCreepsInSquad(creep.room.name, creepOptions.squadUUID!);
        let furthestSquadMember: RoomPosition | undefined;
        for (const member of creepsInSquad!) {
            if (member.room.name === creep.room.name) {
                if (!furthestSquadMember) {
                    furthestSquadMember = member.pos;
                    continue;
                }
                if (creep.pos.getRangeTo(furthestSquadMember) < creep.pos.getRangeTo(member.pos)) {
                    furthestSquadMember = member.pos;
                }
            }
        }
        // If we found a squad member in the same room, move towards it
        if (furthestSquadMember) {
            creep.moveTo(furthestSquadMember);
        }
    }

    /**
     * get all ally creeps in the room
     * @param room the room we are in
     */
    public static getAllyCreepsInRoom(room: Room): Creep[] {
        return _.filter(room.find(FIND_CREEPS), (creep: Creep) => MiliHelper.isAllyCreep(creep));
    }

    /**
     * reset the creep's attack target in memory
     * @param creep the creep we are resetting the options for
     */
    public static resetOffensiveTarget(creep: Creep): void {
        const creepOptions: CreepOptionsMili = creep.memory.options as CreepOptionsMili;
        if (!creepOptions) {
            throw new UserException(
                "Tried to reset attack target of a creep with no options in memory",
                "CreepMiliApi/ResetOffensiveTarget, Creep name: [ " + creep.name + " ]",
                ERROR_WARN
            );
        }
        creepOptions.attackTarget = undefined;
    }
}
