const STATE_SPAWNING = 0
const STATE_MOVING = 1
const STATE_DEPOSIT_RESOURCE = 2
const STATE_GRAB_RESOURCE = 3
const utils = require('utils')

var run = function (creep, target) {
  if (!creep.memory.state) {
    creep.memory.state = STATE_SPAWNING
  }

  try {
    if (target) {
      if (creep.memory.target == null) {
        creep.memory.target = target.id
      }
    }
  } catch (err) {
    console.log('ive caught an error at target assignment in creep haulers' + err)
  }

  switch (creep.memory.state) {
    case STATE_SPAWNING:
      runSpawning(creep)
      break
    case STATE_MOVING:
      runMoving(creep, target)
      break
    case STATE_GRAB_RESOURCE:
      runGrabResource(creep, { nextState: STATE_MOVING })
      break
    case STATE_DEPOSIT_RESOURCE:
      runDepositResource(creep, { nextState: STATE_MOVING })
      break
  }
}

var runSpawning = function (creep) {
  // until it pops out of the spawn (creep.spawning === false), transition to moving and act the same tick
  if (!creep.spawning) {
    creep.memory.state = STATE_MOVING
    run(creep)
  }
}

var haulerContext = function (creep, currentState) {
  switch (currentState) {
    case STATE_MOVING:
      if (_.sum(creep.carry) > 0) {
        return { nextState: STATE_DEPOSIT_RESOURCE }
      } else {
        return { nextState: STATE_GRAB_RESOURCE }
      }
  }
}

var getFlagPosition = function (room, flagName) {
  const flag = room.find(FIND_FLAGS).find(f => f.name === flagName)
  return flag ? flag.pos : undefined
}

var runMoving = function (creep, target) {
  var transitionState = haulerContext(creep, STATE_MOVING).nextState
  let flag = false

  try {
    var pos
    if (target) {
      if (transitionState === STATE_GRAB_RESOURCE) {
        if (creep.memory.grabTarget == null) { // when we dont have a grabtarget
          let tempContainer = utils.assign_container(creep)
          let tempPickup
          if (tempContainer !== 'pickup') { // when we have containers
            creep.memory.pickup = false
            if (tempContainer) { // when theyre not empty
              creep.memory.grabTarget = tempContainer
              pos = Game.getObjectById(creep.memory.grabTarget).pos
            }
            // when containers are empty, pos stays unset - the fallback below sends the creep to Flag1
          } else { // when we dont have containers
            creep.memory.pickup = true
            tempPickup = creep.room.find(FIND_DROPPED_RESOURCES)
            if (_.isEmpty(tempPickup) === false) {
              let rand = Math.floor(Math.random() * tempPickup.length)
              creep.memory.grabTarget = tempPickup[rand].id
              pos = Game.getObjectById(creep.memory.grabTarget).pos
            }
            // when there are no dropped resources either, pos stays unset - fallback sends the creep to Flag1
          }
        } else { // when we know the grabtarget
          if (Game.getObjectById(creep.memory.grabTarget)) {
            pos = Game.getObjectById(creep.memory.grabTarget).pos
          } else {
            creep.memory.grabTarget = null
            run(creep)
          }
        }
      } else { // when we go for depositing
        pos = Game.getObjectById(creep.memory.target).pos
      }
    }
  } catch (e) {
    console.log('in creep.haulers for ' + creep.name + ' move the rror is: ' + e.message)
  }

  try {
    // Has the creep arrived?
    if (pos === undefined || pos === null) {
      pos = getFlagPosition(creep.room, 'Flag1')
      flag = true
    }

    if (target || pos) {
      if (creep.pos.inRangeTo(pos, 1)) {
        if (!flag) {
          creep.memory.state = transitionState
          run(creep)
        }
        return
      } else {
        creep.moveTo(pos, { visualizePathStyle: {
          fill: 'transparent',
          stroke: '#fff',
          lineStyle: 'dashed',
          strokeWidth: 0.15,
          opacity: 0.1
        } })
      }
    }
  } catch (e) {
    console.log('in creep.haulers for ' + creep.name + ' move the error is: ' + e.message)
  }
}

var runGrabResource = function (creep, options) {
  if (creep.memory.pickup) {
    creep.pickup(Game.getObjectById(creep.memory.grabTarget))
  } else {
    creep.withdraw(Game.getObjectById(creep.memory.grabTarget), RESOURCE_ENERGY)
  }

  if (_.sum(creep.carry) === creep.carryCapacity) {
    if (!creep.memory.pickup) {
      utils.removeTargetContainer(creep, creep.memory.grabTarget)
    }
    creep.memory.grabTarget = null
    creep.memory.state = options.nextState
    run(creep)
  }
}

var runDepositResource = function (creep, options) {
  let target = Game.getObjectById(creep.memory.target)
  if (!target) {
    creep.memory.target = null
    creep.memory.state = options.nextState
    return
  }

  if (target.structureType === STRUCTURE_CONTAINER) {
    if (_.sum(target.store) === target.storeCapacity) {
      creep.memory.target = null
      creep.memory.state = options.nextState
      return
    } else {
      creep.transfer(target, RESOURCE_ENERGY)
    }
  } else if (target.structureType === STRUCTURE_TOWER || target.structureType === STRUCTURE_SPAWN || target.structureType === STRUCTURE_EXTENSION) {
    if (target.energy === target.energyCapacity) {
      creep.memory.target = null
      creep.memory.state = options.nextState
      return
    } else {
      creep.transfer(target, RESOURCE_ENERGY)
    }
  } else if (target.structureType === STRUCTURE_STORAGE) {
    creep.transfer(target, RESOURCE_ENERGY)
  }

  if (_.sum(creep.carry) === 0) {
    creep.memory.target = null
    creep.memory.state = options.nextState
    run(creep)
  }
}

module.exports = {
  runMoving,
  run,
  runSpawning,
  haulerContext,
  runDepositResource,
  runGrabResource
}
