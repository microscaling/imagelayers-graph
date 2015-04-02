'use strict';

/**
 * @ngdoc directive
 * @name iLayers.directive:draggable
 * @description
 * # draggable
 */
angular.module('iLayers')
  .directive('draggable', function () {
    return {
      template: '<div class="draggable"></div>',
      restrict: 'E',
      scope: true,
      replace: true,
      link: function postLink(scope, element, attrs) {
        var dragging = false;
        element.bind('mousedown', function() {
          dragging = true;

        });
        $('body').bind('mouseup', function() {
          dragging = false;
        });

        $('body').bind('mousemove', function(e) {
          var height = window.innerHeight,
              bottom = height - e.clientY;

          console.log(e.clientY);
          console.log('h: ', height);
          if (dragging) {
            console.log("event ", bottom);
            $('main').css('bottom', bottom + 'px');
            $('footer').css('height', bottom + 'px');
          }
        });
      }
    };
  });
