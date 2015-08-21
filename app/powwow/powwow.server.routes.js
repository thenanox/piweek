'use strict';

module.exports = function(app) {
	var powwow = require('./powwow.server.controller');
		
	app.route('/api/powwows')
		.get(powwow.list)
		.post(powwow.create);

	app.route('/api/powwows/:powwowId')
		.get(powwow.read)
		.put(powwow.update)
		.delete(powwow.delete);
	
	app.route('/api/powwows/:powwowId/subscribe')		
		.put(powwow.subscribe)
		.delete(powwow.unsubscribe);
		
	app.route('/api/powwows/:powwowId/accept')		
		.put(powwow.accept)
		.delete(powwow.reject);
		
	app.param('powwowId', powwow.powwowByID);
};
