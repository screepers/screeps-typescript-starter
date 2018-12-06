export default {
  buildRoads() {
    const trafficArray = _.pairs(Memory.traffic)
    const busiestSpot = _.max(trafficArray, t => t[1])
    const [room, x, y] = busiestSpot[0].split(",")

    console.log("[CONSTRUCT]", STRUCTURE_ROAD, room, x, y)
    const err = Game.rooms[room].createConstructionSite(parseInt(x), parseInt(y), STRUCTURE_ROAD)

    if (err) {
      if (err == -10) {
        console.log("The location is incorrect.");
      } else if (err == -7) {
        console.log("The structure cannot be placed at the specified location.")
      } else {
        console.log(err)
      }
      return
    }

    // Memory.traffic[`${room},${x},${y}`] = 0
  }
}
