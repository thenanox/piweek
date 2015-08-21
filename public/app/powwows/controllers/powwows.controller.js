(function () {
    'use strict';

    // Powwows controller
    angular.module('powwows')
        .controller('PowwowsController', ['$scope', '$stateParams', '$state', '$location', 'Authentication', 'Powwows', 'Socket',
            function ($scope, $stateParams, $state, $location, Authentication, Powwows, Socket) {
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
                function add(powwow) {
                    $scope.$apply(function () {
                        $scope.powwows.unshift(powwow);
                    });
                }

                function splice(powwow, remove) {
                    for (var i = 0, l = $scope.powwows.length; i < l; i += 1) {
                        if ($scope.powwows[i].id === powwow.id) {
                            if (remove) $scope.powwows.splice(i, 1);
                            else $scope.powwows.splice(i, 1, powwow);
                            break;
                        }
                    }
                }

                function modify(oldPowwow, newPowwow) {
                    $scope.$apply(function () {
                        splice(newPowwow);
                    });
                }

                function remove(powwow) {
                    $scope.$apply(function () {
                        splice(powwow, remove);
                    });
                }

                $scope.find = function () {
                    $scope.powwows = Powwows.query();
                    Socket
                        .on('addition', add)
                        .on('modification', modify)
                        .on('removal', remove);
                };

                // Find existing Powwow
                $scope.findOne = function () {
                    $scope.powwow = Powwows.get({
                        powwowId: $stateParams.powwowId
                    });
                };

                $scope.goTo = function (state) {
                    $state.go(state);
                };
            }
        ]);
}());
