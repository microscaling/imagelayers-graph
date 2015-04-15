'use strict';

angular.module('iLayers')
  .factory('registryService', ['$http', 'errorService', 'ENV',
    function($http, errorService, ENV) {

      return {
          inspect: function (list) {
            var promise = $http.post(ENV.apiEndpoint + '/registry/analyze', { 'repos': list }).then(function(response) {
              var images = response.data,
                  list = [],
                  missing = [];
              
              angular.forEach(images, function(image) {
                if (image.layers !== null) { 
                  image.layers = image.layers.reverse();
                  list.push(image);
                } else {
                  missing.push(image.repo.name + ':' + image.repo.tag);
                }
              });
              
              if (missing.length >0) {
                errorService.notification('The following images could not be found: ' + missing.join(' ')); 
              }
              
              response.data = list;
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
