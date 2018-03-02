var events = require('events');
var net = require('net');

var channel = new events.EventEmitter();
channel.clients = {};
channel.subscriptions = {};

// Record new socket user
channel.on('join', function(id, client) {
	this.clients[id] = client;
	this.subscriptions[id] = function (senderId, message) {
		if (id != senderId) {
			this.clients[id].write(message);
		}
	}
	this.on('broadcast', this.subscriptions[id]);
	var welcome = "welcome!\n"
		+ "Guests online: " + this.listeners('broadcast').length;
		client.write(welcome + "\n");
});

// Remove listen event
channel.on('leave', function (id) {
	channel.removeListener('broadcast', id, id + " has left the chat. \n");
});

// Remove all users
channel.on('shutdown', function() {
	channel.emit('broadcast', '', "Chat has shut down. \n");
	channel.removeAllListeners('broadcast');
});

// Createa a server to listen socket event
var server = net.createServer(function (client) {
	var id = client.remoteAddress + ':' + client.remotePort;
	channel.emit('join', id, client);
	client.on('data', function (data) {
		data = data.toString();
		if (data == "shutdown\r\n") {
			channel.emit('shutdown');
		}
		channel.emit('broadcast', id, data);
	});

	client.on('close', function() {
		channel.emit('leave', id);
	});
});

server.listen(8888);