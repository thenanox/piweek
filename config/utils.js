"use strict";

var path = require('path'),
    util = require('util'),
    _ = require("lodash"),
    config = require("./config"),
    jsonwebtoken = require("jsonwebtoken"),
    TOKEN_EXPIRATION = 60,
    TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION * 60,
    UnauthorizedAccessError = require("../app/core/UnathorizedAccessError.js"),
    thinky = require('../app/core/thinky'),
	r = thinky.r;

module.exports.fetch = function (headers) {
    if (headers && headers.authorization) {
        var authorization = headers.authorization;
        var part = authorization.split(' ');
        if (part.length === 2) {
            var token = part[1];
            return part[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

module.exports.create = function (user, req, res, next) {
    console.log("Create token");
    if (_.isEmpty(user)) {
        return next(new Error('User data cannot be empty.'));
    }

    var data = {
        username: user.username,
        email: user.email,
        token: jsonwebtoken.sign({ username: user.username }, config.secret, {
            expiresInMinutes: TOKEN_EXPIRATION
        })
    };

    var decoded = jsonwebtoken.decode(data.token);

    data.token_exp = decoded.exp;
    data.token_iat = decoded.iat;

    console.log("Token generated for user: %s, token: %s", data.username, data.token);
    r.table('JWT').insert({token:data.token,data:data}).run().then(function(data){
        if (data) {
           /* client.expire(data.token, TOKEN_EXPIRATION_SEC, function (err, reply) {
                if (err) {
                    return next(new Error("Can not set the expire value for the token key"));
                }
                if (reply) {
                    req.user = data;
                    next(); // we have succeeded
                } else {
                    return next(new Error('Expiration not set on rethink'));
                }
            });*/
            req.user = data;
            next();
        }
        else {
            return next(new Error('Token not set in rethink'));
        }
    }).error(function(err){
        return next(new Error(err));
    });
    return data;
};

module.exports.retrieve = function (id, done) {

    console.log("Calling retrieve for token: %s", id);

    if (_.isNull(id)) {
        return done(new Error("token_invalid"), {
            "message": "Invalid token"
        });
    }

    r.table('JWT').get(id).run().then(function(reply){
        if (_.isNull(reply)) {
            return done(new Error("token_invalid"), {
                "message": "Token doesn't exists, are you sure it hasn't expired or been revoked?"
            });
        } else {
            var data = JSON.parse(reply);
            console.log("User data fetched from rethink store for user: %s", data.username);

            if (_.isEqual(data.token, id)) {
                return done(null, data);
            } else {
                return done(new Error("token_doesnt_exist"), {
                    "message": "Token doesn't exists, login into the system so it can generate new token."
                });
            }

        }
    }).error(function(err){
        return done(err, {
            "message": err
        });
    }); 
};

module.exports.verify = function (req, res, next) {

    console.log("Verifying token");

    var token = exports.fetch(req.headers);

    jsonwebtoken.verify(token, config.secret, function (err, decode) {

        if (err) {
            req.user = undefined;
            return next(new UnauthorizedAccessError("invalid_token"));
        }

        exports.retrieve(token, function (err, data) {

            if (err) {
                req.user = undefined;
                return next(new UnauthorizedAccessError("invalid_token", data));
            }

            req.user = data;
            next();

        });

    });
};

module.exports.expire = function (headers) {

    var token = exports.fetch(headers);

    console.log("Expiring token: %s", token);

    if (token !== null) {
        r.table('JWT').get(token).delete().run();
    }
    return token !== null;
};

module.exports.middleware = function () {
    var func = function (req, res, next) {
        var token = exports.fetch(req.headers);
        exports.retrieve(token, function (err, data) {
            if (err) {
                req.user = undefined;
                return next(new UnauthorizedAccessError("invalid_token", data));
            } else {
                req.user = _.merge(req.user, data);
                next();
            }

        });
    };
    func.unless = require("express-unless");
    return func;
};

module.exports.TOKEN_EXPIRATION = TOKEN_EXPIRATION;
module.exports.TOKEN_EXPIRATION_SEC = TOKEN_EXPIRATION_SEC;