'use strict';

/**
 * Module dependencies.
 */
var errorHandler = require('../core/errors.server.controller'),
	Powwow = require('./powwow.server.model.js'),
	_ = require('lodash');

/**
 * Create a powwow
 */
exports.create = function(req, res) {
	var powwow = new Powwow(req.body);
	powwow.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(powwow);
		}
	});
};

/**
 * Show the current powwow
 */
exports.read = function(req, res) {
	res.jsonp(req.powwow);
};

/**
 * Update a powwow
 */
exports.update = function(req, res) {
	var powwow = req.powwow ;

	powwow = _.extend(powwow , req.body);

	powwow.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(powwow);
		}
	});
};

/**
 * Delete an powwow
 */
exports.delete = function(req, res) {
	var powwow = req.powwow ;

	powwow.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(powwow);
		}
	});
};

/**
 * List of powwows
 */
exports.list = function(req, res) { 
	Powwow.run().then(function(powwows) {
			res.jsonp(powwows);
	});
};

/**
 * powwow middleware
 */
exports.powwowByID = function(req, res, next, id) { 
	Powwow.findById(id).populate('user', 'displayName').exec(function(err, powwow) {
		if (err) return next(err);
		if (! powwow) return next(new Error('Failed to load powwow ' + id));
		req.powwow = powwow ;
		next();
	});
};

/**
 * powwow authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.powwow.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
