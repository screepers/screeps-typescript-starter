import { Config } from './../../config/config';
import { RoomManager } from './../rooms/roomManager';

export namespace SourceManager {

  export var sources: Source[] = [];
  export var sourceCount: number = 0;

  export function loadSources() {
    sources = RoomManager.getFirstRoom().find<Source>(FIND_SOURCES_ACTIVE);
    sourceCount = _.size(sources);

    if (Config.VERBOSE) {
      console.log(sourceCount + ' sources in room.');
    }
  }

  export function getFirstSource(): Source {
    return sources[0];
  }

}
