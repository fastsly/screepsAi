const structureTower = require('structure.tower')
var run = function (room, defCon) {
  let towers = _.filter(room.find(FIND_MY_STRUCTURES), (structure) => {
    return structure.structureType === STRUCTURE_TOWER
  }
  )
  runTowers(towers, defCon)
}

var runTowers = function (towers, defCon) {
  // console.log('towers is ' + JSON.stringify(towers))
  if (towers.length > 0) {
    for (let tower of towers) {
      structureTower.run(tower, defCon)
    }
  }
}
module.exports = {
  run
}
