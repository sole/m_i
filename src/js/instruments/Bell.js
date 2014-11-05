var Instrument = require('./Instrument');
var copyFunctions = require('../copyFunctions');
var ADSR = require('../ADSR');
var Oscillator = require('openmusic-oscillator');
var MIDIUtils = require('midiutils');

function Bell(ac) {
	var node = Instrument(ac);
	copyFunctions(Bell.prototype, node);

	var gain = ac.createGain();
	var gainADSR = new ADSR(ac, gain.gain, 0.2, 0.1, 0.1, 0.5);

	gain.connect(node);

	var oscillator = Oscillator(ac);
	oscillator.type = 'triangle';
	oscillator.connect(gain);


	node.oscillator = oscillator;
	node.gainADSR = gainADSR;
	
	return node;
}

Bell.prototype = Object.create(Instrument.prototype);

Bell.prototype.noteOn = function(when, noteNumber, velocity) {
	console.log('Bell note on', when, noteNumber, velocity);

	var frequency = MIDIUtils.noteNumberToFrequency(noteNumber);
	console.log(frequency);
	
	this.oscillator.frequency.setValueAtTime(frequency, when);
	this.oscillator.start(when);
	this.gainADSR.beginAttack(when);
};

Bell.prototype.noteOff = function(when, noteNumber) {
	console.log('Bell note off', when, noteNumber);
	this.gainADSR.beginRelease(when);
	//this.samplePlayer.stop(when + this.gainADSR.release);
};

module.exports = Bell;



