const resources = require ('resources');
const creepFactory = require ('creepFactory')

var assign_container = function ( creep, options){
    try{
        let containers = resources.get_source_containers(creep.room)
        
        if (containers.length<2){
            return "pickup"
        }

        if (Memory[creep.room.name].containers_creep_nr == undefined){
            Memory[creep.room.name].containers_creep_nr = {}
            for (let i of containers){
                let temp = i.id
                Memory[creep.room.name].containers_creep_nr[temp] = 0;
            } 
        }

        bubbleSort(containers,creep);

        for (let i of containers){
            if ( _.sum(i.store) > creepFactory.getCarryCapacity()) {
                Memory[creep.room.name].containers_creep_nr[i.id] = Memory[creep.room.name].containers_creep_nr[i.id]+1;
                return i.id;
            }
        }

        return null
    }catch(err){
        console.log('i have an error in util/ assign container'+err)
    }
}
 
function bubbleSort(arr,creep){
    var len = arr.length;
    for (var i = len-1; i>=0; i--){
      for(var j = 1; j<=i; j++){
        if(Memory[creep.room.name].containers_creep_nr[arr[j-1].id]>Memory[creep.room.name].containers_creep_nr[arr[j].id]){
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