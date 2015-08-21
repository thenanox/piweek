/*global io */
(function () {
    'use strict';

    var socketUrl = 'http://localhost:3000';

    angular.module('socket')
        .service('Socket', function () {
            return io.connect(socketUrl);
        });
}());
