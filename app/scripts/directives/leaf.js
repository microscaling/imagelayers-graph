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
      link: function(scope, element) { 
        scope.showCommands = function(repo) {
          var data = scope.graph;

          for (var i=0; i < data.length; i++) {
            if (data[i].repo.name === repo.name && data[i].repo.tag === repo.tag) {
              commandService.highlight(data[i].layers);
              break;
            }
          }
        };
        
        scope.applyLock = function(repo) { 
          var lock = commandService.lock();
          
          $('div.leaves section').removeClass('locked');
          
          if (lock !== undefined && lock.identity === repo.identity) {
            commandService.release();
          } else {
            element.addClass('locked');
            commandService.release();
            scope.showCommands(repo);
            commandService.lock(repo);
          }
        }
      }
    };
  }]);
