
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path');

var photos = require('./routes/photos');

var app = express();

var env = process.env.NODE_ENV || 'development';

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('photos', __dirname + '/public/photos');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

// app.configure('development', function(){
  // app.use(express.errorHandler());
// });

if ('development' == env) {
  app.use(express.errorHandler())
}

app.configure('production', function () {
  app.set('photos', '/mounted-volume/photos');
});

// app.get('/', routes.index);
app.get('/users', user.list);
app.get('/', photos.list);

app.get('/upload', photos.form);
app.post('/upload', photos.submit(app.get('photos')));

app.get('/photo/:id/download', photos.download(app.get('photos')));

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
