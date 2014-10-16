function DeviceInfo() {
	return {
		// We're interested in the total browser window size,
		// not caring about whether devtools are open or not
		width: window.outerWidth,
		height: window.outerHeight,
		hasWebAudio: !! (window.AudioContext)
	};
}

module.exports = DeviceInfo;
