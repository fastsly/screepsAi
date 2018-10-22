var getCarryCapacity = function () {
  return 300
}

var run = function (creepType, level, room) {
  // TOUGH          10
  // MOVE           50
  // CARRY          50
  // ATTACK         80
  // WORK           100
  // RANGED_ATTACK  150
  // HEAL           250
  // CLAIM          600
  /*
    WORK:
    Harvests 2 energy units from a source per tick.

    Harvests 1 mineral unit from a deposit per tick.

    Builds a structure for 5 energy units per tick.

    Repairs a structure for 100 hits per tick consuming 1 energy unit per tick.

    Dismantles a structure for 50 hits per tick returning 0.25 energy unit per tick.

    Upgrades a controller for 1 energy unit per tick.
        Controller level
    1   Ã¢ÂÂ
    2   5 extensions (50 capacity)   250+300=550
    3   10 extensions (50 capacity)  500+300=800
    4   20 extensions (50 capacity)  1000+300=1300
    5   30 extensions (50 capacity)  1500+300=1800
    6   40 extensions (50 capacity)  2000+300=2300
    7   50 extensions (100 capacity)
    8   60 extensions (200 capacity)
    */
  let spawn = room.find(FIND_MY_SPAWNS)
  let abilities
  let id = Game.time
  switch (creepType) {
    case 'miner':
      if (level <= 1) {
        abilities = [WORK, WORK, MOVE]
      } else
      if (level <= 2) {
        abilities = [WORK, WORK, WORK, WORK, WORK, MOVE]
      } else
      if (level <= 3) {
        abilities = [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE]
      }
      break
    case 'upgrader':
      if (level <= 1) {
        abilities = [WORK, WORK, CARRY, MOVE]
      } else
      if (level <= 2) {
        abilities = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
      } else
      if (level <= 3) {
        abilities = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE]
      }
      break
    case 'repair':
      if (level <= 1) {
        abilities = [WORK, CARRY, MOVE]
      } else
      if (level <= 2) {
        abilities = [WORK, WORK, CARRY, MOVE, MOVE]
      }
      break
    case 'builder':
      if (level <= 1) {
        abilities = [WORK, CARRY, MOVE]
      } else
      if (level <= 2) {
        abilities = [WORK, WORK, CARRY, MOVE, MOVE]
      } else
      if (level <= 3) {
        abilities = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE]
      }
      break
    case 'carry':
      if (level <= 1) {
        abilities = [CARRY, MOVE]
      } else
      if (level <= 2) {
        abilities = [CARRY, CARRY, MOVE]
      } else
      if (level <= 3) {
        abilities = [CARRY, CARRY, MOVE, MOVE]
      } else
      if (level <= 4) {
        abilities = [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE]
      } else
      if (level <= 5) {
        abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
      } else
      if (level <= 6) {
        abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
      } else
      if (level <= 7) {
        abilities = [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE]
      }
      break
    case 'soldier':
      if (level <= 1) {
        abilities = [TOUGH, ATTACK, MOVE]
      } else
      if (level <= 2) {
        abilities = [TOUGH, MOVE, ATTACK, MOVE]
      } else
      if (level <= 3) {
        abilities = [TOUGH, MOVE, ATTACK, ATTACK, ATTACK, MOVE]
      } else
      if (level <= 4) {
        abilities = [TOUGH, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, MOVE]
      } else
      if (level <= 5) {
        abilities = [TOUGH, TOUGH, TOUGH, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE]
      } else
      if (level <= 6) {
        abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE]
      } else
      if (level <= 7) {
        abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE]
      } else
      if (level <= 8) {
        abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE]
      } else
      if (level <= 9) {
        abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE]
      } else
      if (level >= 10) {
        abilities = [TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE]
      }
      break
    case 'shooter':
      if (level <= 5) {
        abilities = [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK, MOVE]
      } else
      if (level <= 6) {
        abilities = [TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE]
      } else
      if (level <= 7) {
        abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE]
      } else
      if (level <= 8) {
        abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE]
      } else
      if (level <= 9) {
        abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE]
      } else
      if (level >= 10) {
        abilities = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE]
      }
      break
    case 'scout':
      abilities = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
      break
    case 'healer':
      abilities = [MOVE, MOVE, MOVE, HEAL, MOVE]
      break
  }
  console.log('Spawn level ' + level + ' ' + creepType + ' in room ' + room.name)
  spawn[0].spawnCreep(abilities, creepType + '-' + id, { memory: { role: creepType, target: null } })
}

module.exports = {
  getCarryCapacity,
  run
}
