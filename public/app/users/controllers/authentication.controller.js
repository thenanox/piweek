(function () {
    'use strict';

    angular.module('users')
        .controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication',
            function ($scope, $http, $location, Authentication) {
                // If user is signed in then redirect back home
                if (Authentication.getUserData()) $location.path('/');

                $scope.signup = function () {
                    $http.post('/auth/signup', $scope.credentials)
                        .success(function (response) {
                            // If successful we save the user info and the jwt
                            if (response) Authentication.setUserData(response);
                            if (response.token) Authentication.setJwt(response.token);

                            // And redirect to the index page
                            $location.path('/');
                        })
                        .error(function (response) {
                            $scope.error = response.message;
                        });
                };

                $scope.signin = function () {
                    $http.post('/auth/signin', $scope.credentials)
                        .success(function (response) {
                            // If successful we save the user info and the jwt
                            if (response) Authentication.setUserData(response);
                            if (response.token) Authentication.setJwt(response.token);

                            // And redirect to the index page
                            $location.path('/');
                        })
                        .error(function (response) {
                            $scope.error = response.message;
                        });
                };
            }
        ]);
}());
