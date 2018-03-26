
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  // , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var register = require('./routes/register');
var messages = require('./lib/messages');
var login = require('./routes/login');
var user = require('./lib/middleware/user');
var entries = require('./routes/entries');
var validate = require('./lib/middleware/validate');
var page = require('./lib/middleware/page');
var Entry = require('./lib/entry');
var api = require('./routes/api');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  // app.use(express.static(__dirname + '/public'));
  app.use('/api', api.auth);
  app.use(user);
  app.use(messages);    // execute messages module
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// app.get('/', routes.index);
// app.get('/users', user.list);

// app.get('/', 
//     page(Entry.count, 1),                     // Entry is from /lib/entry.js
//     entries.list);                            // entries is from /routes/entries.js



app.get('/register', register.form);
app.post('/register', register.submit);

app.get('/login', login.form);
app.post('/login', login.submit);
app.get('/logout', login.logout);

app.get('/post', entries.form);
app.post('/post',
    validate.required('entry[title]'),          // use middleware validate.js to check entry title
    validate.lengthAbove('entry[title]', 4),
    entries.submit);

app.get('/:page?',                              // This have to put the the last route
      page(Entry.count, 1),
      entries.list);

app.get('/api/user/:id', api.user);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
