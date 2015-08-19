(function () {
    'use strict';

    function powwowDirective () {
        return {
            templateUrl: 'components/powwow/powwow.view.html',
            replace: true
        };
    }
    angular.module('powwowDirective', []).directive('powwow', powwowDirective);
}());
