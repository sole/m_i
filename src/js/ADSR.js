// var EventDispatcher = require('eventdispatcher.js');

function ADSR(audioContext, param, attack, decay, sustain, release) {

	'use strict';

	var that = this;
	var values = {};

	//EventDispatcher.call(this);

	setParams({
		attack: attack,
		decay: decay,
		sustain: sustain,
		release: release
	});

	['attack', 'decay', 'sustain', 'release'].forEach(function(param) {
		Object.defineProperty(that, param, {
			get: makeGetter(param),
			set: makeSetter(param),
			enumerable: true
		});
	});

	//

	function makeGetter(param) {
		return function() {
			return values[param];
		};
	}

	function makeSetter(param) {
		var paramChanged = param + '_changed';
		return function(v) {
			values[param] = v;
//			that.dispatchEvent({ type: paramChanged, value: v });
		};
	}

	function setParams(params) {
		values.attack = params.attack !== undefined ? params.attack : 0.0;
		values.decay = params.decay !== undefined ? params.decay : 0.02;
		values.sustain = params.sustain !== undefined ? params.sustain : 0.5;
		values.release = params.release !== undefined ? params.release : 0.10;
	}
	
	// ~~~
	
	this.setParams = setParams;

	this.beginAttack = function(when) {
		when = when !== undefined ? when : audioContext.currentTime;
		
		var now = when;

		param.cancelScheduledValues(now);
		param.setValueAtTime(0, now);
		param.linearRampToValueAtTime(1, now + this.attack);
		param.linearRampToValueAtTime(this.sustain, now + this.attack + this.decay);
	};

	this.beginRelease = function(when) {
		
		when = when !== undefined ? when : audioContext.currentTime;
		var now = when;

		// this seemed to be too abrupt
		//param.cancelScheduledValues(now);

		param.linearRampToValueAtTime(0, now + this.release);
		//param.setTargetAtTime(0, now + this.release, 0.2);
		//^^^TODO not sure which one I prefer best
		
	};

}

module.exports = ADSR;

