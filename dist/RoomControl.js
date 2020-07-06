const resources = require('resources')
const workAssignment = require('workAssignment')
const armyGeneral = require('armyGeneral')

var run = function (room) {
  try {
    let cpu = Game.cpu.getUsed();
    // let hostiles = room.find(FIND_CREEPS, {
    //   filter: (creep) => {
    //     if (creep.my === false) {
    //       return true
    //     } else {
    //       return false
    //     }
    //   }
    // })
    let claim = false
    if (Memory[room.name].claim) {
      claim = true
    }
    console.log('Source containers are ' + resources.count_source_containers(room))
    if (!Memory[room.name]) { Memory[room.name] = { } }
    if (!Memory.stats.cpu.workAssignment){Memory.stats.cpu.workAssignment = {}}
    if (!Memory.stats.cpu.armyGeneral){Memory.stats.cpu.armyGeneral = {}}
    handleSourceContainerSwitches(room, resources.get_source_containers(room))
    workAssignment.run(room, energyNeed(room), toRepair(room), claim)
    Memory.stats.cpu.workAssignment[room.name]=Game.cpu.getUsed()-cpu
    armyGeneral.run(room, defCon())
    Memory.stats.cpu.armyGeneral[room.name]=Game.cpu.getUsed()-Memory.stats.cpu.workAssignment[room.name]
    // console.log(JSON.stringify(upgraders))
   // Memory.stats.cpu[room.name]=Game.cpu.getUsed()-cpu
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
        structure.energy < structure.energyCapacity-100) {
        return true
      } else {
        if (structure.structureType === STRUCTURE_CONTAINER && _.sum(structure.store) < structure.storeCapacity-200 ) { // think of delay to container fillup so they dont try to fill in  50 energy but w8 until 300, 500
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
    var extensions = _.filter(buildingsAll, (structure) => {
      if (structure.structureType === STRUCTURE_EXTENSION) {
        return true
      }
    })
    let temp = _.sortBy(buildings, [function (o) {
      if (o.energy) {
        return o.energy
      } else {
        return o.store.energy
      }
    }])
    buildings = temp
    // console.log('exten sions var at energy need func is ' + JSON.stringify(buildings))
    return {
      needEnergy: buildings,
      constructionSite: constructionSites,
      extensionsNr: extensions.length
    }
  } catch (err) {
    // console.log('its in here in energyNeed: ' + err)
  }
}

var handleSourceContainerSwitches = function (room, targets) {
  if (!Memory[room.name]) {
    Memory[room.name] = {}
  }

  if (!Memory[room.name].source_containers_has_miner) {
    Memory[room.name].source_containers_has_miner = {}
  }

  if (_.isEmpty(Memory[room.name].source_containers_has_miner)) {
    if (targets) {
      // console.log('ive found my targets ' + targets)
      for (let i of targets) {
        Memory[room.name].source_containers_has_miner[i] = false
      }
    }
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
