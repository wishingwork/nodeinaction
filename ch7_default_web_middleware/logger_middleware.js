var connect = require('connect');

var fs = require('fs');
var log = fs.createWriteStream('./myapp.log', { flags: 'a'})

var app = connect()
	// .use(connect.logger({format: ':method :url :response-time ms'}))
	.use(connect.logger({format: ':method :url :response-time ms', stream: log}))	// write log into log file	
	.use(hello)
	.listen(3030);

function hello(req,res) {
	res.end('OK');
}