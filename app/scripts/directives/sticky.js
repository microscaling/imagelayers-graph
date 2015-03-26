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
            width = 0,
            locked = element.find('.lock-horizon');

        main.bind('scroll', function() {
          var top = main.scrollTop(),
              left = main.scrollLeft();

          if (locked) {
            locked.css('left',  '-' + $(this).scrollLeft() + 'px');
          }

          if (main.scrollTop() >= offset) {
            element.css('width', (width -15) + 'px');
            element.addClass('sticky');
          } else {
            element.css('width', '100%');
            element.removeClass('sticky');
          }
        });
      }
    };
  });
