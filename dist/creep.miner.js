/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.miner');
 * mod.thing == 'a thing'; // true
 */
const resources = require('resources')
const STATE_SPAWNING = 0
const STATE_MOVING = 1
const STATE_MINE = 2

const utils = require('utils')
// var    run = function (creep, ){}

var run = function (creep) {
  if (!creep.memory.state) {
    creep.memory.state = STATE_SPAWNING
  }
  if (creep.ticksToLive < 4) {
    Memory[creep.room.name].source_containers_has_miner[creep.memory.target] = false
  }
  try {
    switch (creep.memory.state) {
      case STATE_SPAWNING:
        runSpawning(creep, { nextState: STATE_MOVING })
        break
      case STATE_MOVING:
        runMoving(creep, { nextState: STATE_MINE })
        break
      case STATE_MINE:
        runMine(creep, { nextState: STATE_MOVING })
        break
    }
  } catch (err) {
    console.log('error in creep.miners switch ' + err)
  }
}
var runSpawning = function (creep) {
// "until it pops out of the spawn" -> when creep.spawning == false, we transition to the next state.
  if (!creep.spawning) {
    creep.memory.state = STATE_MOVING// Set the creeps new state
    run(creep)// Call the main run function so that the next state function runs straight away
    // We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
  }
}

var runMoving = function (creep, options) {
  // TODO: rethink where to fuckin put this and also rework the hascontainer thing
  // try{
  let pos
  if (creep.memory.target == null) {
    // we initialize the miner switches for source controller
    console.log('memory at miners ' + JSON.stringify(Memory[creep.room.name]))

    if (!Memory[creep.room.name]) {
      Memory[creep.room.name] = {}
    }

    if (!Memory[creep.room.name].source_containers_has_miner) {
      Memory[creep.room.name].source_containers_has_miner = {}
    }

    if (_.isEmpty(Memory[creep.room.name].source_containers_has_miner)) {
      let targets = resources.get_source_containers(creep.room)
      if (targets) {
        console.log('ive found my targets ' + targets)
        for (let i of targets) {
          let temp = i
          Memory[creep.room.name].source_containers_has_miner[temp] = false
        }
      }
    }

    if (!creep.memory.target) {
      creep.memory.target = null
    }

    if (creep.memory.target == null) { // we assign miner to a container
      let targets = resources.get_source_containers(creep.room)
      let filteredTargets
      // console.log('in miners targets is '+targets)
      if (targets.length > 0) {
        if (targets !== undefined) { // if there is a free container assign it to creep and set switch for container
          console.log('Ladies and gentleman we have containers')
          if (targets.length > 1) {
            filteredTargets = targets.filter(function (container) { // only containers that dont have a miner
              if (Memory[creep.room.name].source_containers_has_miner[container] === false) {
                return true
              } else {
                return false
              }
            })
            console.log('in miners targets is ' + filteredTargets)
            creep.memory.containers = true
            creep.memory.target = filteredTargets[0]
            Memory[creep.room.name].source_containers_has_miner[filteredTargets[0]] = true
            console.log('i actuallly do this but i dont switch memory register to true')
          } else {
            console.log('we finally got here and ' + targets + ' and ' + Memory[creep.room.name].source_containers_has_miner[targets])
            if (Memory[creep.room.name].source_containers_has_miner[targets] === false) {
              console.log('we finally got here')
              creep.memory.containers = true
              creep.memory.target = targets
              Memory[creep.room.name].source_containers_has_miner[targets] = true
            }
            let temp = creep.room.find(FIND_FLAGS, {
              filter: (object) => {
                if (object.name === 'Flag1') { return object }
              } }
            )
            pos = temp[0].pos
          }
        }
      } else {
        console.log('i actuallly do this')
        creep.memory.containers = false
        creep.memory.target = creep.pos.findClosestByRange(FIND_SOURCES).id
      }
    }

    // runSpawning (creep);
  } else {
    pos = Game.getObjectById(creep.memory.target).pos
  }
  // }
  // catch(err){
  //    console.log("ive caught an error in miners runspawn "+err)
  // }
  // Has the creep arrived?
  if (creep.memory.containers) {
    if (creep.pos.inRangeTo(pos, 0)) {
      creep.memory.state = options.nextState
      run(creep)
    } else {
      creep.moveTo(pos, { reusePath: 50 })
    }
  } else {
    if (creep.pos.inRangeTo(pos, 1)) {
      creep.memory.state = options.nextState
      run(creep)
    } else {
      creep.moveTo(pos, { reusePath: 50 })
    }
  }
}

var runMine = function (creep, options) {
  let target
  if (creep.memory.containers === true) {
    target = Game.getObjectById(creep.memory.target).pos.findClosestByRange(FIND_SOURCES)
  } else {
    target = Game.getObjectById(creep.memory.target)
  }

  creep.harvest(target)
}

module.exports = {
  run
}
