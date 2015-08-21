'use strict';

/**
 * Module dependencies.
 */
var users = require('../user/users.server.controller'),
	games = require('./game.server.controller');

module.exports = function(app) {
	// game Routes
	app.route('/api/games')
		.get(games.list)
		.post(games.create);

	app.route('/api/games/:gameId')
		.get(games.read)
		.put(games.update)
		.delete(games.delete);


	// Finish by binding the game middleware
	app.param('gameId', games.gameByID);
};