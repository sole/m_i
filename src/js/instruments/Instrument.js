var copyFunctions = require('../copyFunctions');

function Instrument(ac) {

	var node = ac.createGain();
	
	copyFunctions(Instrument.prototype, node);

	return node;
	
}

Instrument.prototype.noteOn = function(noteNumber, velocity, when) {
	console.info('instrument noteON', noteNumber, velocity, when);
};

Instrument.prototype.noteOff = function(noteNumber, when) {
	console.info('instrument noteOFF', noteNumber, velocity, when);
};


module.exports = Instrument;
