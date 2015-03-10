'use strict';

angular.module('iLayers')
  .factory('registryService', ['$http', 'ENV',
    function($http, ENV) {

      return {
          inspect: function (list) {
            return $http.post(ENV.apiEndpoint + '/registry/analyze', { 'repos': list });
          },
          search: function(name) {
            return $http.get(ENV.apiEndpoint + '/registry/search?name='+name);
          },
          fetchTags: function(name) {
            return $http.get(ENV.apiEndpoint + '/registry/images/'+name+'/tags');
          }
      };
  }]);
