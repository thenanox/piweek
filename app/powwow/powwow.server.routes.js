'use strict';

module.exports = function(app) {
	var powwow = require('./powwow.server.controller');

	app.route('/powwows')
		.get(powwow.list)
		.post(powwow.create);

	app.route('/powwows/:powwowId')
		.get(powwow.read)
		.put(powwow.update)
		.delete(powwow.delete);

	app.param('powwowId', powwow.powwowByID);
};
