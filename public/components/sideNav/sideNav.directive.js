(function () {
    'use strict';

    function sideNavDirective (SideNavService) {
        return {
            templateUrl: 'components/sideNav/sideNav.view.html',
            link: function (scope, element) {
                var menuToggle = element.find('.menu-toggle');

                function listen (element, event, handler) {
                    element.on(event, handler);
                    return function () {
                        element.off(event, handler);
                    };
                }

                function hideSidenav () {
                    SideNavService.hideSidenav('menu');
                }

                function onStateChangeStart() {
                    return scope.$on('$stateChangeStart', hideSidenav);
                }

                var listenerForMenuToggle = listen(menuToggle, 'click', hideSidenav),
                    listenerForStateChange = onStateChangeStart();

                element.on('$destroy', function () {
                    listenerForMenuToggle();
                });
            }
        };
    }
    angular.module('sideNavDirective', []).directive('sideNav', ['SideNavService', sideNavDirective]);
}());
