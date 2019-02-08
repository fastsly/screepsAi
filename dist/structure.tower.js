const resources = require('resources')
var run = function (tower, defCon) {
  try {
  // console.log(tower[0].id);
    var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure) => (structure.hits < Memory[tower.room.name].HPcap) && (structure.hits < structure.hitsMax)
    })
    var allStructMax = tower.room.find(FIND_STRUCTURES, {
    // filter: (structure) => structure.hits < structure.hitsMax
      filter: (structure) => structure.hits < structure.hitsMax
    })
    let full = 0
    Scontainers = resources.get_source_containers(tower.room)
    for (let i of Scontainers) {
      if (_.sum(Game.getObjectById(i).store) > 1900) {
        full++
      }
    }
    console.log('in towers' + full + ' and ' + Scontainers.length)
    if (!Memory[tower.room.name].HPcap) {
      Memory[tower.room.name].HPcap = 5000
    } else if (!closestDamagedStructure && tower.room.energyAvailable === tower.room.energyCapacityAvailable) {
      if (full === Scontainers.length) {
        Memory[tower.room.name].HPcap = Memory[tower.room.name].HPcap + 5000
      }
    }
    // console.log(allStructMax.length+'and '+closestDamagedStructure.length);
    // console.log('the hp cap is: '+Memory.HPcap)
    let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    // console.log('the tower is ' + JSON.stringify(tower) + ' closest hostile is ' + JSON.stringify(closestHostile) + ' closest dam struct ' + JSON.stringify(closestDamagedStructure))
    if (closestDamagedStructure && closestHostile == null) {
      tower.repair(closestDamagedStructure)
    } /* else {
      if (Memory.HPcap) {
        if (allStructMax.length > 0) {
          if (Memory.HPcap < 30000) {
            Memory.HPcap = Memory.HPcap + 3000
          }
        }
      // console.log('we have hpcap')
      } else {
      // console.log('we dont yet have hpcap')
        Memory.HPcap = 3000
      }
    } */
    if (closestHostile) {
      tower.attack(closestHostile)
    }
  } catch (err) {
    console.log('I have error in structure.tower: ' + err)
  }
}
module.exports = {
  run
}
