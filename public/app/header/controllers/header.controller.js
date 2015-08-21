(function () {
    'use strict';

    function HeaderController($scope, SideNavService, Authentication) {
        var userCap = angular.element('[user-cap]');

        function showMenu () {
            SideNavService.showSidenav('menu');
        }

        $scope.isLogged = function () {
            return Authentication.getUserData();
        };

        userCap.on('click', showMenu);
    }

    angular.module('core').controller('HeaderController', ['$scope', 'SideNavService', 'Authentication', HeaderController]);
}());
