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
            parent = (location.image.layers[location.row]) ? location.image.layers[location.row].parent : '';

        location.count = location.count + 1;
        matrix[col][location.row] = { 'type': 'box', 'layer': layer };
        if (parent !== '') {
          var l = inventory[parent];
          changeInventoryCounts(images,l.image.layers[l.row], col);
        }
      };

      var initializeInventory = function(images) {
        var inv = {};

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

      var groupDependent = function(matrix) {
        var dependent = [],
            independent = [];

        for (var col=0; col < matrix.length; col++) {
          var isDependent = false;
          for (var l=0; l < matrix[col].length; l++) {
            var elem = matrix[col][l];
            if (inventory[elem.layer.id] && inventory[elem.layer.id].count > 1) {
              isDependent = true;
              break;
            }
          }
          if (isDependent) {
            dependent.push(matrix[col]);
          } else {
            independent.push(matrix[col]);
          }
        }

        return dependent.concat(independent);
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
              long = 0;

          inventory = initializeInventory(images);
          sortedImages = sortImages(images);
          long = findLongest(sortedImages),
          matrix = zeroMatrix(long, sortedImages.length);

          return {
            rows: findLongest(sortedImages),
            cols: images.length,
            matrix: buildMatrix(sortedImages)
          }
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
                  repo = null;
              if (id !== 'empty') {
                repo = grid.matrix.inventory[id].image.repo;
                repo.identity = repo.name + '::' + repo.tag;
                leaves.push(repo);
                break;
              }
            }
          }

          return leaves;
        }
      };
  }]);
