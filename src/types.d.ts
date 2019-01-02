                        | ROOM_STATE_NUKE_INBOUND;
// constants -----
// room state constants
type RoomStateConstant = ROOM_STATE_INTRO
                       | ROOM_STATE_BEGINNER
                       | ROOM_STATE_INTER
                       | ROOM_STATE_ADVANCED
                       | ROOM_STATE_UPGRADER
                       | ROOM_STATE_SIEGE
                       | ROOM_STATE_STIMULI
                       | ROOM_STATE_NUKE_INBOUND;

type ROOM_STATE_INTRO = 0;        // right when a room is starting and nothing is built/no creeps exist
type ROOM_STATE_BEGINNER = 1;     // once some creeps have been established but no containers/storage exist
type ROOM_STATE_INTER = 2;        // once container mining is in place but we do not have a storage
type ROOM_STATE_ADVANCED = 3;     // once storage economy is in place but we aren't power upgrading
type ROOM_STATE_UPGRADER = 4;     // once we have power upgrader based economy
type ROOM_STATE_SIEGE = 5;        // if we are under seige and must defend the room/only do basic functions
type ROOM_STATE_STIMULI = 6;      // if the room has been flagged and is receiving heavy external assistance to upgrade quickly
type ROOM_STATE_NUKE_INBOUND = 7; // if a nuke is inbound to the room and we have to prepare for the strike x ticks before (low priority but good to keep in mind)


// role constants
type RoleConstant = ROLE_MINER
                  | ROLE_HARVESTER
                  | ROLE_WORKER
                  | ROLE_POWER_UPGRADER
                  | ROLE_LORRY
                  | ROLE_REMOTE_MINER
                  | ROLE_REMOTE_HARVESTER
                  | ROLE_REMOTE_RESERVER
                  | ROLE_REMOTE_BUILDER
                  | ROLE_REMOTE_DEFENDER
                  | ROLE_COLONIZER
                  | ROLE_ZEALOT
                  | ROLE_STALKER
                  | ROLE_HEALER;

type ROLE_MINER = 0;
type ROLE_HARVESTER = 1;
type ROLE_WORKER = 2;
type ROLE_POWER_UPGRADER = 3;
type ROLE_LORRY = 4;
type ROLE_REMOTE_MINER = 5;
type ROLE_REMOTE_HARVESTER = 6;
type ROLE_REMOTE_RESERVER = 7;
type ROLE_REMOTE_BUILDER = 8;
type ROLE_REMOTE_DEFENDER = 9;
type ROLE_COLONIZER = 10;
type ROLE_ZEALOT = 11;
type ROLE_STALKER = 12;
type ROLE_HEALER = 13;
// ---------------

// global map function with string key
interface StringMap {
  [key: string]: any;
}
//----------------------------------------


// custom memory objects ------------
// main memory modules --------------
interface CreepMemory {
  role: RoleConstant;                           // the creep's role
  homeRoom: string;                             // the home room for the creep
  targetRoom: string;                           // the room where operations are performed
  workTarget: any;                              // the creep's target at the moment (storage, construction site, etc)
  options: CreepOptionsCiv | CreepOptionsMili;  // the creep's options given to it at birth (can be adjusted thorugh lifetime)
                                                // we will either employ a working boolean to tell if its idle and get its next state
                                                // or we can employ a state machine to always keep track... we will decide
}

interface RoomMemory {
  roomState: RoomStateConstant;
  structures: StringMap;      // all structures in the room
  sources: Source[];          // all sources in the room
  upgradeLink: StructureLink; // the link the power upgrader pulls from
  creeps: Creep[];            // all creeps assigned to this room
  creepLimit: StringMap;       // the limit of each role for the room
  hostiles: Creep[];          // all hostile creeps in this room
  attackRooms: Room[];        // all rooms flagged to attack
  remoteRooms: Room[];        // all rooms flagged to remote harvest
  claimRooms: Room[];         // all rooms flagged to colonize
}

interface EmpireMemory {

}
// ----------------------------------


// options for civilian creeps
interface CreepOptionsCiv {
  build: boolean;               // if the creep can build construction sites
  upgrade: boolean;             // if the creep can upgrade the controller
  repair: boolean;              // if the creep can repair containers/roads, etc
  wallRepair: boolean;          // if the creep can repair walls and ramparts
  fillTower: boolean;           // if the creep can fill towers
  fillStorage: boolean;         // if the creep can fill storage
  fillContainer: boolean;       // if the creep can fill containers
  fillLink: boolean;            // if the creep can fill links
  fillTerminal: boolean;        // if the creep can fill the terminal
  fillLab: boolean;             // if the creep can fill a lab
  getFromStorage: boolean;      // if the creep can pull from storage
  getFromContainer: boolean;    // if the creep can pull from a container
  getDroppedEnergy: boolean;    // if the creep can seek out dropped energy
  getFromLink: boolean;         // if the creep can pull from a link
  getFromTerminal: boolean;     // if the creep can pull from the terminal
}

// options for military creeps
interface CreepOptionsMili {
  squadSize: number | null;            // the number of other creeps in this creep's squad
  squadUUID: number | null;            // the generated token that ties members of this squad together
  rallyLocation: RoomPosition | null;  // the area the squad is going to meet
  seige: boolean;                      // if the creep is meant to seige the room to attrition (tower drain, etc)
  dismantler: boolean;                 // if the creep is meant to dismantle walls and structures
  healer: boolean;                     // if the creep is meant to heal other creeps/itself
  attacker: boolean;                   // if the creep is meant to seek out enemy creeps
  defender: boolean;                   // if the creep is meant to defend a room from invaders
  flee: boolean;                       // if the creep values it's life and flees at low health
}


