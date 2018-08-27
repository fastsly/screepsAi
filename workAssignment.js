/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('workAssignment');
 * mod.thing == 'a thing'; // true
 */
const creepHauler = require('creep.hauler');
const creepBuilder = require('creep.builder');
const creepMiner = require('creep.miner');
const creepRepair = require('creep.repair');
const creepUpgrader = require('creep.upgrader');

const workAssignment = {
    run : function (room,energyNeed, toRepair ){
        var miners = _.filter(room.find(FIND_CREEPS), (creep) => {
                if (creep.my == false){
                    return false
                }else{
                    return creep.memory.role == 'miner'
                }
            }
        );
        var haulers = _.filter(room.find(FIND_CREEPS), (creep) => {
                if (creep.my == false){
                    return false
                }else{
                    return creep.memory.role == 'carry'
                }
            }
        );
        var builders = _.filter(room.find(FIND_CREEPS), (creep) => {
                if (creep.my == false){
                    return false
                }else{
                    return creep.memory.role == 'builder'
                }
            }
        );
        var repairers = _.filter(room.find(FIND_CREEPS), (creep) => {
                if (creep.my == false){
                    return false
                }else{
                    return creep.memory.role == 'repair'
                }
            }
        );
        
        var upgraders = _.filter(room.find(FIND_CREEPS), (creep) => {
                if (creep.my == false){
                    return false
                }else{
                    return creep.memory.role == 'upgrader'
                }
            }
        );
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
        let sources = room.find(FIND_SOURCES);
        if (room.energyAvailable<=300 && room.controller.level==1){
            if (miners.length < 1){
                creepFactory.run("miner",1);
            }else
            if (haulers.length < 1){
                creepFactory.run('carry',1);
            }else
            if (miners.length <3){
                creepFactory.run("miner",1);
            }else
            if(haulers.length<3){
                creepFactory.run('carry',1);
            }else
            if(upgraders.length < 3){
                creepFactory.run("upgrader",1);
            }else
            if(energyNeed.constructionSite){
                if(builders.length<energyNeed.constructionSite.length && builders.length<3){
                    creepFactory.run("builder",1);
                }
            }else
            if(repairers.length < 1){
                creepFactory.run("repair",1);
            }
        }else
        if(room.energyAvailable<=550 && room.controller.level==2){
            if (miners.length < 1){
                creepFactory.run("miner",2);
            }else
            if (haulers.length < 1){
                creepFactory.run('carry',2);
            }else
            if (miners.length < sources.length){
                creepFactory.run("miner",2);
            }else
            if(haulers.length < sources.length+1){
                creepFactory.run('carry',2);
            }else
            if(upgraders.length < 3){
                creepFactory.run("upgrader",2);
            }else
            if(energyNeed.constructionSite){
                if(builders.length<energyNeed.constructionSite.length && builders.length<3){
                    creepFactory.run("builder",2);
                }
            }else
            if(repairers.length < 1){
                creepFactory.run("repair",1);
            }
        }

        runHaulers(energyNeed.needEnergy,haulers)
        runBuilders(energyNeed.constructionSite,builders)
        runMiners(miners)
        runUpgraders(upgraders)
        runRepairers(repairers,toRepair)
        
    },
    
    runHaulers : function (energyNeed,haulers,defCon){
        let i=0;
        for(let creep of haulers){
            creepHauler.run(creep,energyNeed[i])
            i++
        }
    },
    
    runBuilders : function(constSites,builders, defCon){
        
        for(let creep of builders){
            creepBuilder.run(creep,constSites[0])
        }
    },
    
    runMiners : function(miners){
        
        for(let creep of miners){
            creepMiner.run(creep)
        }
    },
    
    runUpgraders : function (upgraders,defCon){
        for(let creep of upgraders){
            creepUpgrader.run(creep)
        }
    },
    
    runRepairers : function (repairers,toRepair,defCon){
        for(let creep of repairers){
            creepRepair.run(creep,toRepair.pop())

        }
    },
    
} 
module.exports = workAssignment;