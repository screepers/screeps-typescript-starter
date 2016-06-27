import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace SourceManager {

  export var sources: Source[];
  export var sourceCount: number = 0;

  export function loadSources() {
    this.sources = RoomManager.getFirstRoom().find(FIND_SOURCES_ACTIVE);
    this.sourceCount = _.size(this.sources);

    if (Config.VERBOSE) {
      console.log(this.sourceCount + ' sources in room.');
    }
  }

  export function getFirstSource(): Source {
    return this.sources[0];
  }

}
