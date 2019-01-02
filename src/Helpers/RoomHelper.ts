// helper functions for rooms
export class RoomHelper {

    /**
     * check if a specified room is owned by you
     */
    public static isOwnedRoom(room: Room): boolean {
      
        // check if the room name is the same as any you own
        return !_.some(Game.rooms, r => r.name === room.name)
    }

    /**
     * check if a specified room is an ally room
     */
    public static isAllyRoom(room: any): boolean {
        
        // returns true if a room has one of our names but is not owned by us
        return (!this.isOwnedRoom(room) && (room.controller.owner.username === "Uhmbrock" || room.controller.owner.username === "Jakesboy2"))
    }

    /**
     * check if a room is a source keeper room -- IN PROGRESS
     */
    public static isSourceKeeperRoom(room: any): boolean {
        return false;
    }

    /**
     * check if a room is a highway room -- IN PROGRESS
     */
    public static isHighwayRoom(room: any): boolean {
        return false;
    }

    /**
     * check if a room is close enough to send a creep to -- IN PROGRESS
     */
    public static inTravelRange(room: Room): boolean {
        return false;
    }

    /**
     * return all the objects of a specified type in the room
     */
    public static getObjectsInRoom(room: Room, objectConst?: StructureConstant): StringMap {
        
        let allObjectsID: StringMap;

        // if no structure was specified, get all the structures
        if(!objectConst){
            allObjectsID = room.memory.structures;
        }
        else{ // if structure specified, get by that
            allObjectsID = room.memory.structures[objectConst];
        }

        const allObjects: StringMap = _.map(allObjectsID, (o) => Game.getObjectById(o));

        if(allObjects !== undefined){
            return allObjects;
        }

        // if not, throw memory not set exception
        throw new Error(`Memory not set for structure ${objectConst} in room ${room.name}.`);
    }

    /**
     * return all the objects of a specified type in the room by a filter function
     */
    public static getObjectsInRoomBy(room: Room, filterFunction: (o: any) => boolean, objectConst?: StructureConstant): StringMap {

        let allObjects: StringMap;

        // if no structure was specified, get all of the structures
        if(!objectConst){
            allObjects = this.getObjectsInRoom(room);
        }
        else{ // if structure was specified, get by that
            allObjects = this.getObjectsInRoom(room, objectConst);
        }

        return _.filter(allObjects, filterFunction);
    }

    /**
     * get all the creeps in the room 
     */
    public static getCreepsInRoom(room: Room, creepConst?: number): StringMap {

        let allCreeps: StringMap;

        // if no role was specified, get all of the creeps
        if(!creepConst){
            allCreeps = room.memory.creeps;
        }
        else{ // if role was specified, get just those roles
            allCreeps = room.memory.creeps[creepConst];
        }
        
        if(allCreeps !== undefined){
            return allCreeps;
        }

        // if not, throw memory not set exception
        throw new Error(`Memory not set for structure ${creepConst} in room ${room.name}.`);
    }

    /**
     * get creeps in room by a filter function
     */
    public static getCreepsInRoomBy(room: Room, filterFunction: (c: any) => boolean, creepConst?: number): StringMap{

        let allCreeps: StringMap;

        // if no role was specified, get all of the creeps
        if(!creepConst){
            allCreeps = this.getCreepsInRoom(room);
        }
        else{ // if role specified, get by that
            allCreeps = this.getCreepsInRoom(room, creepConst);
        }

        return _.filter(allCreeps, filterFunction);
    }

    /**
     * get number of creeps in room (can pass a filter function)
     */ 
    public static getNumCreepsInRoomBy(room: Room, creepConst?: number, filterFunction?: (c: any) => boolean): number {

        let allCreeps: StringMap;

        // if no role was specified, get all of the creeps
        if(!creepConst){
            allCreeps = this.getCreepsInRoom(room);
        }
        else{ // if role specified, get by that
            allCreeps = this.getCreepsInRoom(room, creepConst);
        }
      
        // if no filter function provdied
        if(!filterFunction){
            return allCreeps.length;
        }
        // if filter function is provided, apply it
        return _.filter(allCreeps, filterFunction).length;
    }

    // check if the object exists within the room
    public static isExistInRoom(room: any, objectConst: StructureConstant): boolean{

        // return true if any of this object exists
        if(this.getObjectsInRoom(room, objectConst).length > 0){
            return true;
        }

        return false;
    }
  
  /*
   * get the stored amount from the target
   */
    public static getStoredAmount(target: any, resourceType: ResourceConstant): number | undefined{
      
        if (target instanceof Creep) {
            return target.carry[resourceType];
        }
        else if (target.hasOwnProperty("store")) {
            return target.store[resourceType];
        }
        else if (resourceType === RESOURCE_ENERGY && target.hasOwnProperty("energy")) {
            return target.energy;
        }  

        return -1;
    }
  
  /*
   * get the capacity from the target
   */
    public static getStoredCapacity(target: any, resourceType: string): number{
      
        if (target instanceof Creep) {
            return target.carryCapacity;
        }
        else if (target.hasOwnProperty("store")) {
            return target.storeCapacity;
        }
        else if (target.hasOwnProperty("energyCapacity")) {
            return target.energyCapacity;
        }

        return -1;
    }
      
  /*
   * get the amount of damage a tower will do at this distance
   */
    public static getTowerDamageAtRange(range: number) {
        if (range <= TOWER_OPTIMAL_RANGE) { return TOWER_POWER_ATTACK; }
        if (range >= TOWER_FALLOFF_RANGE) { range = TOWER_FALLOFF_RANGE; }
        return TOWER_POWER_ATTACK - (TOWER_POWER_ATTACK * TOWER_FALLOFF *
            (range - TOWER_OPTIMAL_RANGE) / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE));
    }
}   
