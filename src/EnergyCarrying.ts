import { SourceMine } from "SourceMine";
import { forEach, sortBy } from "lodash";
import { EnergyRoute } from "EnergyRoute";
import { RoomRoutine } from "RoomProgram";

export class EnergyCarrying extends RoomRoutine {
    name = "energy carrying";

    constructor() {
        super();
    }

    routine(room: Room): void {
        console.log('energy carrying');

        if (!room.memory.energyRoutes) { this.calculateRoutes(room); }
        if (!room.memory.energyRoutes) { return; }

        let routes = room.memory.energyRoutes as EnergyRoute[];
        forEach(routes, (route) => {
            let r = route as EnergyRoute;
            forEach(r.Carriers, (carrier) => {
                let creep = Game.getObjectById(carrier.creepId) as Creep;
                let currentWaypointIdx = carrier.waypointIdx;
                if (creep == null) { return; }

                if (this.LocalDelivery(creep, currentWaypointIdx, r)) return;
                this.MoveToNextWaypoint(creep, currentWaypointIdx, r, carrier);
            });
        });

        room.memory.energyRoutes = routes;
    }

    SpawnCarryCreep(
        route: EnergyRoute,
        spawn: StructureSpawn): boolean {

        if (route.Carriers.length < 1) {
            return spawn.spawnCreep(
                [CARRY, CARRY, MOVE, MOVE],
                spawn.name + Game.time,
                { memory: { role: "carrier" } }) == OK;
        }

        return false;
    }

    LocalDelivery(creep: Creep, currentWaypointIdx: number, route: EnergyRoute): boolean {
        let currentRouteWaypoint = route.waypoints[currentWaypointIdx];
        let currentWaypoint = new RoomPosition(currentRouteWaypoint.x, currentRouteWaypoint.y, currentRouteWaypoint.roomName);

        if (creep.pos.getRangeTo(currentWaypoint) > 3) { return false; }

        if (creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0 && !currentRouteWaypoint.surplus) {
            console.log('delivering energy');
            let nearbyObjects = currentWaypoint.findInRange(FIND_STRUCTURES, 3, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER ||
                        structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_STORAGE) &&
                        structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                }
            });

            let nearestObject = sortBy(nearbyObjects, (structure) => {
                return creep.pos.getRangeTo(structure);
            })[0];

            if (nearestObject != null) {
                creep.moveTo(nearestObject, { maxOps: 50, range: 1 });
                creep.transfer(nearestObject, RESOURCE_ENERGY);
                return true;
            }
        }

        if (currentRouteWaypoint.surplus) {
            if (creep.store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
                console.log('picking up energy');
                let nearbyObjects = currentWaypoint.findInRange(FIND_STRUCTURES, 3, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER) &&
                            structure.store.getUsedCapacity(RESOURCE_ENERGY) > 0;
                    }
                });

                let nearestObject = sortBy(nearbyObjects, (structure) => {
                    return creep.pos.getRangeTo(structure);
                })[0];

                if (nearestObject != null) {
                    creep.moveTo(nearestObject, { maxOps: 50, range: 1 });
                    creep.withdraw(nearestObject, RESOURCE_ENERGY);
                    return true;
                }

                let nearestEnergyPile = sortBy(currentWaypoint.findInRange(FIND_DROPPED_RESOURCES, 3), (energyPile) => {
                    return creep.pos.getRangeTo(energyPile);
                })[0];

                if (nearestEnergyPile != null) {
                    creep.moveTo(nearestEnergyPile, { maxOps: 50, range: 1 });
                    creep.pickup(nearestEnergyPile);
                    return true;
                }
            }
            else if (creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
                console.log('delivering local energy');
                let nearbyObjects = currentWaypoint.findInRange(FIND_CREEPS, 3, {
                    filter: (creep) => {
                        return creep.memory.role == "busyBuilder" && creep.store.getFreeCapacity(RESOURCE_ENERGY) > 20;
                    }
                });

                let nearestObject = sortBy(nearbyObjects, (structure) => {
                    return creep.pos.getRangeTo(structure);
                })[0];

                if (nearestObject != null) {
                    creep.moveTo(nearestObject, { maxOps: 50, range: 1 });
                    creep.transfer(nearestObject, RESOURCE_ENERGY);
                    return true;
                }
            }
        }

        return false;
    }

    MoveToNextWaypoint(creep: Creep, currentWaypointIdx: number, route: EnergyRoute, carrier: { creepId: Id<Creep>, waypointIdx: number }) {
        console.log("Moving to next waypoint: " + currentWaypointIdx);
        let nextWaypointIdx = currentWaypointIdx + 1;
        if (nextWaypointIdx >= route.waypoints.length) { nextWaypointIdx = 0; }

        let nextMemWaypoint = route.waypoints[nextWaypointIdx];
        let nextWaypoint = new RoomPosition(nextMemWaypoint.x, nextMemWaypoint.y, nextMemWaypoint.roomName);

        creep.moveTo(nextWaypoint, { maxOps: 50 });

        new RoomVisual(creep.room.name).line(creep.pos, nextWaypoint);

        if (creep.pos.getRangeTo(nextWaypoint) <= 3) {
            carrier.waypointIdx = nextWaypointIdx;
        }
    }

    calculateRoutes(room: Room) {
        if (!room.memory.sourceMines) { return; }

        let mines = room.memory.sourceMines as SourceMine[];

        let miners = room.find(FIND_MY_CREEPS, { filter: (creep) => { return creep.memory.role == "busyHarvester"; } });
        if (miners.length == 0) { return; }

        if (room.find(FIND_MY_SPAWNS).length == 0) { return; }
        let spawn = room.find(FIND_MY_SPAWNS)[0];

        let energyRoutes: EnergyRoute[] = [];
        forEach(mines, (mine) => {
            let harvestPos = new RoomPosition(
                mine.HarvestPositions[0].pos.x,
                mine.HarvestPositions[0].pos.y,
                mine.HarvestPositions[0].pos.roomName);
            if (harvestPos == null) { return; }

            energyRoutes.push(
                {
                    waypoints: [
                        { x: harvestPos.x, y: harvestPos.y, roomName: harvestPos.roomName, surplus: true },
                        { x: spawn.pos.x, y: spawn.pos.y, roomName: spawn.pos.roomName, surplus: false }],
                    Carriers: []
                });
        });

        room.memory.energyRoutes = energyRoutes;
    }
}
