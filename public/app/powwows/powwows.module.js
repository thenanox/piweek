(function () {
    'use strict';

    angular.module('powwows', [])
        .config(['$stateProvider',
            function ($stateProvider) {
                // Powwows state routing
                $stateProvider.
                state('listPowwows', {
                        url: '/powwows',
                        templateUrl: 'app/powwows/views/list-powwows.html'
                    })
                    .
                state('createPowwow', {
                        url: '/powwows/create',
                        templateUrl: 'app/powwows/views/create-powwow.html'
                    })
                    .
                state('viewPowwow', {
                        url: '/powwows/:powwowId',
                        templateUrl: 'app/powwows/views/view-powwow.html'
                    })
                    .
                state('editPowwow', {
                    url: '/powwows/:powwowId/edit',
                    templateUrl: 'app/powwows/views/edit-powwow.html'
                });
            }
        ]);
}());
