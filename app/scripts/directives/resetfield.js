(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name iLayers.directive:resetField
   * @description
   * # resetField
   */
  angular.module('iLayers')
    .directive('resetField', ResetField);

  ResetField.$inject = ['$timeout'];

  function ResetField($timeout) {
    return {
      restrict: 'A',
      scope: {},
      require: 'ngModel',
      link: function postLink(scope, element, attrs, ctrl) {
        var resetElement = angular.element('<span ng-mousedown="reset()" class="reset-icon hidden"></span>');

        element.after(resetElement);

        resetElement.bind('click', function() {
          ctrl.$setViewValue('');
          ctrl.$render();

          $timeout(function() {
            element[0].focus();
          }, 0, false);
        });

        element.bind('input focus', function() {
          if (!ctrl.$isEmpty(element.val())) {
            resetElement.removeClass('hidden');
          } else {
            resetElement.addClass('hidden');
          }
          scope.$apply();
        });
      }
    };
  }
})();
