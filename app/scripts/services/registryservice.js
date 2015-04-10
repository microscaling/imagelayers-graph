'use strict';

angular.module('iLayers')
  .factory('registryService', ['$http', 'ENV',
    function($http, ENV) {

      return {
          inspect: function (list) {
            var promise = $http.post(ENV.apiEndpoint + '/registry/analyze', { 'repos': list }).then(function(response) {
              var images = response.data;
              angular.forEach(images, function(image) {
                image.layers = image.layers.reverse();
              });

              response.data = images;
              return response;
            });

            return promise;
          },
          search: function(name) {
            return $http.get(ENV.apiEndpoint + '/registry/search?name='+name);
          },
          fetchTags: function(name) {
            return $http.get(ENV.apiEndpoint + '/registry/images/'+name+'/tags');
          }
      };
  }]);
