'use strict';

/**
 * @ngdoc directive
 * @name iLayers.directive:notification
 * @description
 * # notification
 */
angular.module('iLayers')
  .directive('notification', Notification);

function Notification() {
  return {
    template: '<div id="error">{{ message }} <div class="dismiss" ng-click="dismiss()"></div></div>',
    restrict: 'E',
    replace: true,
    link: function postLink(scope, element, attrs) {
      scope.message = '';

      element.hide();

      scope.$on('notification', function(evt, data) {
        element.fadeIn();
        scope.message = data.msg;
        scope.loading = false;
        $('body').addClass('error');
      });

      scope.dismiss = function() {
        element.fadeOut(400, function() {
          $('body').removeClass('error');
        });
      }
    }
  };
};
