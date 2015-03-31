'use strict';

angular.module('iLayers')
  .factory('gridService', [
    function() {

      var inventory = {},
          matrix = {};

      var findLongest = function(sortedImages) {
        if (sortedImages.length === 0) {
          return 0;
        }
        return sortedImages[0].layers.length;
      };

      var findLayerIndex = function(layerId, layers) {
        var idx = -1;

        for (var i = 0; i < layers.length; i++) {
          if (layers[i].id === layerId) {
            idx = i;
          }
        }

        return idx;
      };

      var zeroMatrix = function(rows, cols) {
        var m = [];

        for(var i=0; i < cols; i++) {
          m[i] = new Array(rows);
          for (var r=0; r < rows; r++) {
            m[i][r] = {
              'layer': {
                'id': 'empty'
              }
            };
          }
        }

        return m;
      };

      var changeInventoryCounts = function(images, layer, col) {
        var location = inventory[layer.id],
            pIdx = findLayerIndex(layer.id, location.image.layers);
            parent = (pIdx !== -1) ? location.image.layers[pIdx].parent : '';

        location.count = location.count + 1;
        matrix[col][location.row] = { 'type': 'box', 'layer': layer };
        if (parent !== '') {
          var l = inventory[parent],
              idx = findLayerIndex(parent, l.image.layers);

          if (idx !== -1) {
            changeInventoryCounts(images,l.image.layers[idx], col);
          }
        }
      };

      var initializeInventory = function(list) {
        var inv = {},
            images = sortImages(list).reverse();

        for (var i=0; i < images.length; i++) {
          for (var l=0; l < images[i].layers.length; l++) {
            var layer = images[i].layers[l];
            if (inv[layer.id] === undefined) {
              inv[layer.id] = { 'image': images[i],  'row': 0, 'count': 0 };
            }
          }
        }

        return inv;
      };

      var sortImages = function(images) {
        var compare = function(a,b) {

        if (a.layers.length < b.layers.length) {
             return 1;
          }
          if (a.layers.length > b.layers.length) {
            return -1;
          }
          return 0;
        };

        if (images.length !== 0) {
          return images.sort(compare);
        } else {
          return images;
        }
      };

      var sortGroupCohesion = function(group) {
        var cohesion = [],
            result = [],
            subject = {},
            copy = [],
            tmp = {},
            rows = group[0].length - 1,
            compare = function(a,b) {
              if (a.str < b.str) {
                   return 1;
                }
                if (a.str > b.str) {
                  return -1;
                }
              return 0;
            };

        angular.forEach(group, function(col) {
          cohesion.push({ 'column' : col, 'str': 0});
        });

        for (var r = 0; r < rows; r++) {
          for (var c=0; c < cohesion.length; c++) {
            copy = [];
            angular.forEach(cohesion, function(col, idx) {
              if (idx === c) {
                tmp = col;
              } else {
                copy.push(col);
              }
            });

            subject = tmp.column[rows - r];
            if (subject.layer.id !== 'empty') {
              angular.forEach(copy, function(col) {
                if (col.column[rows-r].layer.id === subject.layer.id) {
                  cohesion[c].str = r;
                }
              });
            }
          }
        }
        cohesion = cohesion.sort(compare);

        angular.forEach(cohesion, function(col) {
          result.push(col.column);
        });

        return result;
      };

      var groupShuffle = function(groups, column) {
        var group = {},
            found = false,
            subject = {};

        if (groups.length === 0) {
          groups.push([column]);
        } else {
          for (var g =0; g < groups.length; g++) {
            found = false;
            group = groups[g];

            for (var row = 0; row < column.length; row++) {
              subject = column[row];

              if (subject.layer.id !== 'empty' && subject.layer.id === group[0][row].layer.id) {
                group.push(column);
                found = true;
                break;
              }
            }

            if (found) {
              break;
            } else {
              groups.push([column]);
            }
          }
        }
      };

      var groupDependent = function(matrix) {
        var groups = [],
            merged = [];

        angular.forEach(matrix, function(column) {
          groupShuffle(groups, column);
        });

        for(var g=0; g < groups.length; g++) {
          groups[g] = sortGroupCohesion(groups[g]);
        }

        // merge groups
        merged = merged.concat.apply(merged, groups);
        return merged;

      };

      var buildMatrix = function(sortedImages) {
        for (var i=0; i < sortedImages.length; i++) {
          for (var j=0; j < sortedImages[i].layers.length; j++) {
            var layer = sortedImages[i].layers[j];

            if (inventory[layer.id].count > 0) {
              j = changeInventoryCounts(sortedImages, layer, i);
            } else {
              inventory[layer.id].row = j;
              inventory[layer.id].count = 1;
              matrix[i][j] = { 'layer': layer };
            }
          }
        }

        return {
          inventory: inventory,
          map: groupDependent(matrix)
        };

      };

      return {
        buildGrid: function(images) {
          var sortedImages = [],
              sanitizedList = [],
              long = 0;

          angular.forEach(images, function(image) {
            if (image.layers.length > 0) {
              sanitizedList.push(image);
            }
          });

          inventory = initializeInventory(sanitizedList);
          sortedImages = sortImages(sanitizedList);

          long = findLongest(sortedImages);
          matrix = zeroMatrix(long, sortedImages.length);

          return {
            rows: findLongest(sortedImages),
            cols: sanitizedList.length,
            matrix: buildMatrix(sortedImages)
          };
        },

        inventory: function(id) {
          return inventory[id];
        },

        matrix: function() {
          return matrix;
        },

        findLeaves: function(grid) {
          var leaves = [];

          for (var c=0; c < grid.cols; c++) {
            for (var l=0; l < grid.rows; l++) {
              var id = grid.matrix.map[c][l].layer.id,
                  repo = {};

              if (id !== 'empty') {
                angular.copy(grid.matrix.inventory[id].image.repo, repo);
                repo.identity = repo.name + '::' + repo.tag + Math.floor(Math.random() * 10000);
                leaves.push(repo);
                break;
              }
            }
          }

          return leaves;
        }
      };
  }]);
