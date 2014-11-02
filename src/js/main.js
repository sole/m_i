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

function trigger() {
	sw.noteOn(44, 0.5);
}

document.querySelector('button').addEventListener('click', trigger);

//trigger();

