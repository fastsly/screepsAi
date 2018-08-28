const resources = require('resources');
const workAssignment = require('workAssignment');


var run = function (room) {
        try{
            let hostiles = room.find(FIND_CREEPS, {
                filter: (creep) => {
                    if (creep.my == false) {
                        return true
                    } else {
                        return false
                    }
                }
            });



            workAssignment.run(room,energyNeed(room), toRepair(room));
            

            





            //console.log(JSON.stringify(upgraders))
        }catch(err){
            console.log('i have an error in room control'+err)
        }
    }

 var   defCon = function (room) {
        //implement what to do when hostile creep
    }
    var   energyNeed = function (current_room) {//set up prioritisation
        try{
        var constructionSites = current_room.find(FIND_MY_CONSTRUCTION_SITES);
        var buildingsAll = current_room.find(FIND_MY_STRUCTURES);
        
        var buildings = _.filter(buildingsAll, (structure) => {//subtract the current max carry capacity of carriers
                if ((structure.structureType == STRUCTURE_TOWER 
                || structure.structureType == STRUCTURE_SPAWN 
                || structure.structureType == STRUCTURE_EXTENSION 
                || structure.structureType == STRUCTURE_CONTAINER)) {
                    if (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < (structure.storeCapacity - 300)) {
                        for (var kilo of resources.get_source_containers(room)()) {
                            if (kilo == structure.id) {
                                return false
                            } else {
                                return true
                            }
                        }
                    } else
                    if (structure.structureType == STRUCTURE_TOWER 
                        || structure.structureType == STRUCTURE_SPAWN 
                        || structure.structureType == STRUCTURE_EXTENSION ){

                    }
                }

            })
        
        return {
            needEnergy: buildings,
            constructionSite: constructionSites
        }
        }catch(err){
            console.log('its in here in energyNeed: '+ err)
        }
    }

 var   toRepair= function (room) {
        let buildingsNeedRepair = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax

            }
        });
        buildingsNeedRepair.sort((a,b) => b.hits - a.hits);

        return buildingsNeedRepair;

    }


module.exports = {
    toRepair,
    energyNeed,
    run
};
