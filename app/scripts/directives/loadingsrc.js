'use strict';

/**
 * @ngdoc directive
 * @name iLayers.directive:loadingSrc
 * @description
 * # loadingSrc
 */
angular.module('iLayers')
  .directive('loadingSrc', LoadingSrc);

LoadingSrc.$inject = ['errorService'];

function LoadingSrc(errorService) {
  return {
    restrict: 'A',
    link: function postLink(scope, element, attrs) {
      var img = new Image();

      element[0].src = (attrs.loading) ? attrs.loading : '/images/loading.gif';

      img.onload = function() { 
        element[0].src = img.src;
      };

      img.onerror = function(e) {
        errorService.notification('Unable to load badge.');
      };

      img.src = attrs.loadingSrc;
    }
  };
};
