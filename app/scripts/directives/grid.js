'use strict';

angular.module('iLayers')
  .directive('grid', ['$timeout', '$sce', 'commandService', 'gridService', function($timeout, $sce, commandService, gridService) {
    var constants = {
      colWidth: 210,
      boxWidth: 180
    };

    return {
      templateUrl: 'views/grid.html',
      restrict: 'A',
      replace: false,
      controller: function($scope) {
        var self = this;

        self.classifyLayer = function(layer, count) {
        var classes = ['box'],
            cmd = self.getCommand(layer);

          if (count === 0) {
            return 'noop';
          }

          if (cmd.lastIndexOf('curl') !== -1) {
            classes.push('curl');
          }

          if (cmd.lastIndexOf('install') !== -1 || cmd.lastIndexOf('ADD') !== -1) {
            classes.push('add');
          }

          if (cmd.lastIndexOf('ENV') !== -1) {
            classes.push('env');
          }

          if ( cmd.lastIndexOf('CMD') !== -1) {
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

        self.getCommand = function(layer) {
          var command = (layer.container_config === undefined) ? [] : (layer.container_config.Cmd !== null) ? layer.container_config.Cmd.join(' ') : '';
          return commandService.constructCommand(command);
        };

        self.addDisplayProperties = function(layer) {
          layer.cmd = $sce.trustAsHtml(self.getCommand(layer));
          return layer;
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

                data.push({ 'type':  self.classifyLayer(layer, count),
                            'width': self.findWidth(count),
                            'layer': self.addDisplayProperties(layer) });
              }
            }
          }

          return data;
        };
      },
      link: function(scope, element) {
        scope.highlightCommand = function(layerId) {
          var item = gridService.inventory(layerId),
              start = 0,
              layers = [];

          if (item !== undefined) {
            layers = item.image.layers;
            // find start in layers //
            for (var l=0; l < layers.length; l++) {
              if (layerId === layers[l].id) {
                start = l;
              }
            }

            commandService.highlight(item.image.layers.slice(0,start+1));
          }
        };

        scope.clearCommands = function() {
          commandService.clear();
        };

        scope.buildGrid = function(graph) {
          var gridData = gridService.buildGrid(graph);

          element.find('.matrix').css('width', (gridData.cols * constants.colWidth) + 'px');
          scope.leaves = gridService.findLeaves(gridData);
          return scope.unwrapGrid(gridData);
        };

        scope.$watch('graph', function(graph) {
          scope.grid = scope.buildGrid(graph);
        });

        scope.$watch('filters.image', function(filter) {
          if (scope.graph !== undefined) {
            var graphData = scope.applyFilters(scope.graph, filter);
            scope.grid = scope.buildGrid(graphData);
          }
        });
      }
    };
  }]);
