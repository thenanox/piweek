(function () {
    'use strict';

    // Config HTTP Error Handling
    angular.module('users', [])
        .config(['$httpProvider',
            function ($httpProvider) {
                // Set the httpProvider "not authorized" interceptor
                $httpProvider.interceptors.push(['$q', '$location', 'Authentication',
                    function ($q, $location, Authentication) {
                        return {
                            responseError: function (rejection) {
                                switch (rejection.status) {
                                case 401:
                                    // Deauthenticate the global user
                                    Authentication.user = null;

                                    // Redirect to signin page
                                    $location.path('signin');
                                    break;
                                case 403:
                                    // Add unauthorized behaviour
                                    break;
                                }

                                return $q.reject(rejection);
                            }
                        };
                    }
                ]);
            }
        ])
        .config(['$stateProvider',
            function ($stateProvider) {
                // Users state routing
                $stateProvider.
                state('profile', {
                        url: '/settings/profile',
                        templateUrl: 'app/users/views/settings/edit-profile.html'
                    })
                    .
                state('password', {
                        url: '/settings/password',
                        templateUrl: 'app/users/views/settings/change-password.html'
                    })
                    .
                state('accounts', {
                        url: '/settings/accounts',
                        templateUrl: 'app/users/views/settings/social-accounts.html'
                    })
                    .
                state('signup', {
                        url: '/signup',
                        templateUrl: 'app/users/views/authentication/signup.html'
                    })
                    .
                state('signin', {
                        url: '/signin',
                        templateUrl: 'app/users/views/authentication/signin.html'
                    })
                    .
                state('forgot', {
                        url: '/password/forgot',
                        templateUrl: 'app/users/views/password/forgot-password.html'
                    })
                    .
                state('reset-invalid', {
                        url: '/password/reset/invalid',
                        templateUrl: 'app/users/views/password/reset-password-invalid.html'
                    })
                    .
                state('reset-success', {
                        url: '/password/reset/success',
                        templateUrl: 'app/users/views/password/reset-password-success.html'
                    })
                    .
                state('reset', {
                    url: '/password/reset/:token',
                    templateUrl: 'app/users/views/password/reset-password.html'
                });
            }
        ]);
}());
