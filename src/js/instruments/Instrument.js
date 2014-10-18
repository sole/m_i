var copyFunctions = require('../copyFunctions');

function Instrument(ac) {

	var node = ac.createGain();
	
	copyFunctions(Instrument.prototype, node);

	return node;
	
}

Instrument.prototype.noteOn = function(noteNumber, velocity, when) {
	console.log('instrument noteON', noteNumber, velocity, when);
};



module.exports = Instrument;
