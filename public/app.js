(function () {
    'use strict';

    var appName = 'powwow';

    //Start by defining the main module and adding the module dependencies
    angular.module(appName, [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils',
		'core',
		'users',
        'powwows',
        'sideNavDirective',
        'powwowDirective'
    ]);

    // Setting HTML5 Location Mode
    angular.module(appName)
        .config(['$locationProvider', function ($locationProvider) {
            $locationProvider.hashPrefix('!');
        }]);

    //Then define the init function for starting up the application
    angular.element(document)
        .ready(function () {
            //Fixing facebook bug with redirect
            if (window.location.hash === '#_=_') window.location.hash = '#!';

            //Then init the app
            angular.bootstrap(document, [appName]);
        });
}());
