'use strict';

/**
 * @ngdoc directive
 * @name iLayers.directive:badge
 * @description
 * # badge
 */
angular.module('iLayers').directive('badge', ['ngDialog', function (ngDialog) {
  return {
    templateUrl: 'views/badge.html',
    restrict: 'E',
    replace: 'true',
    controller: function($scope) {
      var dialogID;
    
      $scope.open = function() {
        dialogID =  ngDialog.open({
              template: 'views/badgeDialog.html',
              className: 'ngdialog-theme-layers badge-dialog',
              controller: 'BadgeDialogCtrl',
              scope: $scope
        });
      };
    }
  }
}]);
