var fs = require('fs');
var path = require('path');
// Get the string, which is from the thid word, from command line
var args = process.argv.splice(2);
// Get the first word from "args" variable
var command = args.shift();
var taskDescription = args.join(' ');
var file = path.join(process.cwd(), '/.tasks');

switch(command) {
	case 'list':
		listTasks(file);
		break;
	case 'add':
		addTask(file, taskDescription);
		break;
	default:
		console.log('Usage: ' + process.argv[0] + ' list|add [taskDescription]');
}

function loadOrInitializeTaskArray(file, cb) {
	fs.exists(file, function(exists) {
		var tasks = [];
		if (exists) {
			// Read
			fs.readFile(file, 'utf8', function(err, data) {
				if (err) throw err;
				var data = data.toString();
				var tasks = JSON.parse(data || '[]');
				cb(tasks);
			});
		} else {
			cb([]);
		}
	});
}

function listTasks(file) {
	loadOrInitializeTaskArray(file, function(tasks) {
		for(var i in tasks) {
			console.log(tasks[i]);
		}
	});
}

function storeTasks(file, tasks) {
	// Write
	fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
		if (err) throw err;
		console.log('Saved.');
	});
}

function addTask(file, taskDescription) {
	loadOrInitializeTaskArray(file, function (tasks) {
		tasks.push(taskDescription);
		storeTasks(file, tasks);
	});
}

