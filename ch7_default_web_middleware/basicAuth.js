var connect = require('connect');

var users = {
	tobi: 'foo',
	loki: 'bar',
	jane: 'baz'
};

var app = connect()
	// .use(connect.basicAuth('tj', 'tobi'))	// curl --user tj:tobi http://localhost:3030 -i
	.use(connect.basicAuth(function (user, pass) {	// Use any user in users array to access the page
		return users[user] === pass;				// curl --user tobi:foo http://localhost:3030 -i  
	}))
	// .use(connect.basicAuth(function (user, pass, callback) {
	// 	User.authenticate({ user: user, pass: pass}, gotUser);	// Run User.authenticate to give authentication
	// 	function gotUser(err, user) {
	// 		if (err) return callback(err);
	// 		callback(null, user);
	// 	}
	// }))
	.use(hello)
	.listen(3030);



function hello(req, res) {
	res.end('Hello')
}