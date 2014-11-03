require('openmusic-oscilloscope').register('openmusic-oscilloscope');

var info = require('./DeviceInfo')();
var SeaWave = require('./instruments/SeaWave');

console.log('hey there', info);

var oscilloscope = document.createElement('openmusic-oscilloscope');
document.body.appendChild(oscilloscope);

document.body.appendChild(document.createTextNode(JSON.stringify(info)));


var ac = new AudioContext();
var sw = SeaWave(ac);
var analyser = ac.createAnalyser();

oscilloscope.attachTo(analyser);

sw.connect(analyser);
analyser.connect(ac.destination);

document.getElementById('trigger').addEventListener('click', noteOn);
var pushButton = document.getElementById('pushbutton');

pushButton.addEventListener('mousedown', noteOn);
pushButton.addEventListener('mouseup', noteOff);

function noteOn() {
	sw.noteOn(44, 0.5);
}

function noteOff() {
	sw.noteOff(44);
}

// per instrument:
// generate list of relative timestamps + *events* (not notes) e.g.
// 0, 'noteOn', [ 44, 0.5, 0 ]
// 3.4, 'noteOff', [ 44, 3.4 ] <- when needs to become relative
// 3.6, 'setADSR', [ 0.5, 0.5, 0.2, 10 ]
// (maybe better always set 'when' first?)
// repeat list x times then rebuild it
