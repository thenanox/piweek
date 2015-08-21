'use strict';
/**
 * Module dependencies.
 */
var errorHandler = require('../core/errors.server.controller'), 
    Game = require('./game.server.model.js'), 
    _ = require('lodash');
/**
 * Create a game
 */
exports.create = function (req, res) {
    var game = new Game(req.body);
    
    game.save().then(function (game) {
         res.json(game);
    }).error(function(err){
        return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });  
    });
};
/**
 * Show the current game
 */
exports.read = function (req, res) {
    res.json(req.game);
};
/**
 * Update a game
 */
exports.update = function (req, res) {
    var game = req.game;
    
    game = _.extend(game , req.body);

	game.save(function(game) {
			res.jsonp(game);
		}).error(function(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};
/**
 * Delete an game
 */
exports.delete = function (req, res) {
    var game = req.game;
    game.delete(function (err) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(game);
        }
    });
};
/**
 * List of games
 */
exports.list = function (req, res) {
    
    Game.run().then(function(games) {
			res.jsonp(games);
		}).error(function (err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};
/**
 * game middleware
 */
exports.gameByID = function (req, res, next, id) {
    
    Game.get(id).run().then(function(data) {
		if (! data){
			return next(new Error('Failed to load game ' + id));	
		} else{
			req.game = data;
			next();
		}
		
	}).error(function(err){
		return next(err);
	})
};
/**
 * game authorization middleware
 */
exports.hasAuthorization = function (req, res, next) {
    if (req.game.user.id !== req.user.id) {
        return res.status(403).send({
            message: 'User is not authorized'
        });
    }
    next();
};

//# sourceMappingURL=../controllers/games.server.controller.js.map