export function VisualBuilding(roomName: string, buildings: {[name: string] : string[]}){
  let visual = new RoomVisual(roomName);
  let roadArr = [];
  let i = 0;
  for(let roadPos in buildings['road']){
    let str = roadPos.split('/')
    roadArr[i++] = {x : parseInt(str[0]),y : parseInt(str[1])}
  }
  for(let pos of roadArr){
    for(let pos_ of roadArr){
      if(pos == pos_){
        continue;
      }
      if(Math.abs(pos.x - pos_.x) <= 1 && Math.abs(pos.y - pos_.y) <= 1){
        visual.line(pos.x, pos.y, pos_.x, pos_.y, { color: 'grey', opacity: 1 ,width : 0.2})
      }
    }
  }
  for(let type in buildings){
    if(type == 'rampart')continue;
    for(const str of buildings[type]){
      let pos = str.split('/');
      let x = parseInt(pos[0]);
      let y = parseInt(pos[1]);
      switch (type) {
        case 'spawn':
          visual.circle(x, y, { fill: 'white', radius: 0.65, opacity: 0.6 })
          visual.circle(x, y, { fill: 'black', radius: 0.55, opacity: 0.8 })
          visual.circle(x, y, { fill: 'yellow', radius: 0.35, opacity: 0.8 })
          break;
        case 'extension':
          visual.circle(x, y, { fill: 'green', radius: 0.4, opacity: 0.7 })
          visual.circle(x, y, { fill: 'black', radius: 0.35, opacity: 0.7 })
          visual.circle(x, y, { fill: 'yellow', radius: 0.3, opacity: 0.7 })
          break;
        case 'link':
          visual.poly([[x, y - 0.45], [x - 0.35, y], [x, y + 0.45], [x + 0.35, y], [x, y - 0.45], [x - 0.35, y]]
            , { stroke: 'green', opacity: 0.8, strokeWidth: 0.07 })
          visual.poly([[x, y - 0.3], [x - 0.25, y], [x, y + 0.3], [x + 0.25, y], [x, y - 0.3], [x - 0.25, y]]
            , { stroke: 'black', opacity: 0.8, strokeWidth: 0.07, fill: 'grey' })
          break;
        case 'road':
          visual.circle(x, y, { fill: 'grey', radius: 0.1, opacity: 1 })
          break;
        case 'constructedWall':
          visual.circle(x, y, { fill: 'black', radius: 0.5, opacity: 0.6 })
          break;
        case 'storage':
          visual.rect(x - 0.5, y - 0.7, 1, 1.4, { stroke: 'green', fill: 'black', opacity: 0.8 })
          visual.rect(x - 0.4, y - 0.5, 0.8, 0.5, { fill: 'grey', opacity: 0.8 })
          visual.rect(x - 0.4, y, 0.8, 0.5, { fill: 'yellow', opacity: 0.8 })
          break;
        case 'observer':
          visual.circle(x, y, { fill: 'green', radius: 0.5, opacity: 0.8 })
          visual.circle(x, y, { fill: 'black', radius: 0.45, opacity: 1 })
          visual.circle(x + 0.2, y, { fill: 'green', radius: 0.25, opacity: 0.8 })
          break;
        case 'powerSpawn':
          visual.circle(x, y, { fill: 'white', radius: 0.8, opacity: 0.6 })
          visual.circle(x, y, { fill: 'red', radius: 0.75, opacity: 0.8 })
          visual.circle(x, y, { fill: 'black', radius: 0.65, opacity: 0.8 })
          visual.circle(x, y, { fill: 'red', radius: 0.4, opacity: 0.8 })
          break;
        case 'extractor':
          visual.circle(x, y, { stroke: 'green', strokeWidth: 0.2, radius: 0.74, lineStyle: 'dashed' })
          break;
        case 'terminal':
          visual.poly([[x, y - 0.85], [x - 0.5, y - 0.5], [x - 0.85, y], [x - 0.5, y + 0.5], [x, y + 0.85], [x + 0.5, y + 0.5], [x + 0.85, y], [x + 0.5, y - 0.5], [x, y - 0.85], [x - 0.5, y - 0.5]]
            , { stroke: 'green', opacity: 1, strokeWidth: 0.07 })
          visual.poly([[x, y - 0.75], [x - 0.45, y - 0.45], [x - 0.75, y], [x - 0.45, y + 0.45], [x, y + 0.75], [x + 0.45, y + 0.45], [x + 0.75, y], [x + 0.45, y - 0.45], [x, y - 0.75], [x - 0.45, y - 0.45]]
            , { fill: 'grey', stroke: 'black', opacity: 1, strokeWidth: 0.07 })
          visual.rect(x - 0.4, y - 0.4, 0.8, 0.8, { stroke: 'black', strokeWidth: 0.1, fill: 'yellow', opacity: 0.8 })
          break;
        case 'lab':
          visual.circle(x, y, { fill: 'green', radius: 0.5, opacity: 0.8 })
          visual.rect(x - 0.4, y + 0.2, 0.8, 0.3, { fill: 'green', opacity: 0.8 })
          visual.circle(x, y, { fill: 'black', radius: 0.45, opacity: 0.8 })
          visual.circle(x, y, { fill: 'white', radius: 0.35, opacity: 0.8 })
          visual.rect(x - 0.35, y + 0.25, 0.7, 0.2, { fill: 'black', opacity: 0.8 })
          visual.rect(x - 0.2, y + 0.3, 0.4, 0.1, { fill: 'yellow', opacity: 0.8 })
          break;
        case 'container':
          visual.rect(x - 0.25, y - 0.3, 0.5, 0.6, { stroke: 'black', strokeWidth: 0.1, fill: 'yellow', opacity: 0.8 })
          break;
        case 'nuker':
          visual.poly([[x, y - 1.5], [x - 0.7, y], [x - 0.7, y + 0.7], [x + 0.7, y + 0.7], [x + 0.7, y], [x, y - 1.5], [x - 0.7, y]]
            , { stroke: 'green', opacity: 0.8, strokeWidth: 0.2 })
          visual.poly([[x, y - 1.3], [x - 0.6, y], [x - 0.6, y + 0.6], [x + 0.6, y + 0.6], [x + 0.6, y], [x, y - 1.3], [x - 0.6, y], [x + 0.6, y]]
            , { stroke: 'black', opacity: 0.8, strokeWidth: 0.2, fill: 'grey' })
          break;
        case 'factory':
          visual.circle(x, y, { fill: 'black', radius: 0.6, opacity: 1 })
          visual.line(x - 0.2, y - 0.8, x - 0.2, y + 0.8, { color: 'black', opacity: 0.8 })

          visual.line(x + 0.2, y - 0.8, x + 0.2, y + 0.8, { color: 'black', opacity: 0.8 })
          visual.line(x - 0.8, y - 0.2, x + 0.8, y - 0.2, { color: 'black', opacity: 0.8 })
          visual.line(x - 0.8, y + 0.2, x + 0.8, y + 0.2, { color: 'black', opacity: 0.8 })
          break;
        case 'tower':
          visual.circle(x, y, { stroke: 'green', radius: 0.6, opacity: 0.8 })
          visual.circle(x, y, { fill: 'black', radius: 0.55, opacity: 0.9 })
          visual.rect(x - 0.35, y - 0.25, 0.7, 0.5, { fill: 'grey', opacity: 0.8 })
          visual.rect(x - 0.25, y - 0.85, 0.5, 0.6, { fill: 'black', opacity: 0.8 })
          visual.rect(x - 0.2, y - 0.8, 0.4, 0.5, { fill: 'grey', opacity: 0.8 })
          break;
      }
    }
  }
  for(let str in buildings['rampart']){
    let pos = str.split('/');
    visual.rect(parseInt(pos[0]) - 0.5, parseInt(pos[1]) - 0.5, 1, 1, { stroke: 'green', fill: 'green', opacity: 0.3 })
  }
  for(let type in buildings){
    for(let str of buildings[type]){
      let level = "1";
      let pos = str.split('/');
      let x = parseInt(pos[0]);
      let y = parseInt(pos[1]);
      visual.text(level,x + 0.4,type == 'rampart' ? y + 0.2 : y + 0.5,{
        font : 0.3
      })
    }
  }
}
