var Instrument = require('./Instrument');
var copyFunctions = require('../copyFunctions');
var generateWhiteNoise = require('openmusic-white-noise');
var SamplePlayer = require('openmusic-sample-player');

function SeaWave(ac) {

	var node = Instrument(ac);
	
	// buffer with white noise
	var noise = generateWhiteNoise(ac.sampleRate);
	var buffer = ac.createBuffer(1, noise.length, ac.sampleRate);
	var samplePlayer = SamplePlayer(ac);

	samplePlayer.connect(node);

	var channelData = buffer.getChannelData(0);
	noise.forEach(function(v, i) {
		channelData[i] = v;
	});

	samplePlayer.buffer = buffer;
	samplePlayer.loop = true;
	samplePlayer.loopStart = 0;
	samplePlayer.loopEnd = 1;

	node.buffer = buffer;
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
