var roleTowers = {
  run: function (tower, defCon) {
    // console.log(tower[0].id);
      var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => (structure.hits < Memory.HPcap) && (structure.hits < structure.hitsMax)
      })
      var allStructMax =tower.room.find(FIND_STRUCTURES, {
        // filter: (structure) => structure.hits < structure.hitsMax
        filter: (structure) =>  structure.hits < structure.hitsMax
      })
      // console.log(allStructMax.length+'and '+closestDamagedStructure.length);
      /* if (Memory.HPcap ){
                if(closestDamagedStructure.length == 0 && allStructMax.length > 0){
                    Memory.HPcap = Memory.HPcap+3000;
                }
                //console.log('we have hpcap')
            }else{
                //console.log('we dont yet have hpcap')
                Memory.HPcap = 3000;
            } */
      // console.log('the hp cap is: '+Memory.HPcap)
      let closestHostile = k.pos.findClosestByRange(FIND_HOSTILE_CREEPS)
      if (closestDamagedStructure && closestHostile == null) {
        k.repair(closestDamagedStructure)
      } else {
        if (Memory.HPcap) {
          if (allStructMax.length > 0) {
            if (Memory.HPcap<30000) {
              Memory.HPcap = Memory.HPcap+3000;
            }
          }
          // console.log('we have hpcap')
        } else {
          // console.log('we dont yet have hpcap')
          Memory.HPcap = 3000
        }
      }
      if (closestHostile) {
        k.attack(closestHostile)
      }
    }
  }
}

module.exports = roleTowers
