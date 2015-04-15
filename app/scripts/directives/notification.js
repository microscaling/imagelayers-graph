'use strict';

/**
 * @ngdoc directive
 * @name iLayers.directive:notification
 * @description
 * # notification
 */
angular.module('iLayers')
  .directive('notification', function () {
    return {
      template: '<div id="error">{{ message }}</div>',
      restrict: 'E',
      replace: true,
      link: function postLink(scope, element, attrs) {
        scope.message = '';
      
        element.hide();
        
        scope.$on('notification', function(evt, data) {
          element.fadeIn();
          scope.message = data.msg;
          scope.loading = false;
        });
        
      }
    };
  });
