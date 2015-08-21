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

	powwow.save(function(powwow) {
			res.jsonp(powwow);
		}).error(function(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});

};

/**
 * Delete an powwow
 */
exports.delete = function(req, res) {
	var powwow = req.powwow ;

	powwow.remove(function(powwow) {
			res.jsonp(powwow);
		}).error(function(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Update subscribers of a powwow
 */
exports.subscribe = function(req, res) {

	var powwow = req.powwow;

	powwow.subscribers = _.union(powwow.subscribers, req.body);

	powwow.save().then(function(powwow){
			res.jsonp(powwow);
		}).error(function(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Unsuscribe from a powwow
 */
exports.unsubscribe = function(req, res) {

	var powwow = req.powwow;

	powwow.subscribers = _.difference(powwow.subscribers , req.body);

	powwow.save().then(function(powwow){
			res.jsonp(powwow);
		}).error(function(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Accept a subscription of a powwow
 */
exports.accept = function(req, res) {

	var powwow = req.powwow;

	powwow.accepted = _.union(powwow.accepted, req.body);

	powwow.save().then(function(powwow){
			res.jsonp(powwow);
		}).error(function(err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * Reject a subscription of a powwow
 */
exports.reject = function(req, res) {

	var powwow = req.powwow;

	powwow.accepted = _.difference(powwow.accepted , req.body);

	powwow.save().then(function(powwow){
			res.jsonp(powwow);
		}).error(function(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * List of powwows
 */
exports.list = function(req, res) {
	if (req.query.userId){
		Powwow.filter(function(powwow) {
   			return powwow('subscribers').contains(req.query.userId);
		}).sortBy('time').run().then(function(powwows){
			res.jsonp(powwows);
		}).error(function(err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
	}

	Powwow.sortBy('time').run().then(function(powwows) {
			res.jsonp(powwows);
		}).error(function (err){
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		});
};

/**
 * powwow middleware
 */
exports.powwowByID = function(req, res, next, id) {

	Powwow.get(id).run().then(function(data) {
		if (! data){
			return next(new Error('Failed to load powwow ' + id));
		} else{
			req.powwow = data ;
			next();
		}

	}).error(function(err){
		return next(err);
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
