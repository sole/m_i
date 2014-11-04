var copyFunctions = require('../copyFunctions');

function Instrument(ac) {

	var node = ac.createGain();
	
	copyFunctions(Instrument.prototype, node);

	return node;
	
}

Instrument.prototype.noteOn = function(when, noteNumber, velocity) {
	console.info('instrument noteON', when, noteNumber, velocity);
};

Instrument.prototype.noteOff = function(when, noteNumber) {
	console.info('instrument noteOFF', when, noteNumber, velocity);
};


module.exports = Instrument;
