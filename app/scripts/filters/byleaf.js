'use strict';

/**
 * @ngdoc filter
 * @name iLayers.filter:byLeaf
 * @function
 * @description
 * # byLeaf
 * Filter in the iLayers.
 */
angular.module('iLayers')
  .filter('byLeaf', function () {
    return function (elements, param) {
      var results = [],
          phrase = (param) || '';

      if (elements === undefined || phrase === '') {
       return elements;
      };

      for (var i=0; i < elements.length; i++) {
        if (elements[i].name.lastIndexOf(phrase) !== -1) {
          results.push(elements[i]);
        }
      };
      return results;
    };
  });
