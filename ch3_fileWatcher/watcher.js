// Create a Watcher class
function Watcher(watchDir, processedDir) {
	this.watchDir = watchDir;
	this.processedDir = processedDir;
}

// Let Watcher inherit EventEmitter function
var events = require('events')
	, util = require('util');
util.inherits(Watcher, events.EventEmitter);

var fs = require('fs')
	, watchDir = './watch'
	, processedDir = './done';

// Modify Watcher function: watch & start
Watcher.prototype.watch = function() {
	var watcher = this;
	fs.readdir(this.watchDir, function(err, files) {
		if (err) throw err;
		for (var index in files) {
			watcher.emit('process', files[index]);
		}
	})
}

Watcher.prototype.start = function() {
	var watcher = this;
	fs.watchFile(watchDir, function() {
		watcher.watch();
	});
}

// Start a new Watcher instance
var watcher = new Watcher(watchDir, processedDir);

// Register a process event for Watcher instance
watcher.on('process', function process(file) {
	var watchFile = this.watchDir + '/' + file;
	var processedDir = this.processedDir + '/' + file.toLowerCase();

	fs.rename(watchFile, processedDir, function(err) {
		if(err) throw err;
	});
});

watcher.start();
