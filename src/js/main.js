var info = require('./DeviceInfo')();
var SeaWave = require('./instruments/SeaWave');

console.log('hey there', info);
document.body.appendChild(document.createTextNode(JSON.stringify(info)));

var ac = new AudioContext();
var sw = SeaWave(ac);
sw.noteOn(44, 0.5, 0);
console.log(sw);
