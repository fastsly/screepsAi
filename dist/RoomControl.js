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
    var buildingsAll = current_room.find(FIND_STRUCTURES)
    var buildings = _.filter(buildingsAll, (structure) => { // subtract the current max carry capacity of carriers
      if ((structure.structureType === STRUCTURE_TOWER ||
        structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_EXTENSION) &&
        structure.energy !== structure.energyCapacity) {
        return true
      } else {
        if (structure.structureType === STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity) { // think of delay to container fillup so they dont try to fill in  50 energy but w8 until 300, 500
          let found = false
          // console.log('containers var at energy need func is ' + structure.id + ' and source is ' + kilo)
          for (var kilo of resources.get_source_containers(current_room)) {
            // console.log('containers var at energy need func is ' + structure.id + ' and source is ' + kilo)
            if (kilo === structure.id) {
              found = true
            }
          }
          if (!found) {
            return true
          }
        }
      }
    })
    var extensions = _.filter(buildings, (structure) => {
      if (structure.structureType === STRUCTURE_EXTENSION) {
        return true
      }
    })
    // console.log('buildings var at energy need func is ' + buildings)
    return {
      needEnergy: buildings,
      constructionSite: constructionSites,
      extensionsNr: extensions.length
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
