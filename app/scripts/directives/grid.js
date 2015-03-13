'use strict';

angular.module('iLayers')
  .directive('grid', ['$timeout', 'commandService', 'gridService', function($timeout, commandService, gridService) {
    var constants = {
      colWidth: 210,
      boxWidth: 180,
      smallClass: 'small',
      mediumClass: 'medium',
      largeClass: 'large'
    };

    return {
      templateUrl: 'views/grid.html',
      restrict: 'A',
      replace: false,
      controller: function($scope) {
        var self = this;

        self.classifyLayer = function(layer, count) {
        var classes = ['box'],
            sizeCls = constants.smallClass,
            cmd = (layer.container_config === undefined) ? [] : (layer.container_config.Cmd !== null) ? layer.container_config.Cmd.join(' ') : '';

          if (count === 0) {
            return 'noop';
          };

          if (layer.Size > 20 * 1000) {
            sizeCls = constants.mediumClass;
          };

          if (layer.Size > 100 * 1000) {
            sizeCls = constants.largeClass;
          };

          classes.push(sizeCls);

          if (cmd.lastIndexOf(' curl ') !== -1) {
            classes.push('curl');
          }

          if (cmd.lastIndexOf(' ADD ') !== -1) {
            classes.push('add');
          }

          if (cmd.lastIndexOf(' ENV ') !== -1) {
            classes.push('env');
          }

          if (cmd.lastIndexOf(' apt-get') !== -1 || cmd.lastIndexOf(' cmd ') !== -1) {
            classes.push('cmd');
          }

          return classes.join(' ');
        };

        self.findWidth = function(count) {
          if (count === 0) {
            return 0;
          }
          return count * constants.boxWidth + (count-1)*20;
        };

        $scope.unwrapGrid = function(grid) {
          var data = [],
              map = [];

          if (grid.matrix) {

            map = grid.matrix.map;

            for (var row=0; row < grid.rows; row++) {
              for (var col=0; col < grid.cols; col++) {
                var layer = map[col][row].layer,
                    count =0;

                if (grid.matrix.inventory[layer.id] !== undefined) {
                  count = grid.matrix.inventory[layer.id].count;
                  grid.matrix.inventory[layer.id].count = 0;
                }

                data.push({ 'type': self.classifyLayer(layer, count),
                            'width':  self.findWidth(count),
                            'layer': layer });
              }
            }
          };

          return data;
        };
      },
      link: function(scope, element) {
        scope.highlightCommand = function(layerId) {
          var item = gridService.inventory(layerId);

          if (item !== undefined) {
            commandService.highlight(item.image.layers.slice(item.row, item.image.layers.length));
          }
        };

        scope.clearCommands = function() {
          commandService.clear();
        };

        scope.applyFilters = function(graphData, filter) {
          var filteredData = [];
          for (var i=0; i < graphData.length; i ++) {
            if (graphData[i].repo.name.lastIndexOf(filter) !== -1) {
              filteredData.push(graphData[i]);
            }
          }
          return filteredData;
        };

        scope.buildGrid = function(graph) {
          var gridData = gridService.buildGrid(graph);

          element.find('.matrix').css('width', (gridData.cols * constants.colWidth) + 'px');
          scope.leaves = gridService.findLeaves(gridData);
          return scope.unwrapGrid(gridData);
        }

        scope.$watch('graph', function(graph) {
          scope.grid = scope.buildGrid(graph);
        });

        scope.$watch('filters.image', function(filter) {
          //gridData = scope.applyFilters(graph);
          if (scope.graph !== undefined) {
            var graphData = scope.applyFilters(scope.graph, filter);
            scope.grid = scope.buildGrid(graphData);
          };
        });
      }
    };
  }]);
