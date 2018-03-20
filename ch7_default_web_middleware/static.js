var connect = require('connect');

var app = connect()
	.use(connect.directory('public'))					// browser: http://localhost:3030/
	// .use(connect.static('public'))					// curl http://localhost:3030/foo.js -i
	.use('/app/files', connect.static('public'))		// curl http://localhost:3030/app/files/foo.js -i
	.listen(3030);
