const resourceManager = require ('resourceManager');

assign_container = function ( creep, options){
    let containers = resourceManager.get_source_containers(creep.room)
    
    if (Memory.containers_creep_nr == undefined){
        Memory.containers_creep_nr = {}
        for (let i of containers){
            let temp = i.id
            Memory.containers_creep_nr[temp] = 0;
        } 
    }

    
    for (let i of containers){
        if (Memory.containers_creep_nr[i.id]<1){
            Memory.containers_creep_nr[i.id] = 1
            return i.id
        }else{
            let temp = Memory.containers_creep_nr[i.id];
            if (Memory.containers_creep_nr[i.id])
        }
    }
}
module.exports = {
    assign_container
}