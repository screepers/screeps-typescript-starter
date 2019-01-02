// add various commands to the console for empire management
export class ConsoleCommands {

  /**
   * remove all construction sites from the room when called
   */
  public static removeConstructionSites(roomName: string, leaveProgressStarted = true, structureType?: string): void {
  
        Game.rooms[roomName].find(FIND_MY_CONSTRUCTION_SITES).forEach( (site: ConstructionSite) => {
            if (!structureType || site.structureType === structureType) {
                site.remove();
            }
        })
    }
    
    /**
     * remove all flags from the empire when called
     */
    public static removeFlags(substr: string): void {
    
        _.forEach(Game.flags, (flag) => {
            if (_.includes(flag.name, substr) ) {
                console.log(`removing flag ${flag.name} in ${flag.pos.roomName}`);
                flag.remove();
            }
        });
    }
    
    /**
     * display status of specified room or all rooms if room specified
     */
    public static displayRoomStatus(room?: Room){
        
        // if no room was specified, display status for all
        if(!room){
            _.forEach(Game.rooms, (room) => {
                console.log(`Room: ${room.name} -----------`);
                console.log(`State: ${room.memory.roomState}`);
                console.log(`Storage: ${_.sum(room.storage.store[RESOURCE_ENERGY])}`);
                console.log('----------------------------');
            });
        }
        else{ 
            console.log(`Room: ${room.name} -----------`);
            console.log(`State: ${room.memory.roomState}`);
            console.log(`Storage: ${_.sum(room.storage.store[RESOURCE_ENERGY])}`);
            console.log('----------------------------');
        }
    }
  
    /**
     * kill all creeps
    */
    public static killAllCreeps(room?: Room): void{
      
        // if no room specified, kill all creeps
        if(!room){
              _.forEach(Game.creeps, (creep) => {
                  creep.suicide();
              });
        }
        else{ 
            _.forEach(Game.creeps, (creep) => {
                if(creep.room.name === room.name){
                    creep.suicide();
                }
            });
        }
    }
  
    /**
     * send energy from one room to another
     */
      public static sendResource(sendingRoom: Room, receivingRoom: Room, resourceType: ResourceConstant, amount: number): void{
          // check if terminal exists in the sending room 
        
          // check if we have enough energy to send the resource
        
          // send the resources
      }
}   
