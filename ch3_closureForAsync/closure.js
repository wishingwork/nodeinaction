function asyncFunction(callback) {
	setTimeout(callback, 200);
}

var color = 'blue';

// Async task will wait until end
asyncFunction(function() {
	console.log('The color is ' + color);
});

// Closure tasks may run first
(function(color) {
	asyncFunction(function() {
		console.log('The color is ' + color);
	})
})(color);

color = 'green';