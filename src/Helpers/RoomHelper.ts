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
        
        // if no structure was specified, get all the structures
        if(!objectConst){
            const allObjectsID: StringMap = room.memory.structures;
        }
        else{ // if structure specified, get by that
            const allObjectsID: StringMap = room.memory.structures[objectConst];
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
    public static getObjectsInRoomBy(room: Room, objectConst?: StructureConstant, filterFunction: (o) => boolean): StringMap {

        // if no structure was specified, get all of the structures
        if(!objectConst){
            const allObjects: StringMap = this.getObjectsInRoom(room);
        }
        else{ // if structure was specified, get by that
            const allObjects: StringMap = this.getObjectsInRoom(room, objectConst);
        }

        return _.filter(allObjects, filterFunction);
    }

    /**
     * get all the creeps in the room 
     */
    public static getCreepsInRoom(room: Room, creepConst?: RoleConstant): StringMap {

        // if no role was specified, get all of the creeps
        if(!creepConst){
            const allCreeps: StringMap = room.memory.creeps;
        }
        else{ // if role was specified, get just those roles
            const allCreeps: StringMap = room.memory.creeps[creepConst];
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
    public static getCreepsInRoomBy(room: Room, creepConst?: RoleConstant, filterFunction: (c: any) => boolean): StringMap{

        // if no role was specified, get all of the creeps
        if(!creepConst){
            const allCreeps: StringMap = this.getCreepsInRoom(room);
        }
        else{ // if role specified, get by that
            const allCreeps: StringMap = this.getCreepsInRoom(room, creepConst);
        }

        return _.filter(allCreeps, filterFunction);
    }

    /**
     * get number of creeps in room (can pass a filter function)
     */ 
    public static getNumCreepsInRoomBy(room: Room, creepConst?: RoleConstant, filterFunction?: (c: any) => boolean): number {

        // if no role was specified, get all of the creeps
        if(!creepConst){
            const allCreeps: StringMap = this.getCreepsInRoom(room);
        }
        else{ // if role specified, get by that
            const allCreeps: StringMap = this.getCreepsInRoom(room, creepConst);
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
        return this.getObjectsInRoom(room, objectConst).length > 0){
    }
  
  /*
   * get the stored amount from the target
   */
    public static getStoredAmount(target: StructureStorage | StructureTerminal | StructureContainer | Creep | Resource, 
                                   resourceType: string): number{
      
        if (target instanceof Creep) {
            return target.carry[resourceType];
        }
        else if (target.hasOwnProperty("store")) {
            return target.store[resourceType];
        }
        else if (resourceType === RESOURCE_ENERGY && target.hasOwnProperty("energy")) {
            return target.energy;
        }  
    }
  
  /*
   * get the capacity from the target
   */
    public static getStoredCapacity(target: StructureStorage | StructureTerminal | StructureContainer | Creep | Resource, 
                                   resourceType: string): number{
      
        if (target instanceof Creep) {
            return target.carryCapacity;
        }
        else if (target.hasOwnProperty("store")) {
            return target.storeCapacity;
        }
        else if (target.hasOwnProperty("energyCapacity")) {
            return target.energyCapacity;
        }
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
