module.exports = function(numSamples) {

	var output = new Array();

	for(var i = 0; i < numSamples; i++) {
		output.push(Math.random());
	}

	return output;
	
};
