const resources = require('resources')
var run = function (tower, defCon,closestDamagedStructure ) {
  try {
  // console.log(tower[0].id);
    
    let full = 0
    Scontainers = resources.get_source_containers(tower.room)
    for (let i of Scontainers) {
      if (_.sum(Game.getObjectById(i).store) > 1900) {
        full++
      }
    }
    //console.log('in towers' + full + ' and ' + Scontainers.length)
    
    // console.log(allStructMax.length+'and '+closestDamagedStructure.length);
    // console.log('the hp cap is: '+Memory.HPcap)
    let closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
    // console.log('the tower is ' + JSON.stringify(tower) + ' closest hostile is ' + JSON.stringify(closestHostile) + ' closest dam struct ' + JSON.stringify(closestDamagedStructure))
    if (closestDamagedStructure && closestHostile === null && tower.store[RESOURCE_ENERGY] > 500) {
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
