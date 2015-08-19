(function () {
    'use strict';

    angular.module('core')
        .controller('HeaderController', ['sideNavService', function (sideNavService) {
            var userCap = angular.element('.user-cap');

            function showMenu () {
                sideNavService.showSidenav('menu');
            }

            userCap.on('click', showMenu);
        }
    ]);
}());
