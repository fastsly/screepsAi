const roomControl = require('RoomControl');
const grafana = require ('screepspl');

module.exports.loop = function () {
    grafana.collect_stats();
    for(let name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }
    let controlledRooms =[];
    for(let name in Game.rooms) {
    	if(Game.rooms[name].controller.my ==true){
    		controlledRooms.push(Game.rooms[name]);
    	}
    }
    for(let a of controlledRooms){
        roomControl.run(a);
    }
Memory.stats.cpu.used = Game.cpu.getUsed()
}
