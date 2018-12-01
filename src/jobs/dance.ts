export default {
  name: 'dance',
  validate: function (creep: Creep) {
    creep.memory.job = 'dance'
    return true;
  },
  perform: function (creep: Creep) {
    creep.say("dance")
    const directions = [TOP, TOP_RIGHT, RIGHT, BOTTOM_RIGHT, BOTTOM, BOTTOM_LEFT, LEFT, TOP_LEFT]
    const direction = directions[_.random(directions.length - 1)]
    creep.move(direction)
    creep.memory.job = null
  }
}
