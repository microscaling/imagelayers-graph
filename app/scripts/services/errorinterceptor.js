(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name iLayers.errorInterceptor
   * @description
   * # errorInterceptor
   * Factory in the iLayers.
   */
  angular.module('iLayers')
    .factory('errorInterceptor', ErrorInterceptor);

  ErrorInterceptor.$inject = ['$q', 'errorService'];

  function ErrorInterceptor($q, errorService) {
    return {
      response: function(response) {
        return response;
      },
      responseError: function(response) {
        var msg = 'Unable to communicate to ImageLayers Services';

        if (response.data) {
          msg = response.data; 
        }
        errorService.error(msg);
        return $q.reject(response);
      }
    };
  }
})();