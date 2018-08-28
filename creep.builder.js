/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('creep.builder');
 * mod.thing == 'a thing'; // true
 */
const STATE_SPAWNING = 0;
const STATE_MOVING = 1;
const STATE_GRAB_RESOURCE = 2;
const STATE_CONSTRUCT= 3;

const utils = require("utils")

var run = function (creep, target){
    try{
        if(!creep.memory.state) {
            creep.memory.state = STATE_SPAWNING;
        }
        
        if (creep.memory.target == null){
            creep.memory.target = target.id
        }
        
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
        case STATE_CONSTRUCT:
        
                runConstruct(creep, {nextState: STATE_MOVING});
            
            break;
        }
    }catch(err){
        console.log('i have an error in creep.buider'+err)
    }
}
var runSpawning = function(creep) {

// "until it pops out of the spawn" -> when creep.spawning == false, we transition to the next state.
    if(!creep.spawning) {
        creep.memory.state = STATE_MOVING;	// Set the creeps new state
        run(creep);	// Call the main run function so that the next state function runs straight away
        return;		// We put return here because once we transition to a different state, we don't want any of the following code in this function to run...
    }
}

var haulerContext = function(creep, currentState) {
    switch(currentState) {
        case STATE_MOVING:
            if(_.sum(creep.carry) > 0) {
                return {nextState: STATE_CONSTRUCT};
            } else {
                // or perhaps you're very fancy and you have a function that dynamically assigns your haulers...
                return {nextState: STATE_GRAB_RESOURCE};
            }        
    }
};
var runMoving = function(creep, options) {

    var transitionState = options.context ? haulerContext(creep, STATE_MOVING).nextState : options.nextState;
    
    // We know that creep.memory.targetPos is set up before this state is called. For haulers, it's set in haulerContext(), for other creep roles it would be set somewhere else...
    //var pos = new RoomPosition(creep.memory.targetPos.x, creep.memory.targetPos.y, creep.memory.targetPos.roomName);
    //meybe extract this v
    if(transitionState == STATE_GRAB_RESOURCE){
        if(creep.memory.grabTarget== null){                     //when we  dont have a grabtarget
            let temp_container = utils.assign_container(creep)
            if(temp_container != "pickup"){                     //when we have containers
                creep.memeory.pickup = false;
                if (temp_container){                            //when theyre not empty
                    creep.memory.grabTarget=temp_container
                    var pos = Game.getObjectById(creep.memory.grabTarget).pos
                }else{                                          //when theyre empty
                    var pos = Game.flags.Flag1.pos
                }
            }else{                                              //when we dont have containers
                creep.memory.pickup = true;
                temp_pickup = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY,{
                filter:(object)=>{
                    if(object.amount>=creep.carryCapacity) {return object}
                }})
                creep.memory.grabTarget=temp_pickup.id;
                var pos = Game.getObjectById(creep.memory.grabTarget).pos
            }
        }else{                                                  //when we know the grabtarget
            var pos = Game.getObjectById(creep.memory.grabTarget).pos
        }
    }else{                                                      //when we go for depositing
        var pos = Game.getObjectById(creep.memory.target).pos
    }
    // Has the creep arrived?
    if(creep.pos == pos) {
        creep.memory.state = transitionState;
        run(creep);
        return;
    }else{
        creep.moveTo(pos, {reusePath: 50})
    }
};

var runGrabResource = function(creep,options){
    if (creep.memory.pickup){
        creep.pickup(Game.getObjectById(creep.memory.grabTarget))
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

var runConstruct = function(creep,options){
    creep.build(Game.getObjectById(creep.memory.target));
    if (_.sum(creep.carry) == 0){
        creep.memory.target= null;
        creep.memory.state = options.nextState;
        run(creep);  
        return;
    }
}
module.exports = {
    run,
};