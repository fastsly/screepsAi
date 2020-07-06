const structureTower = require('structure.tower')
//const Rcontrol = require('RoomControl')
var run = function (room, defCon) {
  let towers = _.filter(room.find(FIND_MY_STRUCTURES), (structure) => {
    return structure.structureType === STRUCTURE_TOWER
  }
  )
  runTowers(room,towers, defCon)
}

var runTowers = function (room,towers, defCon) {
  //console.log('towers is '+towers.length + JSON.stringify(towers))
  
  if (towers.length > 0) {
    let allDamaged = room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.hits < structure.hitsMax && structure.structureType !=STRUCTURE_WALL && structure.structureType !=STRUCTURE_RAMPART
      }
    })
    for (let tower of towers) {     
      if (allDamaged.length>0){
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
          filter: (structure) => (structure.hits < Memory[room.name].HPcap) && (structure.hits < structure.hitsMax)
        })
        exists = _.remove(allDamaged, (structure)=> structure.id === closestDamagedStructure.id)
        if (exists.length>0){
          //console.log('armyGeneral alldamaged '+JSON.stringify(allDamaged) +' and '+JSON.stringify(closestDamagedStructure))
          allDamaged = _.remove(allDamaged, (structure)=> structure.id != closestDamagedStructure.id)
          //console.log('armyGeneral alldamaged '+JSON.stringify(allDamaged))
          structureTower.run(tower, defCon,closestDamagedStructure)
        }else{
          structureTower.run(tower, defCon,allDamaged.pop())
        }
      }else{
        structureTower.run(tower, defCon,0)
      }
    }
  }
}
module.exports = {
  run
}
