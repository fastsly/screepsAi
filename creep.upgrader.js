/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.upgrader');
 * mod.thing == 'a thing'; // true
 */
const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_UPGRADE = 2;
const STATE_GRAB_RESOURCE = 3;

const utils = require("utils")


var    run = function (creep, target){
        if(!creep.memory.state) {
            creep.memory.state = STATE_SPAWNING;
        }
        
        if (creep.memory.target == null){
            creep.memory.target = creep.room.controller.id
        }
        try{
            switch(creep.memory.state) {
            case STATE_SPAWNING:
                runSpawning(creep, {nextState: STATE_MOVING});
                break;
            case STATE_MOVING:
                runMoving(creep, {context: haulerContext});
                break;
            case STATE_GRAB_RESOURCE:
                runGrabResource(creep, {nextState: STATE_MOVING});
                break;
            case STATE_UPGRADE:
            
                    runUpgrade(creep, {nextState: STATE_MOVING});
                
                break;
            }
        }catch (err){
            console.log('error at creep.upgraders '+err)
        }
    }
var    runSpawning = function(creep) {

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
                    return {nextState: STATE_UPGRADE};
                } else {
                    // or perhaps you're very fancy and you have a function that dynamically assigns your haulers...
                    return {nextState: STATE_GRAB_RESOURCE};
                }
                break;
            
            
            
        }
    };
    
var    runMoving = function(creep, options) {

        var transitionState = options.context ? haulerContext(creep, STATE_MOVING).nextState : options.nextState;
        let pos
        // We know that creep.memory.targetPos is set up before this state is called. For haulers, it's set in haulerContext(), for other creep roles it would be set somewhere else...
        //var pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);
        //meybe extract this v
        if(transitionState == STATE_GRAB_RESOURCE){
            console.log("we enter 1")
            /*if (!creep.memory.grabTarget){
                creep.memory.grabTarget = null
                console.log("we enter 2")
            }*/
            if(creep.memory.grabTarget== null){                     //when we  dont have a grabtarget
                let temp_container = creep.pos.findClosestByRange(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER });
                console.log("we enter 3")
                if(temp_container){                     //when we have containers
                    creep.memory.pickup = false;
                        creep.memory.grabTarget=temp_container.id
                        pos = Game.getObjectById(creep.memory.grabTarget).pos
                }else{                                              //when we dont have containers
                    
                    creep.memory.pickup = true;
                    let temp_pickup = creep.room.find(FIND_DROPPED_RESOURCES/*,{
                    filter:(object)=>{
                        if(object.amount>=creep.carryCapacity) {return object}
                    }}*/)
                    let rand = Math.floor(Math.random() * (temp_pickup.length-1));
                    creep.memory.grabTarget=temp_pickup[rand].id;
                    pos = Game.getObjectById(creep.memory.grabTarget).pos
                    console.log("we enter 4 and temp pickup is "+ JSON.stringify(temp_pickup)+" and pos is "+pos)
                }
            }else{                                                  //when we know the grabtarget
                if (Game.getObjectById(creep.memory.target)!= null){
                    pos = Game.getObjectById(creep.memory.target).pos
                    }else{
                    creep.memory.target = null
                    }
            }
        }else{                                                      //when we go for depositing
            if (Game.getObjectById(creep.memory.target)!= null){
                pos = Game.getObjectById(creep.memory.target).pos
            }else{
                creep.memory.target = null
            }
        }
        
        // Has the creep arrived?
        if(creep.pos.inRangeTo (pos,1)) {
            creep.memory.state = transitionState;
            run(creep);
            return;
        }else{
            creep.moveTo(pos)//, {reusePath: 50})
        }
    };

var    runGrabResource = function(creep,options){
        if (creep.memory.pickup){
            if (Game.getObjectById(creep.memory.grabTarget)) {
                creep.pickup(Game.getObjectById(creep.memory.grabTarget))
                if (_.sum(creep.carry) === 0 ) {
        
                    creep.memory.grabTarget = null
                    creep.memory.state = options.nextState
                    run(creep)
                }
                } else {
                    creep.memory.grabTarget= null
                    creep.memory.state = STATE_MOVING
                    run(creep)
                }
        }else{
            creep.withdraw(Game.getObjectById(creep.memory.grabTarget),RESOURCE_ENERGY)
            
        }  
            if(_.sum(creep.carry) == creep.carryCapacity){
                creep.memory.grabTarget= null;
                creep.memory.state = options.nextState;
                run(creep);  
                return;
            }
        
    };

var    runUpgrade = function(creep,options){
        creep.upgradeController(creep.room.controller)
        if (_.sum(creep.carry) == 0){
            creep.memory.target= null;
            creep.memory.state = options.nextState;
            run(creep);  
            return;
        }
    }

module.exports = {
    runMoving,
    run,
    runSpawning,
    haulerContext,
    runUpgrade,
    runGrabResource,
};