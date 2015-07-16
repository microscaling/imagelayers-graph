(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name iLayers.directive:sticky
   * @description
   * # sticky
   */
  angular.module('iLayers')
    .directive('sticky', Sticky); 

  function Sticky() {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var main = element.closest('main'),
            offset = (attrs.offset) ? attrs.offset : 0;

        scope.heightSet = false;

        scope.setHeight = function () {
          if (scope.heightSet) return;

          var matrixHeight = $('.matrix').height(),
            windowHeight = window.innerHeight,
            mainHeight = $('main').height();

          if (matrixHeight - mainHeight < offset) {
            $('.matrix').css('height', windowHeight);
          }
          scope.heightSet = true;
        };

        main.bind('scroll', function() {
          scope.setHeight();
          if (main.scrollTop() >= offset) {
            element.addClass('sticky');
            $('.matrix').css('padding-top', 160);
          } else {
            element.removeClass('sticky');
            $('.matrix').css('padding-top', 0);
          }
        });

      }
    };
  }
})();
