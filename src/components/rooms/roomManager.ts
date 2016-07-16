import * as Config from "./../../config/config";

export let rooms: { [roomName: string]: Room };
export let roomNames: string[] = [];

export function loadRooms() {
  rooms = Game.rooms;

  _loadRoomNames();

  if (Config.VERBOSE) {
    let count = _.size(rooms);
    console.log(count + " rooms found.");
  }
}

export function getFirstRoom(): Room {
  return rooms[roomNames[0]];
}

function _loadRoomNames() {
  for (let roomName in rooms) {
    if (rooms.hasOwnProperty(roomName)) {
      roomNames.push(roomName);
    }
  }
}
