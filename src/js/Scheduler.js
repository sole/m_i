module.exports = function(audioContext, player) {
	
	var scheduleAheadTime = 0.1;
	var scheduleInterval = 0.025;
	var scheduleStart;
	var scheduleTimer;

	function getNow() {
		return audioContext.currentTime;
	}

	function schedule() {
		var now = getNow();
		player.processEvents(now, scheduleAheadTime);
	}

	this.play = function() {
		scheduleStart = getNow();
		// setInterval works in ms
		player.play(scheduleStart); // play/pause/resume/stop|reset ?
		scheduleTimer = setInterval(schedule, scheduleInterval * 1000);
	};

	this.stop = function() {
		clearInterval(scheduleTimer);
	};

};
