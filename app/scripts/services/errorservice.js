(function() {
  'use strict';

  /**
   * @ngdoc service
   * @name iLayers.errorService
   * @description
   * # errorService
   * Factory in the iLayers.
   */
  angular.module('iLayers')
    .factory('errorService', ErrorService);

  ErrorService.$inject = ['$rootScope'];

  function ErrorService($rootScope) {
    var broadcastError = function(error) {
      $rootScope.$broadcast('notification', error);
    };

    return {
      error: function (msg) {
        console.log('Error: ', msg);
        broadcastError({ type: 'error', msg: msg });
      },
      notification: function(msg) {
        broadcastError({ type: 'notification', msg: msg }); 
      }
    };
  }
})();
