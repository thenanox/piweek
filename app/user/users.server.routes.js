'use strict';

/**
 * Module dependencies.
 */
var passport = require('passport');

module.exports = function(app) {
	// User Routes
	var users = require('./users.server.controller');

	// Setting up the users profile api
	app.route('/api/users/:username').get(users.obtainuser);
	app.route('/api/users').put(users.update);
	app.route('/api/users/accounts').delete(users.removeOAuthProvider);

	// Setting up the users password api
	app.route('/api/users/password').post(users.changePassword);
	app.route('/api/auth/forgot').post(users.forgot);
	app.route('/api/auth/reset/:token').get(users.validateResetToken);
	app.route('/api/auth/reset/:token').post(users.reset);

	// Setting up the users authentication api
	app.route('/auth/signup').post(users.signup);
	app.route('/auth/signin').post(users.signin);
	app.route('/auth/signout').get(users.signout);

	// Setting the facebook oauth routes
	app.route('/api/auth/facebook').get(passport.authenticate('facebook', {
		scope: ['email']
	}));
	app.route('/api/auth/facebook/callback').get(users.oauthCallback('facebook'));

	// Setting the twitter oauth routes
	app.route('/api/auth/twitter').get(passport.authenticate('twitter'));
	app.route('/api/auth/twitter/callback').get(users.oauthCallback('twitter'));

	// Setting the google oauth routes
	app.route('/api/auth/google').get(passport.authenticate('google', {
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email'
		]
	}));
	app.route('/api/auth/google/callback').get(users.oauthCallback('google'));

	// Finish by binding the user middleware
	app.param('username', users.userByID);
};
