// helper functions for rooms
export class RoomHelper {

    /**
     * check if a specified room is owned by you
     * @param room the room we want to check
     */
    public static isOwnedRoom(room: Room): boolean {
      
        // check if the room name is the same as any you own
        return !_.some(Game.rooms, r => r.name === room.name)
    }

    /**
     * check if a specified room is an ally room
     * @param room the room we want to check
     */
    public static isAllyRoom(room: any): boolean {
        
        // returns true if a room has one of our names but is not owned by us
        return (!this.isOwnedRoom(room) && (room.controller.owner.username === "Uhmbrock" || room.controller.owner.username === "Jakesboy2"))
    }

    /**
     * check if a room is a source keeper room -- IN PROGRESS
     * @param room the room we want to check
     */
    public static isSourceKeeperRoom(room: any): boolean {
        return false;
    }

    /**
     * check if a room is a highway room -- IN PROGRESS
     * @param room the room we want to check
     */
    public static isHighwayRoom(room: any): boolean {
        return false;
    }

    /**
     * check if a room is close enough to send a creep to -- IN PROGRESS
     * @param room the room we want to check
     */
    public static inTravelRange(room: Room): boolean {
        return false;
    }

    /**
     * return all the objects of a specified type in the room
     * @param room the room we want to get objects from
     * @param objectConst [optional] the structure we want
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
     * @param room the room we want to get objects from
     * @param filterFunction the filter for the objects
     * @param objectConst [optional] the structure we want
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

    // note : it wouldn't let be put RoleConstant for the creepConst type on some of these, so i chagned all to make it consistant
    /**
     * get all the creeps in the room 
     * @param room the room we want to get creeps from
     * @param creepConst [optional] the RoleConstant 
     */
    public static getCreepsInRoom(room: Room, creepConst?: any): StringMap {

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
        throw new Error(`Memory not set for creep ${creepConst} in room ${room.name}.`);
    }


    /**
     * get creeps in room by a filter function
     * @param room the room we want to get creeps from
     * @param filterFunction the filter for the creeps
     * @param creepConst [optional] the type of creep you want (RoleConstant)
     */
    public static getCreepsInRoomBy(room: Room, filterFunction: (c: any) => boolean, creepConst?: any): StringMap{

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
     * @param room room we want the creeps from
     * @param creepConst [optional] creep role we want
     * @param filterFunction [optional] the function we want to filter by
     */ 
    public static getNumCreepsInRoomBy(room: Room, creepConst?: any, filterFunction?: (c: any) => boolean): number {

        let allCreeps: StringMap;

        // if no role was specified, get all of the creeps
        if(!creepConst){
            allCreeps = this.getCreepsInRoom(room);
        }
        else{ // if role specified, get by that
            allCreeps = this.getCreepsInRoom(room);
        }
      
        // if no filter function provdied
        if(!filterFunction){
            return allCreeps.length;
        }
        // if filter function is provided, apply it
        return _.filter(allCreeps, filterFunction).length;
    }

    /**
     * check if the object exists within a room
     * @param room the room we want to check
     * @param objectConst the object we want to check for
     */
    public static isExistInRoom(room: any, objectConst: StructureConstant): boolean{

        // return true if any of this object exists
        if(this.getObjectsInRoom(room, objectConst).length > 0){
            return true;
        }

        return false;
    }
  
  /**
   * get the stored amount from the target
   * @param target the target we want to check the storage of
   * @param resourceType the resource we want to check the storage for
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
  
  /**
   * get the capacity from the target
   * @param target the target we want to check the capacity of
   */
    public static getStoredCapacity(target: any): number{
      
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
      
  /**
   * get the amount of damage a tower will do at this distance
   * @param range the distance the target is from the tower
   */
    public static getTowerDamageAtRange(range: number) {
        if (range <= TOWER_OPTIMAL_RANGE) { return TOWER_POWER_ATTACK; }
        if (range >= TOWER_FALLOFF_RANGE) { range = TOWER_FALLOFF_RANGE; }
        return TOWER_POWER_ATTACK - (TOWER_POWER_ATTACK * TOWER_FALLOFF *
            (range - TOWER_OPTIMAL_RANGE) / (TOWER_FALLOFF_RANGE - TOWER_OPTIMAL_RANGE));
    }

    /**
     * only returns true every ${paramter} number of ticks
     * @param ticks the number of ticks you want between executions
     */
    public static excecuteEveryTicks(ticks: number): boolean{
        if(Game.time % ticks === 0){
            return true;
        }

        return false;
    }
}   
