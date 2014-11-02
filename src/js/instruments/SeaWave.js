var Instrument = require('./Instrument');
var copyFunctions = require('../copyFunctions');
var makeBuffer = require('./makeBuffer');
var generateWhiteNoise = require('openmusic-white-noise');
var SamplePlayer = require('openmusic-sample-player');

function SeaWave(ac) {

	var node = Instrument(ac);
	
	var noiseLeft = generateWhiteNoise(ac.sampleRate);
	var noiseRight = generateWhiteNoise(ac.sampleRate);
	var samplePlayer = SamplePlayer(ac);

	samplePlayer.buffer = makeBuffer({ context: ac, data: [ noiseLeft, noiseRight ], channels: 2 });
	samplePlayer.loop = true;
	samplePlayer.loopStart = 0;
	samplePlayer.loopEnd = 1;

	samplePlayer.connect(node);
	
	node.samplePlayer = samplePlayer;

	copyFunctions(SeaWave.prototype, node);
	
	return node;

}

SeaWave.prototype = Object.create(Instrument.prototype);

SeaWave.prototype.noteOn = function(noteNumber, velocity, when) {
	console.log('SeaWave note on', noteNumber, velocity, when);
	console.log(this.samplePlayer.buffer.length);
	this.samplePlayer.start(when);
};

module.exports = SeaWave;
