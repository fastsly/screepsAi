/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.builder');
 * mod.thing == 'a thing'; // true
 */
const STATE_SPAWNING = 0
const STATE_MOVING = 1
const STATE_GRAB_RESOURCE = 2
const STATE_CONSTRUCT = 3

const utils = require('utils')

var run = function (creep, target, constSites) {
  // console.log('The status at the beggining ' + creep.memory.state)
  try {
    if (!creep.memory.state) {
      creep.memory.state = STATE_SPAWNING
    }
    if (target) {
      if (creep.memory.target == null) {
        creep.memory.target = target.id
      }

      if (Game.getObjectById(creep.memory.target) === null) {
        creep.memory.target = target.id
      }
    } else {
      creep.memory.state = STATE_SPAWNING
    }

    switch (creep.memory.state) {
      case STATE_SPAWNING:
        runSpawning(creep, target, { nextState: STATE_MOVING })
        break
      case STATE_MOVING:
        try {
          runMoving(creep, target, constSites, { context: haulerContext })
        } catch (err) {
          console.log('error in creep builder at runmoving ' + err)
        }
        break
      case STATE_GRAB_RESOURCE:
        runGrabResource(creep, target, constSites, { nextState: STATE_MOVING })
        break
      case STATE_CONSTRUCT:
        runConstruct(creep, target, constSites, { nextState: STATE_MOVING }, constSites)
        break
    }
  } catch (err) {
    console.log('i have an error in creep.buider ' + err)
  }
}
var runSpawning = function (creep, target, options) {
// "until it pops out of the spawn" -> when creep.spawning == false, we transition to the next state.
  if (target || !creep.spawning) {
    creep.memory.state = STATE_MOVING// Set the creeps new state
    run(creep)// Call the main run function so that the next state function runs straight away
    // We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
  }
}

var haulerContext = function (creep, currentState) {
  switch (currentState) {
    case STATE_MOVING:
      if (_.sum(creep.carry) > 0) {
        return { nextState: STATE_CONSTRUCT }
      } else {
        // or perhaps you're very fancy and you have a function that dynamically assigns your haulers...
        return { nextState: STATE_GRAB_RESOURCE }
      }
  }
}
var runMoving = function (creep, target, constSites, options) {
  let pos
  let flag = false
  var transitionState = options.context ? haulerContext(creep, STATE_MOVING).nextState : options.nextState
  // We know that creep.memory.targetPos is set up before this state is called. For haulers, it's set in haulerContext(), for other creep roles it would be set somewhere else...
  // var pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);
  // meybe extract this v
  if (transitionState === STATE_GRAB_RESOURCE) {
    if (creep.memory.grabTarget === null) { // when we  dont have a grabtarget
      let temp_container = utils.assign_container(creep)
      let temp_pickup
      // console.log('tempcontainer is ' + temp_container)
      if (temp_container !== 'pickup') { // when we have containers
        creep.memory.pickup = false
        if (temp_container) { // when theyre not empty
          creep.memory.grabTarget = temp_container
          pos = Game.getObjectById(creep.memory.grabTarget).pos
        } else { // when theyre empty
          pos = Game.flags.Flag1.pos
        }
      } else { // when we dont have containers
        creep.memory.pickup = true
        temp_pickup = creep.room.find(FIND_DROPPED_RESOURCES /* ,{
                    filter:(object)=>{
                        if(object.amount>=creep.carryCapacity) {return object}
                    }} */)
        if (_.isEmpty(temp_pickup) === false) {
          let rand = Math.floor(Math.random() * temp_pickup.length)
          creep.memory.grabTarget = temp_pickup[rand].id
          pos = Game.getObjectById(creep.memory.grabTarget).pos
        } else {
          pos = creep.room.find(FIND_FLAGS, {
            filter: (object) => {
              if (object.name === 'Flag1') { return object }
            } })
        }
      }
    } else { // when we know the grabtarget
      if (Game.getObjectById(creep.memory.grabTarget)) {
        pos = Game.getObjectById(creep.memory.grabTarget).pos
        // console.log(creep.name+' we have memory grabtarget')
      } else {
        creep.memory.grabTarget = null
        // console.log('The status at the end1 ' + creep.memory.state)
        run(creep)
      }
    }
  } else { // when we go for depositing
    if (Game.getObjectById(creep.memory.target) !== null) {
      pos = Game.getObjectById(creep.memory.target).pos
    } else {
      creep.memory.target = null
    }
  }
  // Has the creep arrived?
  if (pos === undefined || pos === null) {
    let temp = creep.room.find(FIND_FLAGS, {
      filter: (object) => {
        if (object.name === 'Flag1') { return object }
      } })
    pos = temp[0]
    flag = true
  }
  if (creep.pos.inRangeTo(pos, 1)) {
    if (!flag) {
      creep.memory.state = transitionState
      // console.log('The status at the end2 ' + creep.memory.state)
      run(creep, target, constSites)
    }
  } else {
    creep.moveTo(pos)
  }
}

var runGrabResource = function (creep, target, constSites, options) {
  if (creep.memory.pickup) {
    if (Game.getObjectById(creep.memory.grabTarget)) {
      creep.pickup(Game.getObjectById(creep.memory.grabTarget))
    } else {
      creep.memory.grabTarget = null
      creep.memory.state = STATE_MOVING
      // console.log('The status at the end3 ' + creep.memory.state)
      run(creep, target, constSites)
    }
  } else {
    creep.withdraw(Game.getObjectById(creep.memory.grabTarget), RESOURCE_ENERGY)
  }
  if (_.sum(creep.carry) === creep.carryCapacity) {
    creep.memory.grabTarget = null
    creep.memory.state = options.nextState
    // console.log('The status at the end4 ' + creep.memory.state)
    run(creep)
  }
}
// TODO: make it so it doesnt just drop
var runConstruct = function (creep, target, constSites, options) {
  // let constSites = creep.room.find(FIND_MY_CONSTRUCTION_SITES)
  let constIds = []
  for (let x of constSites) {
    constIds.push(x.id)
  }
  if (constIds.indexOf(creep.memory.target) > -1) {
    creep.build(Game.getObjectById(creep.memory.target))
  } else {
    creep.memory.target = null
    creep.drop(RESOURCE_ENERGY)
    creep.memory.state = options.nextState
    // console.log('The status at the end5 ' + creep.memory.state)
    run(creep, target, constSites)
  }
  if (!creep.pos.inRangeTo(Game.getObjectById(creep.memory.target).pos, 1)) {
    creep.memory.target = null
    creep.memory.state = options.nextState
    // console.log('The status at the end6 ' + creep.memory.state)
    run(creep, target, constSites)
  }

  if (_.sum(creep.carry) === 0) {
    creep.memory.target = null
    creep.memory.state = options.nextState
    // console.log('The status at the end6 ' + creep.memory.state)
    run(creep, target, constSites)
  }
}
module.exports = {
  run
}
