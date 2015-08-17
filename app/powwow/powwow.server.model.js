'use strict';

/**
 * Module dependencies.
 */
var	thinky = require('../core/thinky'),
	type = thinky.type,
	r = thinky.r;

/**
 * Card Schema
 */
var Powwow = thinky.createModel('Powwow', {
	time: type.date().default(r.now),
	waitlist: type.number(),
	platform: type.string(),
	slots: type.number(),
	creator: type.string(),
	description: type.string(),
	game: type.string()
},{init:true});

module.exports = Powwow;