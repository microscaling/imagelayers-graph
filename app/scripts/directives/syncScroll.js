(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name iLayers.directive:sticky
   * @description
   * # horizonScroll
   */
  angular.module('iLayers')
    .directive('syncScroll', SyncScroll
  );

  function SyncScroll() {
    return {
      restrict: 'A',
      link: function postLink(scope, element, attrs) {
        var main = element.closest('main'),
          offset = attrs.offset ? attrs.offset : 0,
          syncTarget = attrs.syncTarget ? $(attrs.syncTarget) : $('body');

        syncTarget.bind('scroll', function() {
          if ($('main').scrollTop() >= offset) {
            element.css('left', syncTarget.scrollLeft() * -1);
          } else {
            element.css('left', 0);
          }
        });

        main.bind('scroll', function() {
          if ($('main').scrollTop() < offset) {
            element.css('left', 0);
          } else {
            element.css('left', syncTarget.scrollLeft() * -1);
          }
        });
      }
    };
  }
})();
