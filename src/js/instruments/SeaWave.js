var Instrument = require('./Instrument');
var copyFunctions = require('../copyFunctions');
var generateWhiteNoise = require('../generateWhiteNoise');

function SeaWave(ac) {

	var node = Instrument(ac);
	
	// buffer with white noise (TODO: other noise colours-pick from jsconf project-make functions)
	var noise = generateWhiteNoise(10);
	console.log(noise);
	// "Immortal" buffer

	copyFunctions(SeaWave.prototype, node);
	
	return node;

}

SeaWave.prototype = Object.create(Instrument.prototype);

SeaWave.prototype.noteOn = function(noteNumber, velocity, when) {
	console.log('SeaWave note on', noteNumber, velocity, when);
};

module.exports = SeaWave;
