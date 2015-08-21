(function() {
    'use strict';

    function userCapDirective () {
        return {
            templateUrl: 'components/userCap/userCap.view.html',
        }
    }
    angular.module('userCapDirective', []).directive('userCap', [userCapDirective]);
}());
