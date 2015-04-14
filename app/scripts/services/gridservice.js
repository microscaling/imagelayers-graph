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
            pIdx = findLayerIndex(layer.id, location.image.layers),
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
     
      var sortByLayerCohesion = function(groups, row) {
        var retval = [];
        
        angular.forEach(groups, function(group) {
          var set = [];
          
          angular.forEach(group, function(image) {
            // Go through all the columns in the group //
            for (var g=0; g < image.length; g++) {
              var col = image[g],
                  subject = {},
                  found = false;  
              
              if (set.length === 0) {
                set.push([col]);
              } else {
                subject = col[row];
                // look for match in temporary set
                for (var i=0; i < set.length; i++) {
                  if (subject.layer.id !== 'empty' 
                    && subject.layer.id === set[i][0][row].layer.id) 
                  {
                    set[i].push(col);
                    found = true;
                  }
                }
                if (!found) {
                  set.push([col]);
                }
              }
            }
          });     
          retval.push(set);
        });
        return retval;
      }
      
      var groupDependent = function(matrix) {
        var groups = [],
            merged = [],
            sets = [],
            rows = (groups.length >0) ? groups[0].length : 0;
        
        groups.push([]);
        groups[0].push(matrix);
        
        for (var row=0; row < 2; row++) {
          groups = sortByLayerCohesion(groups, row);
        }
        
        // merge groups
        sets = sets.concat.apply(sets, groups);
        merged = merged.concat.apply(merged, sets);
        
        return merged;
      }
      
      var buildMatrix = function(sortedImages) {
        for (var i=0; i < sortedImages.length; i++) {
          for (var j= sortedImages[i].layers.length-1; j >= 0; j--) {
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
            for (var l=grid.rows -1; l >= 0; l--) {
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
