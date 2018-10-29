const resources = require('resources')
const workAssignment = require('workAssignment')
// const armyGeneral = require('armyGeneral')

var run = function (room) {
  try {
    let hostiles = room.find(FIND_CREEPS, {
      filter: (creep) => {
        if (creep.my === false) {
          return true
        } else {
          return false
        }
      }
    })

    console.log('Source containers are ' + resources.count_source_containers(room))
    if (!Memory[room.name]) { Memory[room.name] = { } }
    workAssignment.run(room, energyNeed(room), toRepair(room))
    // armyGeneral.run(room, defCon())
    // console.log(JSON.stringify(upgraders))
  } catch (err) {
    console.log('i have an error in room control' + err)
  }
}

var defCon = function (room) {
  // implement what to do when hostile creep
  return 3
}
var energyNeed = function (current_room) { // set up prioritisation
  try {
    var constructionSites = current_room.find(FIND_MY_CONSTRUCTION_SITES)
    var buildingsAll = current_room.find(FIND_MY_STRUCTURES)
    var buildings = _.filter(buildingsAll, (structure) => { // subtract the current max carry capacity of carriers
      if ((structure.structureType === STRUCTURE_TOWER ||
        structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_EXTENSION) &&
        structure.energy !== structure.energyCapacity) {
        return true
      } else {
        if (structure.structureType === STRUCTURE_CONTAINER && _.sum(structure.store) !== structure.storeCapacity) {
          let found = false
          for (var kilo of resources.get_source_containers(current_room)) {
            if (kilo === structure.id) {
              // console.log("containers var at energy need func is "+structure.id+ ' and source is '+kilo)
              found = true
            }
          }
          if (!found) {
            return true
          }
        }
      }
    })
    // console.log("buildings var at energy need func is "+buildings)
    return {
      needEnergy: buildings,
      constructionSite: constructionSites
    }
  } catch (err) {
    console.log('its in here in energyNeed: ' + err)
  }
}

var toRepair = function (room) {
  let buildingsNeedRepair = room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return structure.hits < structure.hitsMax
    }
  })

  buildingsNeedRepair.sort((a, b) => b.hits - a.hits)

  return buildingsNeedRepair
}

module.exports = {
  toRepair,
  energyNeed,
  run
}
