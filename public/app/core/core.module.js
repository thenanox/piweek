(function () {
    'use strict';

    // Setting up route
    angular.module('core', [])
        .config(['$stateProvider', '$urlRouterProvider',
            function ($stateProvider, $urlRouterProvider) {
                // Redirect to home view when route not found
                $urlRouterProvider.otherwise('/');
            }
        ]).config(
            ['$httpProvider', function ($httpProvider) {
                // Set up $http interceptors
                $httpProvider.interceptors.push('jwtInterceptor');
            }]
        );
}());
