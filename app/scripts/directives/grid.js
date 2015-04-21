'use strict';

angular.module('iLayers')
  .directive('grid', ['$timeout', '$sce', '$routeParams', 'commandService', 'gridService', function($timeout, $sce, $routeParams, commandService, gridService) {
    var constants = {
      colWidth: 210,
      boxWidth: 160
    };

    var startsWith = function(str, text) {
      var list = text.split(' '),
          retval = false;

      angular.forEach(list, function(item) {
        retval = retval || (str.indexOf(item) === 0);
      });

      return retval
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

          if (startsWith(cmd, 'RUN')) {
            classes.push('cat1');
          }

          if (startsWith(cmd, 'ADD COPY')) {
            classes.push('cat2');
          }

          if (startsWith(cmd, 'VOLUME ENV USER WORKDIR')) {
            classes.push('cat3');
          }

          if (startsWith(cmd, 'ENTRYPOINT CMD')) {
            classes.push('cat4');
          }

          if (startsWith(cmd, 'FROM MAINTAINER EXPOSE ONBUILD')) {
            classes.push('cat5');
          }

          return classes.join(' ');
        };

        self.findWidth = function(count) {
          if (count === 0) {
            return 0;
          }
          return count * constants.boxWidth + (count-1)*40;
        };

        self.getCommand = function(layer) {
          var command = (layer.container_config === undefined) ? [] : (layer.container_config.Cmd !== null) ? layer.container_config.Cmd.join(' ') : '';
          return commandService.constructCommand(command);
        };

        self.addDisplayProperties = function(layer) {
          layer.cmd = $sce.trustAsHtml(self.getCommand(layer));
          return layer;
        };
        
        $scope.checkLockParam =function() {
          if ($routeParams.lock) {
            var lock = $routeParams.lock.split(':'),
                tag = (lock.length > 1) ? lock[1] : 'latest';
            commandService.lock({ name: lock[0], tag: tag });
          }
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

        scope.$watch('graph', function(graph, oldGraph) {
          scope.grid = scope.buildGrid(graph);
          if (oldGraph.length === 0) {
            scope.$evalAsync(scope.checkLockParam);
          }
        });

        scope.$watch('filters.image', function(filter) {
          if (scope.graph !== undefined) {
            var graphData = scope.applyFilters(scope.graph, filter);
            scope.grid = scope.buildGrid(graphData);
          }
        });
        
        scope.$on('lock-image', function(evt, data) {   
          var graph = scope.graph,
              lockedLayers = {};
          if (data.image) {
            for (var i=0; i < graph.length; i++) {
              if (data.image.name === graph[i].repo.name && data.image.tag === graph[i].repo.tag) {
                var layers = graph[i].layers;
                for (var l=0; l < layers.length; l++) {
                  lockedLayers[layers[l].id] = layers[l].id;
                }
                break;
              }
            }
          }
          
          angular.forEach(scope.grid, function(panel) {
            var layer = panel.layer;
            
            if (lockedLayers[layer.id] !== undefined) {
              panel.type = panel.type + ' locked';
            } else {
              panel.type = panel.type.replace('locked', '');
            }
          });
        });
      }
    };
  }]);
