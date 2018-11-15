var run = function () {
  let controlledRooms = []
  for (let name in Game.rooms) {
    if (Game.rooms[name].controller.my === true) {
      // console.log(controlledRooms)
      controlledRooms.push(Game.rooms[name])
    }
  }

  for (let i in Game.flags) {
    if (Game.flags[i].color === COLOR_PURPLE) {
      for (let a of controlledRooms) {
        // console.log('First is ' + Game.flags[i].name + ' second is ' + a.name + ' and third is ' + JSON.stringify(Game.flags[i]))
        try {
          if (Game.flags[i].name === a.name) {
            Memory[a.name].claim = Game.flags[i].pos.roomName
          }
        } catch (err) {
          console.log('I have error in flags ' + err)
        }
      }
    }
    console.log(Game.flags[i].name)
  }
  //TODO: cleanup code
}

var getClaimFlag = function (room){
    for (let i in Game.flags) {
        if (Game.flags[i].color === COLOR_PURPLE && room.name === Game.flags[i].name) {
            return Game.flags[i]
        }
    }
}

module.exports = {
  run,
  getClaimFlag
}
