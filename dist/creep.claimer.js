/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.miner');
 * mod.thing == 'a thing'; // true
 */
const STATE_SPAWNING = 0
const STATE_MOVING = 1
const STATE_CLAIM = 2

var run = function (creep, target) {
  if (!creep.memory.state) {
    creep.memory.state = STATE_SPAWNING
  }

  if (target) {
    if (creep.memory.target == null) {
      creep.memory.target = target
    }
  }

  try {
    switch (creep.memory.state) {
      case STATE_SPAWNING:
        runSpawning(creep, { nextState: STATE_MOVING })
        break
      case STATE_MOVING:
        runMoving(creep, { nextState: STATE_CLAIM })
        break
      case STATE_CLAIM:
        runClaim(creep, { nextState: STATE_MOVING })
        break
    }
  } catch (err) {
    console.log('error in creep.Claimers switch ' + err)
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

var runMoving = function (creep, options, target) {
  let pos
  let path
  if (creep.memory.target) {
    pos = creep.memory.target
  }

  if (pos === undefined || pos === null) {
    /* let temp = creep.room.find(FIND_FLAGS, {
      filter: (object) => {
        if (object.name === 'Flag1') { return object }
      } })
    pos = temp[0]
    flag = true */
  }
  console.log('position is ' + JSON.stringify(pos))
  if (creep.pos.inRangeTo(pos, 1)) {
    // run(creep)
  } else {
    try {
      path = creep.pos.findPathTo(pos)
    } catch (err) {
      console.log('FFFFFFFFUCK ' + err)
    }
    let result = creep.moveByPath(path)
    console.log(`Result of creep.moveTo(new RoomPosition(23, 48, 'E49N34')): ${result}`)
  }
}

var runClaim = function (creep, options) {
  let target
  target = creep.room.controller

  creep.claimController(target)
}

module.exports = {
  run
}
