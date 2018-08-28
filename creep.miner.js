/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.miner');
 * mod.thing == 'a thing'; // true
 */
const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_MINE = 2;


const utils = require("utils")


var    run = function (creep, ){
        if(!creep.memory.state) {
            creep.memory.state = STATE_SPAWNING;
        }
        
        
        
        switch(creep.memory.state) {
        case STATE_SPAWNING:
            runSpawning(creep, {nextState: STATE_MOVING});
            break;
        case STATE_MOVING:
            runMoving(creep, {context: haulerContext});
            break;
        case STATE_MINE:
            runMine(creep, {nextState: STATE_MOVING});
            break;
        }
    }
var    runSpawning = function(creep) {
        if (!Memory[creep.room.name].source_containers_has_miner){ //we initialize the miner switches for source controller 
            let targets = resourceManager.get_source_containers(creep.room)
            Memory[creep.room.name].source_containers_has_miner = {}
            for (let i of targets){
                let temp = i.id
                Memory[creep.room.name].source_containers_has_miner[temp] = false;
            } 
        }

        if (creep.memory.target == null){ //we assign miner to a container
            let targets = resourceManager.get_source_containers(creep.room)
            targets.filter( function(container) { //only containers that dont have a miner
                if (Memory[creep.room.name].source_containers_has_miner[container.id] == false){
                    return true
                }
                else{
                    return false
                }
            })

            if (targets.length>0){ //if there is a free container assign it to creep and set switch for container
                creep.memory.target = targets[0].id
                Memory[creep.room.name].source_containers_has_miner[targets[0].id]= true
            }
        }
    // "until it pops out of the spawn" -> when creep.spawning == false, we transition to the next state.
        if(!creep.spawning) {
            creep.memory.state = STATE_MOVING;	// Set the creeps new state
            run(creep);	// Call the main run function so that the next state function runs straight away
            return;		// We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
        }
    }
    
var    haulerContext = function(creep, currentState) {
        switch(currentState) {
            case STATE_MOVING:
                if(_.sum(creep.carry) > 0) {
                    return {nextState: STATE_DEPOSIT_RESOURCE};
                } else {
                    // or perhaps you're very fancy and you have a function that dynamically assigns your haulers...
                    return {nextState: STATE_GRAB_RESOURCE};
                }
                break;
            
            
            
        }
    };
    
var    runMoving = function(creep, options) {

        //var transitionState = options.context ? haulerContext(creep, STATE_MOVING).nextState : options.nextState;
        
        // from other code may be usefull if implement renew
        //if(transitionState == STATE_GRAB_RESOURCE){
        //    if(creep.memory.grabTarget== null){                     //when we  dont have a grabtarget
        //        let temp_container = utils.assign_container(creep)
        //        if(temp_container != "pickup"){                     //when we have containers
        //            creep.memeory.pickup = false;
        //            if (temp_container){                            //when theyre not empty
        //                creep.memory.grabTarget=temp_container
        //                var pos = Game.getObjectById(creep.memory.grabTarget).pos
        //            }else{                                          //when theyre empty
        //                var pos = Game.flags.Flag1.pos
        //            }
        //        }else{                                              //when we dont have containers
        //            creep.memory.pickup = true;
        //            temp_pickup = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY,{
        //            filter:(object)=>{
        //                if(object.amount>=creep.carryCapacity) {return object}
        //            }})
        //            creep.memory.grabTarget=temp_pickup.id;
        //            var pos = Game.getObjectById(creep.memory.grabTarget).pos
        //        }
        //    }else{                                                  //when we know the grabtarget
        //        var pos = Game.getObjectById(creep.memory.grabTarget).pos
        //    }
        //}else{                                                      //when we go for depositing
        //    var pos = Game.getObjectById(creep.memory.target).pos
        //}

        var pos = Game.getObjectById(creep.memory.target).pos
        // Has the creep arrived?
        if(creep.pos == pos) {
            creep.memory.state = transitionState;
            run(creep);
            return;
        }else{
            creep.moveTo(pos, {reusePath: 50})
        }
    };

var    runMine = function (creep,options){
        let target= creep.memory.target.pos.findClosestByRange(FIND_SOURCES);
        creep.harvest(target)
    }
    
module.exports = {
    run,
};