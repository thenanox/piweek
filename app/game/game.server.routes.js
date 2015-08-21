'use strict';


module.exports = function(app) {
	var games = require('./game.server.controller');

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