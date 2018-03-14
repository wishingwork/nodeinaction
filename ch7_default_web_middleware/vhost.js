var connect = require('connect');

var server = connect()
var app = require('./sites/expressjs.dev');

server.use(connect.vhost('expressjs.dev', app));
server.listen(3030);

// command line works: curl -H "Host: expressjs.dev" http://localhost:3030
// browser doesn't work