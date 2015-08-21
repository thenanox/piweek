(function () {
    'use strict';

    function HeaderController($scope, SideNavService, Authentication) {
        $scope.userData = Authentication.getUserData(); 
        var userCap = angular.element('[user-cap]');

        function showMenu () {
            SideNavService.showSidenav('menu');
        }

        $scope.isLogged = function () {
            return $scope.userData;
        }

        userCap.on('click', showMenu);
    }

    angular.module('core').controller('HeaderController', ['$scope', 'SideNavService', 'Authentication', HeaderController]);
}());
