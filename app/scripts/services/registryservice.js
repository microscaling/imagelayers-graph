(function() {
  'use strict';

  angular.module('iLayers')
    .factory('registryService', RegistryService);

  RegistryService.$inject = ['$http', '$q', 'errorService', 'ENV'];

  function RegistryService($http, $q, errorService, ENV) {

    function retryQuery(queryFn, maxRetry) {
      var callResults = $q.defer(),
          count = 1;

      function doCall() {
        queryFn().then(
          function(response) {
            callResults.resolve(response);
          },
          function(response) {
            if (count < maxRetry) {
              count++;
              // Backoff timer 0 - 750ms 
              setTimeout(doCall, (750 * Math.random()));
            } else {
              response.retryLimit = true;
              callResults.reject(response);
            }
        }); 
      }

      doCall();
      return callResults.promise;
    }

    return {
      inspect: function (list) {
        function doInspection() {
          return $http.post((ENV.apiEndpoint || '') + '/registry/analyze', { 'repos': list })
            .then(function(response) {
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
        }

        return retryQuery(doInspection, 3);
      },
      search: function(name) {
        return retryQuery(function() {
          return $http.get((ENV.apiEndpoint || '') + '/registry/search?name='+name);
        }, 3);
      },
      fetchTags: function(name) {
        return retryQuery(function() {
          return $http.get((ENV.apiEndpoint || '') + '/registry/images/'+name+'/tags');
        }, 3);
      }
    };
  }
})();
