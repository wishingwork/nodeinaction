var redis = require('redis');
var bcrypt = require('bcryptjs');
var db = redis.createClient();

module.exports = User;

function User(obj) {
	for (var key in obj) {
		this[key] = obj[key];
	}
}

// Create/Register/Update a user 
User.prototype.save = function(fn) {
	if (this.id) {
		this.update(fn);
	} else {
		var user = this;
		db.incr('user:ids', function (err, id) {	//create unique id
			if (err) return fn(err);
			user.id = id;
			user.hashPassword(function (err) {
				if (err) return fn(err);
				user.update(fn);
			});
		});
	}
};

User.prototype.update = function(fn) {
	var user = this;
	var id = user.id;
	db.set('user:id' + user.name, id, function (err) {	// search index by name
		if (err) return fn(err);
		db.hmset('user:' + id, user, function (err) {	// hash map save
			fn(err);
		});
	});
};

// Generate hash password for new User
User.prototype.hashPassword = function(fn) {
	var user = this;
	bcrypt.genSalt(12, function (err, salt) {
		if (err) return fn(err);
		user.salt = salt;
		bcrypt.hash(user.pass, salt, function (err, hash) {		// hash user.pass and salt together
			if (err) return fn(err);
			user.pass = hash;
			fn();
		});
	});
};

// Testing script to see if User model and save method works
// var tobi = new User({
// 	name: 'tobi',
// 	pass: 'ferret',
// 	age: '2'
// });

// tobi.save(function (err) {
// 	if (err) throw err;
// 	console.log('user id %d', tobi.id);
// });

// Get user info by name = getId + get
// (An example to create a customized method from two default methods)
User.getByName = function (name, fn) {
	User.getId(name, function (err, id) {
		if (err) return fn(err);
		User.get(id, fn);
	});
};

// Get user id from DB by name
User.getId = function (name, fn) {
	db.get('user:id:' + name, fn);
}

// Get user info from DB by id
User.get = function (id, fn) {
	db.hgetall('user:' + id, function (err, user) {
		if (err) return fn(err);
		fn(null, new User(user));
	});
};

User.authenticate = function (name, pass, fn) {
	User.getByName(name, function (err, user) {
		if (err) return fn(err);
		if (!user.id) return fn();								// Check if the user exists by name
		bcrypt.hash(pass, user.salt, function (err, hash) {
			if (err) return fn(err);
			if (hash == user.pass) return fn(null, user);		// Check if password hash is the same with the stored hash
			fn();
		});
	});
};



