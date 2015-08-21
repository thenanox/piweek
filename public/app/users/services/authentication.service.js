(function () {
    'use strict';

    var userDataItemName = 'usr',
        jwtItemName = 'jwt',
        jwtItemValuePreffix = 'Bearer ';

    // Authentication service for user variables
    angular.module('users')
        .service('Authentication', ['$window', function ($window) {
                var Authentication = this,
                    user = {};

                try {
                    user.data = JSON.parse($window.localStorage.getItem(userDataItemName));
                } catch(ignore) {
                    user.data = null;
                }

                Authentication.getJwt = function () {
                    return $window.localStorage.getItem(jwtItemName);
                };

                Authentication.setJwt = function (jwt) {
                    $window.localStorage.setItem(jwtItemName, jwtItemValuePreffix + jwt);
                };

                Authentication.removeJwt = function () {
                    $window.localStorage.removeItem(jwtItemName);
                };

                Authentication.getUserData = function () {
                    return user.data;
                };

                Authentication.setUserData = function (data) {
                    user.data = data;
                    $window.localStorage.setItem(userDataItemName, JSON.stringify(data));
                };

                Authentication.removeUserData = function () {
                    user.data = null;
                    $window.localStorage.removeItem(userDataItemName);
                };
            }
        ]);
}());
