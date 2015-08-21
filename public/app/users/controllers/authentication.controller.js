(function () {
    'use strict';

    angular.module('users')
        .controller('AuthenticationController', ['$scope', '$http', '$window', '$location', 'Authentication',
            function ($scope, $http, $window, $location, Authentication) {
                $scope.user = Authentication.getUserData();
                // If user is signed in then redirect back home
                if ($scope.user) $location.path('/');

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

                $scope.signout = function () {
                    $http.get('/auth/signout')
                        .success(function () {
                            // If successful we remove the userData
                            Authentication.removeUserData();

                            // If successful we remove the jwt
                            Authentication.removeJwt();

                            // And reload page
                            $window.location.reload(true);
                        })
                        .error(function (response) {
                            $scope.error = response.message;
                        });
                };
            }
        ]);
}());
