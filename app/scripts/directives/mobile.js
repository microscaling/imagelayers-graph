(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name iLayers.directive:badge
   * @description
   * # mobile
   */
  angular.module('iLayers').directive('mobile', Mobile);

  function Mobile() {
    return {
      templateUrl: 'views/mobile.html',
      restrict: 'E',
      replace: 'true',
      link: function($scope) {
        $scope.dismiss = function (){
          $('.mobile').remove();
        };
      }
    };
  }
})();
