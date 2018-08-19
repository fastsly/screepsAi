const resourceManager = require('resourceManager');
const workAssignment = require('workAssignment');

var RoomControl = {
    run: function (room) {

        let hostiles = room.find(FIND_CREEPS, {
            filter: (creep) => {
                if (creep.my == false) {
                    return true
                } else {
                    return false
                }
            }
        });



        workAssignment.run(energyNeed(room), toRepair(room));








        //console.log(JSON.stringify(upgraders))
    },

    defCon: function (room) {
        //implement what to do when hostile creep
    },
    energyNeed: function (room) {//set up prioritisation
        let constructionSites = room.find(FIND_MY_CONSTRUCTION_SITES);
        let buildingsNeedEnergy = room.find(FIND_STRUCTURES, {
            filter: (structure) => {//subtract the current max carry capacity of carriers
                if ((structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_CONTAINER) && (structure.store[RESOURCE_ENERGY] < (structure.storeCapacity - 300))) {
                    if (structure.structureType == STRUCTURE_CONTAINER) {
                        for (let k of resource.get_source_containers(room)()) {
                            if (k == structure.id) {
                                return false
                            } else {
                                return true
                            }
                        }
                    } else {
                        return true
                    }
                }

            }
        });

        return {
            needEneergy: buildingsNeedEnergy,
            constructionSite: constructionSites
        }

    },

    toRepair: function (room) {
        let buildingsNeedRepair = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return structure.hits < structure.hitsMax

            }
        });

        return buildingsNeedRepair;

    }
};

module.exports = RoomControl;
