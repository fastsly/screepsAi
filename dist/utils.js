const resources = require('resources')
const creepFactory = require('creepFactory')

var assign_container = function (creep, options) {
  try {
    try {
      var containers = resources.get_source_containers(creep.room)
    } catch (err) {
      console.log('i have error here 1 ' + err)
    }
    // console.log("source containers"+containers)
    if (containers) {
      if (containers.length < 1) {
        return 'pickup'
      }
    } else {
      return 'pickup'
    }

    try {
      if (!Memory[creep.room.name]) { Memory[creep.room.name] = { } }

      if (_.isEmpty(Memory[creep.room.name].containers_creep_nr)) {
        // console.log("we enter 1.a")
        Memory[creep.room.name].containers_creep_nr = {}
        for (let i of containers) {
          let temp = i
          // console.log("we enter 1.b"+i)
          Memory[creep.room.name].containers_creep_nr[temp] = 0
        }
      }

      if (_.isEmpty(Memory[creep.room.name].containers_creep_nr) || _.size(Memory[creep.room.name].containers_creep_nr) < containers.length) {
        for (let i of containers) {
          let temp = i
          // console.log("we enter 1"+i)
          Memory[creep.room.name].containers_creep_nr[temp] = 0
        }
      }
    } catch (err) {
      console.log('i have error here 2')
    }

    let tempArr = bubbleSort(containers, creep)
    containers = tempArr
    try {
      if (containers.length > 1) {
        for (let i of containers) {
          if (_.sum(Game.getObjectById(i).store) > creep.carryCapacity) {
            // console.log('we found a container i ' + JSON.stringify(i))
            Memory[creep.room.name].containers_creep_nr[i] = Memory[creep.room.name].containers_creep_nr[i] + 1
            return i
          }
        }
      } else {
        return containers[0]
      }
    } catch (err) {
      console.log('i have error here 3')
    }

    return null
  } catch (err) {
    console.log('i have an error in util assign container ' + err)
  }
}
function removeTargetContainer (creep, targetId) {
  Memory[creep.room.name].containers_creep_nr.targetId = Memory[creep.room.name].containers_creep_nr.targetId - 1
}

function bubbleSort (arr, creep) {
  try {
    var len = arr.length
    for (var i = 0; i < len; i++) {
      // Notice that j < (length - i)
      for (var j = 0; j < (len - i - 1); j++) {
        if (Memory[creep.room.name].containers_creep_nr[arr[j]] > Memory[creep.room.name].containers_creep_nr[arr[j + 1]]) {
          var temp = arr[j]
          arr[j] = arr[j + 1]
          arr[j + 1] = temp
        }
      }
    }
    return arr
  } catch (err) {
    console.log('i have an error in util bubble sort ' + err)
  }
}

module.exports = {
  assign_container
}
