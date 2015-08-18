'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport'),
	User = require('../app/user/user.server.model.js'),
	path = require('path'),
	config = require('./config');
	
/**
 * Module init function.
 */
module.exports = function() {
	// Serialize sessions
	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	// Deserialize sessions
	passport.deserializeUser(function(username, done) {
		User.get(username).then(function (user){
			done(null, user);
		}).error(function(err){
			done(err);
			}
		);
	});

	// Initialize strategies
	config.getGlobbedFiles('./config/strategies/**/*.js').forEach(function(strategy) {
		require(path.resolve(strategy))();
	});
};
