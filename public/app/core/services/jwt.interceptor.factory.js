(function () {
    'use strict';

    angular.module('core')
        .factory('jwt.interceptor', ['Authentication', function (Authentication) {
            return {
                request: function (config) {
                    var jwt = Authentication.getJwt();
                    if (jwt) config.headers.Authorization = jwt;
                    return config;
                }
            };
        }]);
})();
