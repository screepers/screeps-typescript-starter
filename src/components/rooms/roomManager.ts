import { Config } from './../../config/config';

export namespace RoomManager {

  export var rooms: Room[] = null;
  export var roomNames: string[] = [];

  export function loadRooms() {
    this.rooms = Game.rooms;

    _loadRoomNames();

    if (Config.VERBOSE) {
      let count = _.size(this.rooms);
      console.log(count + ' rooms found.');
    }
  }

  export function getFirstRoom(): Room {
    return this.rooms[this.roomNames[0]];
  }

  function _loadRoomNames() {
    for (let roomName in rooms) {
      if (rooms.hasOwnProperty(roomName)) {
        roomNames.push(roomName);
      }
    }
  }

}
