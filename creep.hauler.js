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
      runSpawning(creep, { nextState: STATE_MOVING })
      break
    case STATE_MOVING:
      runMoving(creep, target, { context: haulerContext })
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
  // "until it pops out of the spawn" -> when creep.spawning == false, we transition to the next state.
  if (!creep.spawning) {
    creep.memory.state = STATE_MOVING// Set the creeps new state
    run(creep)// Call the main run function so that the next state function runs straight away
    // We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
  }
}

var haulerContext = function (creep, currentState) {
  switch (currentState) {
    case STATE_MOVING:
      if (_.sum(creep.carry) > 0) {
        return { nextState: STATE_DEPOSIT_RESOURCE }
      } else {
        // or perhaps you're very fancy and you have a function that dynamically assigns your haulers...
        return { nextState: STATE_GRAB_RESOURCE }
      } 
  }
}

var runMoving = function (creep, target, options) {
  var transitionState = options.context ? haulerContext(creep, STATE_MOVING).nextState : options.nextState
  // We know that creep.memory.targetPos is set up before this state is called. For haulers, it's set in haulerContext(), for other creep roles it would be set somewhere else...
  // var pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);
  // meybe extract this v
  try {
    var pos
    if (target) {
      if (transitionState === STATE_GRAB_RESOURCE) {
        if (creep.memory.grabTarget == null) { // when we  dont have a grabtarget
          let temp_container = utils.assign_container(creep)
          let temp_pickup
          // console.log (creep.name+'enters grabtarget null')
          if (temp_container !== 'pickup') { // when we have containers
            creep.memory.pickup = false
            if (temp_container) { // when theyre not empty
              creep.memory.grabTarget = temp_container
              pos = Game.getObjectById(creep.memory.grabTarget).pos
            } else { // when theyre empty
              pos = creep.room.find(FIND_FLAGS, {
                filter: (object) => {
                  if (object.name === 'Flag1') { return object }
                } }
              )
            }
          } else { // when we dont have containers
            creep.memory.pickup = true
            temp_pickup = creep.room.find(FIND_DROPPED_RESOURCES 
              /*, {
            filter:(object)=>{
                                if(object.amount>=creep.carryCapacity) {return object}
                            }} */)
            if (_.isEmpty(temp_pickup) === false) {
              let rand = Math.floor(Math.random() * temp_pickup.length)
              creep.memory.grabTarget = temp_pickup[rand].id
              pos = Game.getObjectById(creep.memory.grabTarget).pos
              // console.log(creep.name+' we have dropped resources')
            } else {
              pos = creep.room.find(FIND_FLAGS, {
                filter: (object) => {
                  if (object.name === 'Flag1') { return object }
                } }

              )
              // console.log(creep.name+' we go to flag')
            }
            // console.log(creep.name+' entered we dont have containers')
          }
        } else { // when we know the grabtarget
          if (Game.getObjectById(creep.memory.grabTarget)) {
            pos = Game.getObjectById(creep.memory.grabTarget).pos
            // console.log(creep.name+' we have memory grabtarget')
          } else {
            creep.memory.grabTarget = null
            run(creep)
          }
        }
      } else { // when we go for depositing
        pos = Game.getObjectById(creep.memory.target).pos
        // console.log(creep.name+' we go deposit')
      }
    } else {

    }
  } catch (e) {
    console.log('in creep.haulers for ' + creep.name + ' move the rror is: ' + e.message)
  }
  // console.log(creep.name+' we go to '+JSON.stringify(pos))
  try {
    // Has the creep arrived?

    if (target) {
      if (creep.pos.inRangeTo(pos, 1)) {
        creep.memory.state = transitionState
        // run(creep);
        return
      } else {
        creep.moveTo(pos, { visualizePathStyle: {
          fill: 'transparent',
          stroke: '#fff',
          lineStyle: 'dashed',
          strokeWidth: 0.15,
          opacity: 0.1
        } })//, {reusePath: 50})
        // creep.move(RIGHT)
        // console.log(JSON.stringify(creep, null, 2))
        // creep.withdraw(Game.getObjectById(creep.memory.grabTarget),RESOURCE_ENERGY)
      }
    } else {

    }
  } catch (e) {
    console.log('in creep.haulers for ' + creep.name + ' move the error is: ' + e.message)
  }
}

var runGrabResource = function (creep, options) {
  if (creep.memory.pickup) {
    creep.pickup(Game.getObjectById(creep.memory.grabTarget))
    if (_.sum(creep.carry) < creep.carryCapacity) {
      creep.memory.grabTarget = null
      creep.memory.state = options.nextState
      run(creep)
      return
    }
  } else {
    creep.withdraw(Game.getObjectById(creep.memory.grabTarget), RESOURCE_ENERGY)       
  }
  if (_.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.grabTarget= null
    creep.memory.state = options.nextState
    run(creep)
  }
}

var runDepositResource = function (creep, options) {
  let target = Game.getObjectById(creep.memory.target)
  if (target.structureType === STRUCTURE_CONTAINER) {
    if (_.sum(target.store) === target.storeCapacity) {
      creep.memory.target = null
      creep.memory.state = options.nextState
      return
    } else {
      creep.transfer(target, RESOURCE_ENERGY)
    }
  } else {
    if (target.structureType === STRUCTURE_TOWER || target.structureType === STRUCTURE_SPAWN || target.structureType === STRUCTURE_EXTENSION) {
      if (target.energy === target.energyCapacity) {
        creep.memory.target= null
        creep.memory.state = options.nextState
        return
      } else {
        creep.transfer(target, RESOURCE_ENERGY)
      }
    }
  }
  if (_.sum(creep.carry) === 0) {
    // util.remove_target_container(creep.memory.target)
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
