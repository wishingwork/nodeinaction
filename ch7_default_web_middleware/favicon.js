var connect = require('connect');

var app = connect()
	.use(connect.favicon('./favicon.ico'))
	.use(connect.logger())
	.use(function (req, res) {
		res.end('Hello World!\n');
	})
	.listen(3030);
