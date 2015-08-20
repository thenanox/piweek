(function () {
    'use strict';

    //Powwows service used to communicate Powwows REST endpoints
    angular.module('powwows')
        .factory('Powwows', ['$resource',
            function ($resource) {
                return $resource('api/powwows/:powwowId', {
                    powwowId: '@id'
                }, {
                    update: {
                        method: 'PUT'
                    }
                });
            }
        ]);
}());
