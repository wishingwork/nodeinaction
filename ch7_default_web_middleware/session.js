var connect = require('connect');

var hour = 360000;
var sessionOpts = {
	key: 'myapp_sid',
	cookie: { maxAge: hour * 24, secure: true }	//session expired after 24 hours, use https access
};

var app = connect()
	.use(connect.favicon())
	.use(connect.cookieParser('keyboard cat'))
	.use(connect.session())
	// .use(connect.session(sessionOpts))
	.use(function (req, res, next) {
		var sess = req.session;
		if(sess.views) {
			res.setHeader('Content-Type', 'text/html');
			res.write('<p>views: ' + sess.views + '</p>');

			req.session.cookie.expires = new Date(Date.now() + 5000);
			req.session.cookie.maxAge = 5000;
			res.write('<p>expires: ' + (sess.cookie.maxAge / 1000) + 's</p>');
			req.session.cookie.httpOnly = false;
			res.write('<p>httpOnly: ' + sess.cookie.httpOnly + '</p>');
			req.session.cookie.path = '/admin';
			res.write('<p>path: ' + sess.cookie.path + '</p>');
			res.write('<p>domain: ' + sess.cookie.domain + '</p>');
			res.write('<p>secure: ' + sess.cookie.secure + '</p>');

			sess.views++;
			res.end();
		} else {
			sess.views = 1;
			res.end('welcome to the session demo. refresh!');
		}
	});

app.listen(3030);