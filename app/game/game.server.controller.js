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
    game.user = req.user;
    game.saveAll(function (err) {
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
    game = _.extend(game, req.body);
    game.saveAll(function (err) {
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
    Game.get().sort('-created').populate('user', 'displayName').exec(function (err, games) {
        if (err) {
            return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
            });
        }
        else {
            res.json(games);
        }
    });
};
/**
 * game middleware
 */
exports.gameByID = function (req, res, next, id) {
    Game.get(id).populate('user', 'displayName').exec(function (err, game) {
        if (err)
            return next(err);
        if (!game)
            return next(new Error('Failed to load game ' + id));
        req.game = game;
        next();
    });
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