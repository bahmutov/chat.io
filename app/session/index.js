'use strict';

var session 	= require('express-session');
var MongoStore	= require('connect-mongo')(session);
var db 		    = require('../database');
var config 		= require('../config');

/**
 * Initialize Session
 * Uses MongoDB-based session store
 *
 */
var init = function () {
	const sessionSecret = process.env.SESSION_SECRET
	if (!sessionSecret) {
		throw new Error('Missing SESSION_SECRET')
	}

	if(process.env.NODE_ENV === 'production') {
		return session({
			secret: sessionSecret,
			resave: false,
			saveUninitialized: false,
			unset: 'destroy',
			store: new MongoStore({ mongooseConnection: db.Mongoose.connection })
		});
	} else {
		return session({
			secret: sessionSecret,
			resave: false,
			unset: 'destroy',
			saveUninitialized: true
		});
	}
}

module.exports = init();
