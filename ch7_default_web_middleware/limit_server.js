var connect = require('connect');
var http = require('http');

var app = connect()
	.use(connect.limit('32kb'))
	.use(connect.bodyParser())
	.use(hello);
// app.listen(3000);
http.createServer(app).listen(3000);

function hello(req, res) {
	res.end('ok');
}