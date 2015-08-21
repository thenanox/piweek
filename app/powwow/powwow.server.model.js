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
	game: type.string(),
	subscribers: type.array().schema(type.string()),
	accepted: type.array().schema(type.string())
});

Powwow.defineStatic('sortBy', function (field, reverse) {
	if (field) {
		return Powwow.orderBy(reverse ? r.desc(field) : field);
	} else {
		return Powwow;
	}
});

module.exports = Powwow;
