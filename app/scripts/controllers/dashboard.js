'use strict';

angular.module('iLayers')
  .controller('DashboardCtrl', ['$scope', '$routeParams', 'registryService',
      function($scope, $routeParams, registryService) {
        var self = this;
        $scope.loading = false;

        //private
        self.buildTerms = function(data) {
          var terms = data.split(','),
              searchTerms = [];

          for (var i=0; i < terms.length; i++) {
            var name = terms[i].split(':')[0],
                tag = 'latest';
            if (terms[i].lastIndexOf(':') !== -1) {
              tag = terms[i].split(':')[1];
            }
            searchTerms.push({
              'name': name.trim(),
              'tag': tag
            });
          }

          return searchTerms;
        };

        self.searchImages = function(route) {

          if (route.images !== undefined) {
            $scope.loading = true;
            var searchTerms = self.buildTerms(route.images);

            // Load Data
            registryService.inspect(searchTerms).then(function(response){
              $scope.graph = response.data;
              $scope.loading = false;
            },function(){
              console.log('Error loading ImageLayers');
            });
          }
        };

        // public
        $scope.graph = [];

        $scope.filters =  {
          'image': ''
        };

        // Load data from RouteParams
        self.searchImages($routeParams);
    }]);

