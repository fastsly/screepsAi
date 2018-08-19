const resourceManager = require ('resourceManager');
const creepFactory = require ('creepFactory')

assign_container = function ( creep, options){
    let containers = resourceManager.get_source_containers(creep.room)
    
    if (containers.length<3){
        return "pickup"
    }

    if (Memory.containers_creep_nr == undefined){
        Memory.containers_creep_nr = {}
        for (let i of containers){
            let temp = i.id
            Memory.containers_creep_nr[temp] = 0;
        } 
    }

    bubbleSort(containers);

    for (let i of containers){
        if ( _.sum(i.store) > creepFactory.getCarryCapacity) {
            Memory.containers_creep_nr[i.id] = Memory.containers_creep_nr[i.id]+1;
            return i.id;
        }
    }

    return null
}
 
function bubbleSort(arr){
    var len = arr.length;
    for (var i = len-1; i>=0; i--){
      for(var j = 1; j<=i; j++){
        if(Memory.containers_creep_nr[arr[j-1].id]>Memory.containers_creep_nr[arr[j].id]){
            var temp = arr[j-1];
            arr[j-1] = arr[j];
            arr[j] = temp;
         }
      }
    }
    return arr;
 }

module.exports = {
    assign_container
}