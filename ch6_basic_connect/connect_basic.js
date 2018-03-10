var connect = require('connect');
var app = connect();
// app.use(logger).use(hello);
// app.use(hello).use(logger);		// No "next", so logger won't be executed
// app.use(logger).use('/admin', adminTest).use(hello);		// Only the page under localhost:3000/admin/ will execute adminTest middleware
app.use(logger).use('/admin', restrict).use('/admin',admin).use(hello);
app.listen(3000);

function logger(req, res, next) {
	console.log('%s %s', req.method, req.url);	// What url and method is use from our browser, and display them
	next();
}

function hello(req, res) {
	res.setHeader('Content-Type', 'text/plain');
	res.end('Hello World');	// Because end http res, so doesn't need "next"
}

function adminTest(req, res, next) {
	console.log('Testing');	// What url and method is use from our browser, and display them
	next();
}

function restrict(req, res, next) {
	var authorization = req.headers.authorization;
	if (!authorization) return next(new Error('Unauthorized'));

	var parts = authorization.split(' ')
	var schema = parts[0]
	var auth = new Buffer(parts[1], 'base64').toString().split(':')
	var user = auth[0]
	var pass = auth[1]

	authenticateWithDatabase(user, pass, function (err) {
		if (err) return next(err);	// Error handling middleware
		next();
	});
}

function admin(req, res, next) {
	switch(req.url) {
		case '/':
			res.end('try /users');
			break;
		case '/users':
			res.setHeader('Content-Type', 'application/json');
			res.end(JSON.stringify(['tobi', 'loki', 'jane']));
			break;
	}
}

function authenticateWithDatabase(user, pass, callback) {
  var err;
  if (user != 'tobi' || pass != 'ferret') {
    err = new Error('Unauthorized');
  }
  callback(err);
}
