'use strict';

/**
 * @ngdoc service
 * @name iLayers.errorInterceptor
 * @description
 * # errorInterceptor
 * Factory in the iLayers.
 */
angular.module('iLayers')
  .factory('errorInterceptor', ['$q', 'errorService', function ($q, errorService) {
    return {
      response: function(response) {
        return response;
      },
      responseError: function(response) {
        errorService.error('Unable to communicate to ImageLayers Services');
        return $q.reject(response);
      }
    };
  }]);