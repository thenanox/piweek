'use strict';

/**
 * Module dependencies.
 */
var users = require('../user/users.server.controller'),
	games = require('./game.server.controller');

module.exports = function(app) {
	// game Routes
	app.route('/games')
		.get(games.list)
		.post(users.requiresLogin, games.create);

	app.route('/games/:gameId')
		.get(games.read)
		.put(users.requiresLogin, games.hasAuthorization, games.update)
		.delete(users.requiresLogin, games.hasAuthorization, games.delete);

	// Finish by binding the game middleware
	app.param('gameId', games.gameByID);
};