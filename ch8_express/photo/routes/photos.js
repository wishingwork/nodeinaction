// var photos = [];
// photos.push({
// 	name: 'Node.js Logo',
// 	path: 'http://nodejs.org/images/logos/nodejs-green.png'
// });
// photos.push({
// 	name: 'Ryan Speaking',
// 	path: 'http://nodejs.org/images/ryan-speaker.jpg'
// });

// exports.list = function (req, res) {
// 	res.render('photos', {
// 		title: 'Photos',
// 		photos: photos
// 	});
// };

var Photo = require('../models/Photo');
var path = require('path');
var fs = require('fs');
var join = path.join;

exports.list = function (req, res, next) {
	Photo.find({}, function (err, photos) {		// Find photos from Photo model
		if (err) return next(err);
		res.render('photos', {
			title: 'Photos',
			photos: photos
		});
	});
};

exports.form = function (req, res) {
	res.render('photos/upload', {
		title: 'Photo Upload'
	});
};

exports.submit = function (dir) {
	return function (req, res, next) {
		var img = req.files.photo.image;
		var name = req.body.photo.name || img.name;
		var path = join(dir, img.name);

		fs.rename(img.path, path, function (err) {
			if (err) return next(err);
			Photo.create({
				name: name,
				path: img.name
			}, function (err) {
				if (err) return next(err);
				res.redirect('/');
			});
		});
	};
};


exports.download = function (dir) {
	return function (req, res, next) {
		var id = req.params.id;
		Photo.findById(id, function (err, photo) {
			if (err) return next(err);
			var path = join(dir, photo.path);
			res.sendfile(path);		// open the photo in browser
			res.download(path, photo.name+'.jpeg');		// download the photo			
		});
	};
};

