(function () {
    'use strict';

    // Setting up route
    angular.module('core', [])
        .config(['$urlRouterProvider', function ($urlRouterProvider) {
            $urlRouterProvider.otherwise('/');
        }])
        .config(['$httpProvider', function ($httpProvider) {
            $httpProvider.interceptors.push('jwt.interceptor');
        }]);
}());
