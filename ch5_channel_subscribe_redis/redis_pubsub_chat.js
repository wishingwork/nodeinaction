// The process to start this program - 
// Prerequisite: "npm install redis"
// TCP networking utility "netcat" installation instruction:  http://macappstore.org/netcat/
// 1. "redis-server" => run redis server
// 2. "node redis_pubsub_chat.js"	=> run TCP server
// 3. "netcat localhost 3000" => start TCP client
//
var net = require('net');
var redis = require('redis');

var server = net.createServer(function (socket) {
	var subscriber;
	var publisher;

	// socket.on('connect', function() {
		// create subscribe client for every user
		subscriber = redis.createClient();
		subscriber.subscribe('main_chat_room');
		// whenever a message is received in server, the server display the message to every user
		subscriber.on('message', function(channel, message) {
			socket.write('Channel ' + channel + ': ' + message);
		});
		// create publish client for every user
			publisher = redis.createClient();
		// });

		// when public message is created by server, display it
		socket.on('data', function(data) {
			publisher.publish('main_chat_room', data);
		});

	// If user is disconnected, end the publish and subscribe
	socket.on('end', function() {
		subscriber.unsubscribe('main_chat_room');
		subscriber.end();
		publisher.end();
	});
});

server.listen(3000);
