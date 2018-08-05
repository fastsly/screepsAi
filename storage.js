/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('storage');
 * mod.thing == 'a thing'; // true
 */
global.erstelleAufwerter = function(energie, home, spawn) {
        var anzahlTeile = Math.floor(energie / 200);
        var anzug = [];
        for (let i = 0; i < anzahlTeile; i++) {
            anzug.push(WORK);
        }
        for (let i = 0; i < anzahlTeile; i++) {
            anzug.push(CARRY);
        }
        for (let i = 0; i < anzahlTeile; i++) {
            anzug.push(MOVE);
        }
        return Game.spawns[spawn].createCreep(anzug, undefined, { rolle: 'aufwerter', voll: false , home:home, spawn: spawn});
}
module.exports = {

};