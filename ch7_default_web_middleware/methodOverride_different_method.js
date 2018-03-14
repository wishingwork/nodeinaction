var connect	= require('connect');

function edit(req, res, next) {
	if ('GET' != req.method) return next();
	res.setHeader('Content-Type', 'text/html');
	// res.write('<form method="put">');
	// in order to make req.method == put, we need to submit hidden input 
	res.write('<form method="post">');
	res.write('<input type="hidden" name="_method" value="put" />');

	res.write('<input type="text" name="user[name]" value="Tobi" />');
	res.write('<input type="submit" value="Update" />');
	res.write('</form>');
	res.end();
}

function update(req, res, next) {
	if ('PUT' != req.method) return next();
	res.end('Updated name to ' + req.body.user.name);
}

var app = connect()
	.use(connect.logger('dev'))
	.use(connect.bodyParser())
	.use(connect.methodOverride())
	.use(edit)
	.use(function(req, res, next){console.log(req.method); console.log(req.originalMethod); next()})
	.use(update);

app.listen(3030);