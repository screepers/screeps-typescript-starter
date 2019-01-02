// helper functions for rooms
export class RoomHelper {

    // returns true if you own the room
    public static isOwnedRoom(room: Room): boolean {

        // check if the room name is the same as any you own
        if(!_.some(Game.rooms, r => r.name === room.name)){
            return false;
        }

        return true;
    }

    // is ally
    public static isAllyRoom(room: any): boolean {

        if(!this.isOwnedRoom(room) && (room.controller.owner.username === "Uhmbrock" || room.controller.owner.username === "Jakesboy2")){
            return true;
        }

        return false;
    }

    // is source keeper -- in progress
    public static isSourceKeeperRoom(room: any): boolean {
        return false;
    }

    // is highway -- in progress
    public static isHighwayRoom(room: any): boolean {
        return false;
    }

    // is in walking range -- in progress
    public static inTravelRange(room: Room): boolean {
        return false;
    }

    // get object in room
    public static getObjectsInRoom(room: Room, objectConst: StructureConstant): StringMap {

        // check if the objects are in memory
        const allObjectsID: StringMap = room.memory.structures[objectConst];

        const allObjects: StringMap = _.map(allObjectsID, (o) => Game.getObjectById(o));

        if(allObjects !== undefined){
            return allObjects;
        }

        // if not, throw memory not set exception
        throw new Error(`Memory not set for structure ${objectConst} in room ${room.name}.`);
    }

    // get object in room by filter
    public static getObjectsInRoomBy(room: Room, objectConst: StructureConstant, filterFunction: (o) => boolean): StringMap {

        const allObjects: StringMap = room.memory.structures[objectConst];

        return _.filter(allObjects, filterFunction);
    }

    // get creeps in room
    public static getCreepsInRoom(room: Room, creepConst: RoleConstant): StringMap {

        // check if the creeps are in memory
        const allCreeps: StringMap = room.memory.creeps[creepConst];

        if(allCreeps !== undefined){
            return allCreeps;
        }

        // if not, throw memory not set exception
        throw new Error(`Memory not set for structure ${creepConst} in room ${room.name}.`);
    }

    // get creeps in room by filter
    public static getCreepsInRoomBy(room: Room, creepConst: RoleConstant, filterFunction: (c: any) => boolean): StringMap{

        const allCreeps: StringMap = this.getCreepsInRoom(room, creepConst);

        return _.filter(allCreeps, filterFunction);
    }

    // get number of creeps in a role, can also pass a filter function to narrow down selection
    public static getNumCreepsInRoomBy(room: Room, creepConst: RoleConstant, filterFunction?: (c: any) => boolean): number {

        // get all creeps of this role
        const allCreeps: StringMap = this.getCreepsInRoom(room, creepConst);

        // if no filter function provdied
        if(filterFunction == null){
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
   * get the capacity amount from the target
   */
    public static getStoredAmount(target: StructureStorage | StructureTerminal | StructureContainer | Creep | Resource, 
                                   resourceType: string): number{
      
  /*
   * get the stored amount from the target
   */
    public static getStoredAmount(target: StructureStorage | StructureTerminal | StructureContainer | Creep | Resource, 
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
