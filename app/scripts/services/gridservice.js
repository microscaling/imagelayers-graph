'use strict';

angular.module('iLayers')
  .factory('gridService', [
    function() {

      var inventory = {},
          matrix = {};

      var findLongest = function(images) {
        var max = 0;
        for (var i=0; i < images.length; i++) {
          max = Math.max(max, images[i].layers.length);
        }
        return max;
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
            parent = location.image.layers[location.row].parent;

        location.count = location.count + 1;
        matrix[col][location.row] = { 'type': 'box', 'layer': layer };
        if (parent !== '') {
          var l = inventory[parent];
          changeInventoryCounts(images,l.image.layers[l.row], col);
        }
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

        return images.sort(compare);
      };

      var buildMatrix = function(images) {
        var long = findLongest(images),
            sortedImages = sortImages(images);

        inventory = {};
        matrix = zeroMatrix(long, images.length);

        for (var i=0; i < sortedImages.length; i++) {
          for (var j=0; j < sortedImages[i].layers.length; j++) {
            var layer = sortedImages[i].layers[j];
           if (inventory[layer.id] !== undefined) {
              j = changeInventoryCounts(sortedImages, layer, i);
            } else {
              inventory[layer.id] = { 'image': sortedImages[i],  'row': j, 'count': 1 };
              matrix[i][j] = { 'layer': layer };

            }
          }
        }

        return {
          inventory: inventory,
          map: matrix
        };

      };

      return {
        buildGrid: function(images) {
          var grid = {
            rows: findLongest(images),
            cols: images.length,
            matrix: buildMatrix(images)
          };

          return grid;
        },

        inventory: function(id) {
          return inventory[id];
        },

        matrix: function() {
          return matrix;
        }
      };
  }]);
