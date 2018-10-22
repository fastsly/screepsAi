const roomControl = require('RoomControl')
const grafana = require('screepspl')

module.exports.loop = function () {
  try {
    grafana.collect_stats()

    for (let name in Memory.creeps) {
      if (!Game.creeps[name]) {
        if (Memory.creeps[name].role === 'miner') { // when miner dies we delete the occupied mining position
          // Memory.source_containers_has_miner[Memory.creeps[name].target] = false
        }
        delete Memory.creeps[name]
        console.log('Clearing non-existing creep memory:', name)
      }
    }

    let controlledRooms = []
    for (let name in Game.rooms) {
      if (Game.rooms[name].controller.my === true) {
        console.log(controlledRooms)
        controlledRooms.push(Game.rooms[name])
      }
    }

    for (let a of controlledRooms) {
      roomControl.run(a)
    }

    Memory.stats.cpu.used = Game.cpu.getUsed()
  } catch (err) {
    console.log('i have an error in main ' + err)
  }
}
