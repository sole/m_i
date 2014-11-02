var Instrument = require('./Instrument');
var copyFunctions = require('../copyFunctions');
var generateWhiteNoise = require('openmusic-white-noise');
var SamplePlayer = require('openmusic-sample-player');

function SeaWave(ac) {

	var node = Instrument(ac);
	
	// buffer with white noise
	var noise = generateWhiteNoise(100);
	var buffer = ac.createBuffer(1, noise.length, ac.sampleRate);
	var samplePlayer = SamplePlayer(ac);

	samplePlayer.buffer = buffer;

	this.samplePlayer = samplePlayer;

	copyFunctions(SeaWave.prototype, node);
	
	return node;

}

SeaWave.prototype = Object.create(Instrument.prototype);

SeaWave.prototype.noteOn = function(noteNumber, velocity, when) {
	console.log('SeaWave note on', noteNumber, velocity, when);
	this.samplePlayer.start(when);
};

module.exports = SeaWave;
