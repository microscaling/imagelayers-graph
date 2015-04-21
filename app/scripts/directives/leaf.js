'use strict';

/**
 * @ngdoc directive
 * @name iLayers.directive:leaf
 * @description
 * # leaf
 */
angular.module('iLayers')
  .directive('leaf', ['$location', 'commandService', function ($location, commandService) {
    return {
      templateUrl:'views/leaf.html',
      restrict: 'E',
      replace: true,
      controller: function($scope) {
        var locked = commandService.locked(),
            leaf = $scope.leaf;

        if (locked !== undefined && leaf.name === locked.name && leaf.tag === locked.tag) {
          $scope.lockParam = true;         
        } 
      },
      link: function(scope, element) { 
                
        scope.showCommands = function(repo, force) {
          var data = scope.graph;

          if (repo) {
            for (var i=0; i < data.length; i++) {
              if (data[i].repo.name === repo.name && data[i].repo.tag === repo.tag) {
                commandService.highlight(data[i].layers, force);
                break;
              }
            }
          }
        };
        
        scope.applyLock = function(repo) { 
          var lock = commandService.locked();
          
          $('div.leaves section').removeClass('locked');
          
          commandService.release();
          
          if (lock !== undefined && lock.name === repo.name && lock.tag === repo.tag) {
            scope.lockParam = false;
          } else {
            scope.lockParam = true;
            scope.showCommands(repo);
            commandService.lock(repo);
          }
        };
        
        scope.showCommands(commandService.locked(), scope.lockParam);
      }
    };
  }]);
