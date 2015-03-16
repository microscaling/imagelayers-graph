'use strict';

angular.module ('iLayers')
  .directive('journal', function() {

    return {
      restrict: 'A',
      link: function(scope, element) {
        scope.$on('command-change', function(event, data) {
          scope.commands = data.commands;
        });
      }
    };
  });
