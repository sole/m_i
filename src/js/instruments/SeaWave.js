var Instrument = require('./Instrument');
var copyFunctions = require('../copyFunctions');
var makeBuffer = require('../makeBuffer');
var ADSR = require('../ADSR');
var generateWhiteNoise = require('openmusic-white-noise');
var SamplePlayer = require('openmusic-sample-player');

function SeaWave(ac) {

	var node = Instrument(ac);
	
	var noiseLength = ac.sampleRate * 3;
	var noiseLeft = generateWhiteNoise(noiseLength);
	var noiseRight = generateWhiteNoise(noiseLength);
	var samplePlayer = SamplePlayer(ac);

	samplePlayer.buffer = makeBuffer({ context: ac, data: [ noiseLeft, noiseRight ], channels: 2 });
	samplePlayer.loop = true;
	samplePlayer.loopStart = 0;
	samplePlayer.loopEnd = 1;
	
	// Extra gain to control the volume of the noise loop;
	// we'll leave the outer gain node alone
	var gain = ac.createGain();
	var gainADSR = new ADSR(ac, gain.gain, 0.5, 0.5, 0.05, 1);

	samplePlayer.connect(gain);

	gain.connect(node);

	node.samplePlayer = samplePlayer;
	node.gainADSR = gainADSR;

	copyFunctions(SeaWave.prototype, node);
	
	return node;

}

SeaWave.prototype = Object.create(Instrument.prototype);

SeaWave.prototype.noteOn = function(noteNumber, velocity, when) {
	console.log('SeaWave note on', noteNumber, velocity, when);
	this.samplePlayer.start(when);
	this.gainADSR.beginAttack(when);
};

SeaWave.prototype.noteOff = function(noteNumber, when) {
	console.log('SeaWave note off', noteNumber, when);
	this.gainADSR.beginRelease(when);
	//this.samplePlayer.stop(when + this.gainADSR.release);
};

module.exports = SeaWave;
