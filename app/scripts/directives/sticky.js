'use strict';

/**
 * @ngdoc directive
 * @name iLayers.directive:sticky
 * @description
 * # sticky
 */
angular.module('iLayers')
  .directive('sticky', function () {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var main = element.parent('main'),
            offset = (attrs.offset) ? attrs.offset : 0,
            locked = element.find('.lock-horizon');

        main.bind('scroll', function() {
          var top = main.scrollTop(),
              left = main.scrollLeft();

          if (main.scrollTop() >= offset) {
            element.addClass('sticky');
             if (locked) {
              locked.children().css('left',  '-' + $(this).scrollLeft() + 'px');
             }
          } else {
            element.css('width', '100%');
            element.removeClass('sticky');
          }
        });
      }
    };
  });
