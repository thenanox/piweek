(function () {
    'use strict';

    // Powwows controller
    angular.module('powwows')
        .controller('PowwowsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Powwows',
            function ($scope, $stateParams, $location, Authentication, Powwows) {
                $scope.authentication = Authentication;

                // Create new Powwow
                $scope.create = function () {
                    // Create new Powwow object
                    var powwow = new Powwows({
                        creator: this.creator,
                        game: this.game,
                        description: this.description,
                        platform: this.platform,
                        slots: this.slots,
                        language: this.language,
                        time: this.time,
                        timeZone: this.timeZone
                    });

                    // Redirect after save
                    powwow.$save(function (response) {
                        $location.path('powwows/' + response.id);

                        // Clear form fields
                        $scope.name = '';
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                // Remove existing Powwow
                $scope.remove = function (powwow) {
                    if (powwow) {
                        powwow.$remove();

                        for (var i in $scope.powwows) {
                            if ($scope.powwows[i] === powwow) {
                                $scope.powwows.splice(i, 1);
                            }
                        }
                    } else {
                        $scope.powwow.$remove(function () {
                            $location.path('powwows');
                        });
                    }
                };

                // Update existing Powwow
                $scope.update = function () {
                    var powwow = $scope.powwow;

                    powwow.$update(function () {
                        $location.path('powwows/' + powwow.id);
                    }, function (errorResponse) {
                        $scope.error = errorResponse.data.message;
                    });
                };

                // Find a list of Powwows
                $scope.find = function () {
                    $scope.powwows = Powwows.query();
                };

                // Find existing Powwow
                $scope.findOne = function () {
                    $scope.powwow = Powwows.get({
                        powwowId: $stateParams.powwowId
                    });
                };
            }
        ]);
}());
