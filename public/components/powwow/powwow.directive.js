(function () {
    'use strict';

    function powwowDirective () {
        return {
            templateUrl: 'components/powwow/powwow.view.html',
            replace: true,
            scope: {
                powwow: '='
            },
            controller: ['$scope', function ($scope) {
                $scope.slots = function (slots) {
                    var a = [];
                    
                    for(var i = 1; i <= slots; i += 1) {
                        a.push(i);
                    }

                    return a;
                };
            }]
        };
    }
    angular.module('powwowDirective', []).directive('powwow', powwowDirective);
}());
