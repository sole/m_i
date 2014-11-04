var Instrument = require('./Instrument');
var copyFunctions = require('../copyFunctions');
var makeBuffer = require('../makeBuffer');
var ADSR = require('../ADSR');
var generateBrownNoise = require('openmusic-brown-noise');
var SamplePlayer = require('openmusic-sample-player');

function SeaWave(ac) {

	var node = Instrument(ac);
	
	var noiseLength = ac.sampleRate * 3;
	var noiseLeft = generateBrownNoise(noiseLength);
	var noiseRight = generateBrownNoise(noiseLength);
	var samplePlayer = SamplePlayer(ac);

	samplePlayer.buffer = makeBuffer({ context: ac, data: [ noiseLeft, noiseRight ], channels: 2 });
	samplePlayer.loop = true;
	samplePlayer.loopStart = 0;
	samplePlayer.loopEnd = 1;
	
	// Extra gain to control the volume of the noise loop;
	// we'll leave the outer gain node alone
	var gain = ac.createGain();
	var gainADSR = new ADSR(ac, gain.gain, 1, 10, 0.05, 1);

	samplePlayer.connect(gain);

	gain.connect(node);

	node.samplePlayer = samplePlayer;
	node.gainADSR = gainADSR;

	copyFunctions(SeaWave.prototype, node);
	
	return node;

}

SeaWave.prototype = Object.create(Instrument.prototype);

SeaWave.prototype.noteOn = function(when, noteNumber, velocity) {
	console.log('SeaWave note on', when, noteNumber, velocity);
	this.samplePlayer.start(when);
	this.gainADSR.beginAttack(when);
};

SeaWave.prototype.noteOff = function(when, noteNumber) {
	console.log('SeaWave note off', when, noteNumber);
	this.gainADSR.beginRelease(when);
	//this.samplePlayer.stop(when + this.gainADSR.release);
};

module.exports = SeaWave;
