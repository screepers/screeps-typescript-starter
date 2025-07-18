Room.prototype.resetQueue = function() {
  this.memory.rq = [];
  this.memory.erq = [];
  this.memory.caq = [];
  this.memory.ris = [];
  this.memory.eris = [];
  this.memory.cis = [];
}

Room.prototype.scanConstructionSite = function() {
  let sites = this.lookForAtArea(LOOK_CONSTRUCTION_SITES, 0, 0, 49, 49, true);
  let newTasks = [];
  for (let result of sites) {
    let id = `|${result.x}|${result.y}`;
    let hasTask = false;
    for (let task of this.memory.cq) {
      if (task.tgt === id) {
        hasTask = true;
        break;
      }
    }
    if (!hasTask) newTasks.push({tgt: id});
  }
  if (newTasks.length > 0) {
    let cx = this.memory.center.x, cy = this.memory.center.y;
    newTasks.sort((a, b) => {
      function dist(a) {
        let pieces = a.tgt.split("|");
        let x = parseInt(pieces[1]);
        let y = parseInt(pieces[2]);
        return Math.pow(x - cx, 2) + Math.pow(y - cy, 2);
      }
      return dist(b) - dist(a);
    });
    this.memory.cq = newTasks.concat(this.memory.cq);
  }
}
