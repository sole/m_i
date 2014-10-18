var Instrument = require('./Instrument');
var copyFunctions = require('../copyFunctions');

function SeaWave(ac) {

	var node = Instrument(ac);

	copyFunctions(SeaWave.prototype, node);
	
	return node;

}

SeaWave.prototype = Object.create(Instrument.prototype);

SeaWave.prototype.noteOn = function(noteNumber, velocity, when) {
	console.log('SeaWave note on', noteNumber, velocity, when);
};

module.exports = SeaWave;
