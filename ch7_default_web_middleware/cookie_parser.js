var connect = require('connect');
var app = connect()
	.use(connect.cookieParser('tobi is a cool ferret'))
	.use(connect.bodyParser())
	.use(function (req, res, next) {
		// curl http://localhost:3000/ "Cookie: foo=bar"  => Write cookie from curl
		console.log(req.cookies);
		console.log(req.signedCookies);

		// Set head as foo=bat
		res.setHeader('Set-Cookie', 'foo=bat');
		res.setHeader('Set-Cookie', 'tobi=ferret;Expires=Tue, 08 Jun 2021 10:18:14 GMT');		
		// if res.end runs here, the other function will not be called
		// res.end('hello\n');		
		next();
	})
	.use(function (req, res) {
		// body...
		// curl -d '{"username":"tobiiii"}'  -H "Content-Type: application/json" http://localhost:3000/
		// bodyParser() get data from JSON ({"username":"tobiiii"}) or content-type (username=cc) input
		res.end('Registered user: ' + req.body.username);
	})
	.listen(3000);
