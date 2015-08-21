'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs'),
	http = require('http'),
	https = require('https'),
	express = require('express'),
	socketio = require('socket.io'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
	compress = require('compression'),
	methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	helmet = require('helmet'),
	passport = require('passport'),
/*	mongoStore = require('connect-mongo')({
		session: session
	}),*/
	flash = require('connect-flash'),
	config = require('./config'),
	consolidate = require('consolidate'),
	path = require('path'),
	jwt = require('express-jwt'),
	unless = require('express-unless'),
	NotFoundError = require("../app/core/NotFoundError.js"),
	//TESTING PURPOSES
	Powwow = require('../app/powwow/powwow.server.model');

module.exports = function(db) {
	// Initialize express app
	var app = express();

	// Globbing model files
	config.getGlobbedFiles('./app/**/*model*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});

	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;
	app.locals.facebookAppId = config.facebook.clientID;
	app.locals.jsFiles = config.getJavaScriptAssets();
	app.locals.cssFiles = config.getCSSAssets();

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Showing stack errors
	app.set('showStackError', true);

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Enable logger (morgan)
		app.use(morgan('dev'));

		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());

	app.use(require('response-time')());

	app.use(methodOverride());

	// CookieParser should be above session
	app.use(cookieParser());

	// Express MongoDB session storage
	/*app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			db: db.connection.db,
			collection: config.sessionCollection
		})
	})); */

	/*app.use('/api', jwt({secret: config.secret}));*/

	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	// connect flash for flash messages
	app.use(flash());

	// Use helmet to secure Express headers
	app.use(helmet.xframe());
	app.use(helmet.xssFilter());
	app.use(helmet.nosniff());
	app.use(helmet.ienoopen());
	app.disable('x-powered-by');

	// Setting the app router and static folder
	app.use(express.static(path.resolve('./public')));

	// Globbing routing files
	config.getGlobbedFiles('./app/**/*routes*.js').forEach(function(routePath) {
		require(path.resolve(routePath))(app);
	});

	app.all('*', function (req, res, next) {
		next(new NotFoundError('404'));
	});

	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		var code = 500,
        msg = { message: 'Internal Server Error' };

		switch (err.name) {
			case 'UnauthorizedError':
				code = err.status;
				msg = undefined;
				break;
			case 'BadRequestError':
			case 'UnauthorizedAccessError':
			case 'NotFoundError':
				code = err.status;
				msg = err.inner;
				break;
			default:
				break;
		}

		return res.status(code).json(msg);
	});
		
	if (process.env.NODE_ENV === 'secure') {
		// Log SSL usage
		console.log('Securely using https protocol');

		// Load SSL key and certificate
		var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
		var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');
		var ca = fs.readFileSync('./config/sslcerts/ca.pem', 'utf8');

		// Create HTTPS Server
		var httpsServer = https.createServer({
			key: privateKey,
			cert: certificate,
			ca: ca,
			requestCert: true,
			rejectUnauthorized: false
		}, app);

		// Return HTTPS server instance
		return httpsServer;
	}

	var server = http.createServer(app);
	app.set('server', server);
	var io = socketio.listen(server);
	app.set('socketio', io);
	realtimelist(io);
	// Return Express server instance
	return app;
};

/**
 * Realtime list
 */
function realtimelist(io){
	Powwow.changes().then(function(feed) {
		feed.each(function(error, doc) {
			if (error) {
			console.log(error);
			}

			if (doc.isSaved() === false) {
			io.emit('removal',doc);
			}
			else if (doc.getOldValue() == null) {
			io.emit('addition',doc);
			}
			else {
			io.emit('modification',doc.getOldValue(), doc);
			}
		});
	}).error(function(error) {
		console.log(error);
	});
}
