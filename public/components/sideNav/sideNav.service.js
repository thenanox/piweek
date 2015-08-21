(function() {
    'use strict';

    function SideNavService() {

        function showSidenav (sidenavId) {
            angular.element('#' + sidenavId).removeClass('closed');
            angular.element('#' + sidenavId).addClass('active');
            angular.element('.menu-toggle').removeClass('active');
            angular.element('.mask-blur').addClass('active');
        }

        function hideSidenav (sidenavId) {
            angular.element('#' + sidenavId).removeClass('active');
            angular.element('#' + sidenavId).addClass('closed');
            angular.element('.menu-toggle').addClass('active');
            angular.element('.mask-blur').removeClass('active');
        }

        return {
            showSidenav: showSidenav,
            hideSidenav : hideSidenav
        };
    }
    angular.module('sideNavDirective').service('SideNavService', SideNavService);
}());
