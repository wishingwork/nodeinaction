var express = require('express');
var res = express.response;							// Override default method

res.message = function (msg, type) {
	type = type || 'info';
	var sess = this.req.session;
	sess.messages = sess.messages || [];
	sess.messages.push({type: type, string: msg});	// save messages into session
};

res.error = function (msg) {
	return this.message(msg, 'error');
}

module.exports = function (req, res, next) {
	res.locals.messages = req.session.messages || [];	// create res.messges method
	res.locals.removeMessages = function () {			// create res.removeMesssage method
		req.session.messages = [];
	};
	next();
};
