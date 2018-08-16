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
    run : function (energyNeed, toRepair ){
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
        
        
        
        
        
    },
    
    haulers : function (energyNeed,haulers,defCon){
        let i=0;
        for(let creep of haulers){
            creepHauler.run(creep,energyNeed[i])
            i++
        }
    },
    
    builders : function(constSites,builders, defCon){
        
        for(let creep of builders){
            creepBuilder.run(creep,constSites[0])
        }
    },
    
    miners : function(){
        
        for(let creep of miners){
            creepMiner.run(creep)
        }
    },
    
    upgraders : function (defCon){
        for(let creep of upgraders){
            creepUpgrader.run(creep)
        }
    },
    
    repairers : function (defCon){
        for(let creep of repairers){
            creepRepair.run(creep)
        }
    },
    
} 
module.exports = workAssignment;