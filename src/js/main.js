var Player = require('openmusic-tracker-player');
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
// repeat list x times then rebuild it - easier to build a long enough song.
//
// rather than 'per instrument' this should be more about generic commands / tracker style probably
// patterns -> channels -> timed commands ~~~~> series of events

var player = new Player();
var song = {
	bpm: 100,
	orders: [ 0, 0 ],
	// number of columns per track
	tracks: [ 1 ],
	patterns: [
		{
			rows: 32,
			tracks: [
				[
					{ row: 0, columns: [{ note: 'C-4', instrument: 0 }] }
				]
			]
		}
	]
};

player.loadSong(song);
player.buildEvents();
player.gear = [ sw ];
player.repeat = true;
player.debugEventsList();

var scheduleAheadTime = 0.1;
var scheduleInterval = 0.025;
var scheduleStart;
var scheduleTimer;

function getNow() {
	return ac.currentTime;
}

function schedule() {
	var now = getNow();
	player.processEvents(now, scheduleAheadTime);
}

function play() {
	scheduleStart = getNow();
	// setInterval works in ms
	player.play(scheduleStart); // play/pause/resume/stop|reset ?
	scheduleTimer = setInterval(schedule, scheduleInterval * 1000);
}

function stop() {
	clearInterval(scheduleTimer);
}

// TMP
play();
