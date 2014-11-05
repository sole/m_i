var Player = require('openmusic-tracker-player');
var Scheduler = require('./Scheduler');
require('openmusic-oscilloscope').register('openmusic-oscilloscope');

var info = require('./DeviceInfo')();
var SeaWave = require('./instruments/SeaWave');
var Bell = require('./instruments/Bell');

console.log('hey there', info);

var oscilloscope = document.createElement('openmusic-oscilloscope');
document.body.appendChild(oscilloscope);

document.body.appendChild(document.createTextNode(JSON.stringify(info)));

var ac = new AudioContext();
var analyser = ac.createAnalyser();
oscilloscope.attachTo(analyser);

// player
var player = new Player();

// scheduler
var scheduler = new Scheduler(ac, player);

// instruments
var maxInstruments = 5;
var instrumentTypes = [ SeaWave, Bell ];
var instrumentProbabilities = [ 0.2, 0.8 ];
var instruments = generateInstruments(maxInstruments, instrumentTypes, instrumentProbabilities, ac);

// song
var song = generateSong({
	bpm: 100,
	patternLength: 16,
	numOrders: 1,
	instruments: instruments,
	noteAllocations: [
		{
			type: SeaWave,
			scale: [ 'C-4' ],
			density: 0.2
		},
		{
			type: Bell,
			scale: [ 'C-4', 'C-5', 'A-4' ],
			density: 0.6
		}
	]
});

player.loadSong(song);

//

function generateInstruments(amount, types, probabilities, audioContext) {
	var out = [];
	var allocation = probabilities.map(function(p) {
		return Math.round(amount * p);
	});

	console.log(allocation);

	allocation.forEach(function(num, index) {
		var constructor = types[index];
		for(var i = 0; i < num; i++) {
			var instr = constructor(audioContext);
			out.push({ instrument: instr, type: constructor });
		}
	});

	return out;
	
}

function generateSong(options) {
	
	var bpm = options.bpm || 100;
	var patternLength = options.patternLength || 64;
	var numOrders = options.numOrders || 1;
	var instruments = options.instruments;
	var noteAllocations = options.noteAllocations;
	var orders = [];
	var tracks = [];
	var patterns = [];

	// One channel per instrument
	instruments.forEach(function() {
		tracks.push(1);
	});

	for(var i = 0; i < numOrders; i++) {
		orders.push(i);

		patterns.push(generatePattern(patternLength, instruments, noteAllocations));
	}

	var out = {
		bpm: bpm,
		orders: orders,
		tracks: tracks,
		patterns: patterns
	};

	return out;
}


function generatePattern(rows, instrDefs, noteAllocations) {
	var tracks = [];
	var pattern = {
		rows: rows,
		tracks: tracks
	};

	instrDefs.forEach(function(def, instrIndex) {
		var alloc = findNoteAllocation(def, noteAllocations);
		var scale = alloc.scale;
		var track = [];
		var numNotes = Math.round(alloc.density * rows);
		var notes = [];
		var i;

		console.log('density', alloc.density, 'num notes', numNotes);
		
		for(i = 0; i < numNotes; i++) {
			var note = scale[Math.round(Math.random() * scale.length) % scale.length];
			notes.push(note);	
		}

		for(i = numNotes; i < rows; i++) {
			notes.push(null);
		}

		// TODO randomise notes
		notes.sort(randomSort);

		notes.forEach(function(note, rowIndex) {
			if(note !== null) {
				track.push({
					row: rowIndex,
					columns: [{ note: note, instrument: instrIndex }]
				});
			}
		});

		tracks.push(track);

	});

	return pattern;
}

function randomSort(a, b) {
	return Math.random() > 0.5;
}

function findNoteAllocation(instrDef, noteAllocations) {
	var instrumentType = instrDef.type;
	for(var i = 0; i < noteAllocations.length; i++) {
		var alloc = noteAllocations[i];
		if(alloc.type === instrumentType) {
			return alloc;
		}
	}
}

/*
var sw = SeaWave(ac);
var bell = Bell(ac);

bell.connect(analyser);
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
					{ row: 0, columns: [{ note: 'C-4', instrument: 0 }] },
					{ row: 8, columns: [{ note: 'OFF', instrument: 0 }] },
					{ row: 16, columns: [{ note: 'G-4', instrument: 0 }] },
					{ row: 24, columns: [{ note: 'OFF', instrument: 0 }] }

				]
			]
		}
	]
};

player.loadSong(song);
player.buildEvents();
player.gear = [ bell ];
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
play();*/
