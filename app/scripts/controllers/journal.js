'use strict';

/**
 * @ngdoc function
 * @name iLayers.controller:JournalCtrl
 * @description
 * # JournalCtrl
 * Controller of the iLayers
 */
angular.module('iLayers')
  .controller('JournalCtrl', function ($scope) {
    $scope.commands = [];
  
    $scope.$on('command-change', function(event, data) {
      if ($scope.lockedImage === undefined) {
        $scope.commands = data.commands;
      }
    });
  });
