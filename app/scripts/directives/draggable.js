'use strict';

/**
 * @ngdoc directive
 * @name iLayers.directive:draggable
 * @description
 * # draggable
 */
angular.module('iLayers')
  .directive('draggable', [ '$window', function ($window) {
    return {
      template: '<div class="draggable"><div class="drag-handle"></div></div>',
      restrict: 'E',
      scope: {},
      replace: true,
      link: function postLink(scope, element, attrs) {
        var handle = element.find('.drag-handle');

        scope.updatePosition = function(pos) {
            $('main').css('bottom', pos + 'px');
            $('footer').css('height', pos + 'px');
        };

        handle.bind('mousedown', function() {
          element.addClass('dragging');

        });
        $('body').bind('mouseup', function() {
          element.removeClass('dragging');
        });

        $('body').bind('mousemove', function(e) {
          var height = $window.innerHeight,
              bottom = height - e.pageY;

          if (element.hasClass('dragging')) {
            scope.updatePosition(bottom);
          }
        });
      }
    };
  }]);
