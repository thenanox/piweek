(function () {
    'use strict';

    var jwtItemName = 'jwt',
        jwtItemValuePreffix = 'Bearer ';

    // Authentication service for user variables
    angular.module('users')
        .service('Authentication', ['$window', function ($window) {
                var Authentication = this,
                    user = {};

                Authentication.getJwt = function () {
                    return $window.localStorage.getItem(jwtItemName);
                };

                Authentication.setJwt = function (jwt) {
                    $window.localStorage.setItem(jwtItemName, jwtItemValuePreffix + jwt);
                };

                Authentication.getUserData = function () {
                    return user.data;
                };

                Authentication.setUserData = function (data) {
                    user.data = data;
                };
            }
        ]);
}());
