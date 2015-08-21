(function () {
    'use strict';

    var userDataItemName = 'usr',
        jwtItemName = 'jwt',
        jwtItemValuePreffix = 'Bearer ';

    // Authentication service for user variables
    angular.module('users')
        .service('Authentication', ['$window', function ($window) {
                var Authentication = this;

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
                    try {
                        return JSON.parse($window.localStorage.getItem(userDataItemName));
                    } catch(ignore) {
                        return null;
                    }
                };

                Authentication.setUserData = function (data) {
                    $window.localStorage.setItem(userDataItemName, JSON.stringify(data));
                };

                Authentication.removeUserData = function (data) {
                    $window.localStorage.removeItem(userDataItemName);
                };
            }
        ]);
}());
