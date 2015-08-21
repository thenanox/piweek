(function() {
    'use strict';

    function powwowDirective() {
        return {
            templateUrl: 'components/powwow/powwow.view.html',
            scope: {
                powwow: '='
            },
            controller: ['$scope', function($scope) {
                $scope.slots = function(slots) {
                    var a = [];

                    for (var i = 1; i <= slots; i += 1) {
                        a.push(i);
                    }

                    return a;
                };
                $scope.obtainImageUrl = function() {
                    var imageUrl;

                    angular.forEach($scope.powwow.images, function(image) {
                        imageUrl = image;
                    });
                    return imageUrl;
                }
            }],
            link: function(scope, element) {
                var closedIcon = element.find('.closed-icon'),
                    powwow = element.find('.powwow'),
                    powwowDetailContainer = element.find('.powwow-detail-dialog');

                function unlisten(element, event, handler) {
                    element.off(event, handler);
                }

                function listen(element, event, handler) {
                    element.on(event, handler);
                    return function() {
                        unlisten(element, event, handler)
                    }
                }

                function openDetailPowwow() {
                    powwowDetailContainer.addClass('animate');
                    angular.element('.mask-blur').addClass('active');
                }

                function closeDetailPowwow() {
                    powwowDetailContainer.removeClass('animate');
                    angular.element('.mask-blur').removeClass('active');
                }

                var listenerForClosedIcon = listen(closedIcon, 'click', closeDetailPowwow),
                    listenerForOpenDetail = listen(powwow, 'click', openDetailPowwow);

                element.on('$destroy', function () {
                    listenerForClosedIcon();
                });
            }
        };
    }
    angular.module('powwowDirective', []).directive('powwow', powwowDirective);
}());
