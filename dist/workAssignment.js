/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('workAssignment');
 * mod.thing == 'a thing'; // true
 */
const creepHauler = require('creep.hauler')
const creepBuilder = require('creep.builder')
const creepMiner = require('creep.miner')
const creepRepair = require('creep.repair')
const creepUpgrader = require('creep.upgrader')
const creepClaimer = require('creep.claimer')
const creepFactory = require('creepFactory')
const flag = require('flags')

var run = function (room, energyNeed, toRepair, claim) {
  try {
    var miners = _.filter(room.find(FIND_CREEPS), (creep) => {
      if (creep.my === false) {
        return false
      } else {
        return creep.memory.role === 'miner'
      }
    }
    )
    var haulers = _.filter(room.find(FIND_CREEPS), (creep) => {
      if (creep.my === false) {
        return false
      } else {
        return creep.memory.role === 'carry'
      }
    }
    )
    var builders = _.filter(room.find(FIND_CREEPS), (creep) => {
      if (creep.my === false) {
        return false
      } else {
        return creep.memory.role === 'builder'
      }
    }
    )
    var repairers = _.filter(room.find(FIND_CREEPS), (creep) => {
      if (creep.my === false) {
        return false
      } else {
        return creep.memory.role === 'repair'
      }
    }
    )

    var upgraders = _.filter(room.find(FIND_CREEPS), (creep) => {
      if (creep.my === false) {
        return false
      } else {
        return creep.memory.role === 'upgrader'
      }
    }
    )
    var claimers = _.filter(Game.creeps, (creep) => {
      if (creep.my === false) {
        return false
      } else {
        return creep.memory.role === 'claimer'
      }
    }
    )
    /* to dynamically assign miners nr
            var minerNr
            let sources = room.find(FIND_SOURCES);
            for (let k of sources){
                for(let i = -1; i < 2; i++) {
                    for(let j = -1; j < 2; j++) {
                        var passable=false;
                        let place =room.lookAt((k.pos.x+i),(k.pos.y+j));
                        for (let item of place){
                            for( let key in item ) {
                                if (item[key] == "terrain"){var terrain =true}
                                if (item[key] == "wall"){var wall= true}
                            }
                            if (terrain && wall){ passable= false}
                            else{
                                passable= true

                            }
                        }
                        if (passable){
                            minerNr++
                        }
                    }
                }
            }
    */

    if (claim) {
      if (claimers.length < 1) {
        console.log('were makin clainmers')
        creepFactory.run('claimer', 1, room)
      } else {
        if (claimers.length === 1) {
          if (claimers[0].ticksToLive < 100) {
            creepFactory.run('claimer', 1, room)
          }
        }
      }
      let target = flag.getClaimFlag(room)
      console.log('claimers target is ' + target)
      runClaimers(claimers, target)
    }

    spawn(room, miners, haulers, builders, repairers, upgraders, energyNeed)

    try {
      try {
        runMiners(miners)
      } catch (err) {
        console.log('i have an error at runminers  call in work assignment ' + err)
      }
      try {
        runHaulers(haulers, energyNeed.needEnergy)
      } catch (err) {
        console.log('i have an error at runhaulers  call in work assignment ' + err)
      }

      runBuilders(energyNeed.constructionSite, builders)

      runUpgraders(upgraders)
      runRepairers(repairers, toRepair)
    } catch (err) {
      console.log('ive caught an error at runners in work assignment: ' + err)
    }
  } catch (err) {
    console.log('i have an error in work assignment' + err)
  }

}

function spawn (room, miners, haulers, builders, repairers, upgraders, energyNeed) {
  try {
    let sources = room.find(FIND_SOURCES)
    console.log('Spawn energy in room ' + room.name + ' is ' + room.energyAvailable)
    console.log('Miners: ' + miners.length + ' Haulers: ' + haulers.length + ' Upgraders: ' + upgraders.length + ' Builders: ' + builders.length + ' Repair: ' + repairers.length)
    if (energyNeed.extensionsNr < 5) {
      console.log('we spawn level 1' + energyNeed.extensionsNr)
      if (miners.length < 1) {
        creepFactory.run('miner', 1, room)
      } else
      if (haulers.length < 1 && miners.length > 0) {
        creepFactory.run('carry', 1, room)
      } else
      if (miners.length < 3) {
        creepFactory.run('miner', 1, room)
      } else
      if (haulers.length < 3) {
        creepFactory.run('carry', 1, room)
      } else
      if (upgraders.length < 3) {
        creepFactory.run('upgrader', 1, room)
      } else
      if (energyNeed.constructionSite) {
        if (builders.length < energyNeed.constructionSite.length && builders.length < 4) {
          creepFactory.run('builder', 1, room)
        }
      } else
      if (repairers.length < 1) {
        creepFactory.run('repair', 1, room)
      }
    }
    if (energyNeed.extensionsNr < 100 && (miners.length > 0 && haulers.length > 0)) {
      // console.log('we make lvl 2s')
      if (miners.length < 1) {
        creepFactory.run('miner', 2, room)
      } else
      if (haulers.length < 1) {
        creepFactory.run('carry', 2, room)
      } else
      if (miners.length < sources.length) {
        creepFactory.run('miner', 2, room)
      } else
      if (haulers.length < sources.length + 2) {
        creepFactory.run('carry', 4, room)
      } else
      if (upgraders.length < 3) {
        creepFactory.run('upgrader', 2, room)
      } else
      if (energyNeed.constructionSite) {
        if (builders.length < energyNeed.constructionSite.length && builders.length < 3) {
          creepFactory.run('builder', 2, room)
        }
      } else
      if (repairers.length < 0) {
        creepFactory.run('repair', 1, room)
      }
    } else {
      if (miners.length < 1) {
        creepFactory.run('miner', 1, room)
      } else
      if (haulers.length < 1 && miners.length > 0) {
        creepFactory.run('carry', 1, room)
      } else
      if (miners.length < 3) {
        creepFactory.run('miner', 1, room)
      } else
      if (haulers.length < 3) {
        creepFactory.run('carry', 1, room)
      } else
      if (upgraders.length < 3) {
        creepFactory.run('upgrader', 1, room)
      } else
      if (energyNeed.constructionSite) {
        if (builders.length < energyNeed.constructionSite.length && builders.length < 3) {
          creepFactory.run('builder', 1, room)
        }
      } else
      if (repairers.length < 1) {
        creepFactory.run('repair', 1, room)
      }
    }
  } catch (err) {
    console.log('i have an error at creepfactory call in work assignment ' + err)
  }
}

var runHaulers = function (haulers, energyNeed, defCon) {
  if (haulers.length > 0) {
    let i = 0
    // console.log('builds needing energy are ' + JSON.stringify(energyNeed))
    if (energyNeed.length >= haulers.length) {
      for (let creep of haulers) {
        creepHauler.run(creep, energyNeed[i])
        i++
      }
    } else {
      for (let creep of haulers) {
        creepHauler.run(creep, energyNeed[i])
        i++
        if (i > energyNeed.length - 1) {
          i = 0
        }
      }
    }
  }
}

var runBuilders = function (constSites, builders, defCon) {
  for (let creep of builders) {
    creepBuilder.run(creep, constSites[0], constSites)
  }
}

var runMiners = function (miners) {
  for (let creep of miners) {
    creepMiner.run(creep)
  }
}

var runUpgraders = function (upgraders, defCon) {
  for (let creep of upgraders) {
    creepUpgrader.run(creep)
  }
}

var runRepairers = function (repairers, toRepair, defCon) {
  for (let creep of repairers) {
    creepRepair.run(creep, toRepair.pop())
  }
}

var runClaimers = function (claimers, target) {
  for (let creep of claimers) {
    creepClaimer.run(creep, target)
  }
}
module.exports = {
  run
}
