module.exports = function copyFunctions(origin, destination) {
	for(var k in origin) {
		var thing = origin[k];
		if(typeof(thing) === 'function') {
			destination[k] = thing;
		}
	}	
};
