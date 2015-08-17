'use strict';

/**
 * Module dependencies.
 */
var	thinky = require('../core/thinky'),
	type = thinky.type,
	r = thinky.r,
	User = require('../user/user.server.model.js');

/**
 * Article Schema
 */
var Game = thinky.createModel('Game', {
	created: type.date().default(r.now),
	title: type.string(),
	content: type.string(),
	userId: type.string(),
},{init:true});

User.hasMany(Game, 'Game', 'id', 'userId');
Game.belongsTo(User, 'user', 'userid', 'id');

module.exports = Game;
