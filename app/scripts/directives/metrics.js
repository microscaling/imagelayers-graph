'use strict';

angular.module('iLayers')
  .directive('metrics', ['$timeout', function($timeout) {

    return {
      templateUrl: 'views/metrics.html',
      restrict: 'E',
      controller: function($scope) {
        $scope.metrics = {
          count: 0,
          size: 0,
          ave: 0,
          largest: 0
        };
      },
      link: function(scope) {

        scope.sequential = function(key, start, end, duration) {

          var range = end - start;
          var minTimer = 50;

          // calc step time to show all interediate values
          var stepTime = Math.abs(Math.floor(duration / range));

          // never go below minTimer
          stepTime = Math.max(stepTime, minTimer);

          // get current time and calculate desired end time
          var startTime = new Date().getTime();
          var endTime = startTime + duration;

          function run() {
            var now = new Date().getTime();
            var remaining = Math.max((endTime - now) / duration, 0);
            var value = Math.round(end - (remaining * range));
            scope.metrics[key] = value;
            if (value !== end) {
              $timeout(run, stepTime);
            }
          }

          run();
        };

        scope.calculateMetrics = function(data) {
          var count  = 0,
              size = 0,
              ave = 0,
              largest = 0,
              cache = {},
              layers = [];

          for (var i=0; i< data.length; i++) {
            angular.forEach(data[i].layers, function(l) {
              cache[l.id] = l;
            });
          }

          for (var key in cache) {
            if (cache.hasOwnProperty(key)) {
              layers.push(cache[key]);
            }
          }

          for (var i=0; i < layers.length; i++) {
            count += 1;
            size += layers[i].Size;
            largest = Math.max(largest, layers[i].Size);
            ave = Math.floor(size / count);
          }

          // animate the numbers
          scope.sequential('count', scope.metrics.count, count, 600);
          scope.sequential('size', scope.metrics.size, size, 520);
          scope.sequential('ave', scope.metrics.ave, ave, 520);
          scope.sequential('largest', scope.metrics.largest, largest, 520);
        };

        scope.$watch('graph', function() {
          if (scope.graph.length > 0) {
            scope.calculateMetrics(scope.graph);
          }
        }, true);

        scope.$watch('filters.image', function(filter) {
          if (scope.graph !== undefined) {
            var graphData = scope.applyFilters(scope.graph, filter);
            scope.calculateMetrics(graphData);
          };
        });
      }
    };
  }]);
