'use strict';

angular.module('iLayers')
  .controller('DashboardCtrl', ['$scope', '$routeParams', 'registryService', 'commandService',
      function($scope, $routeParams, registryService, commandService) {
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
          var searchTerms;
          
          if (route.images !== undefined) {
            $scope.loading = true;
            searchTerms = self.buildTerms(route.images);

            // Load Data
            registryService.inspect(searchTerms).then(function(response) {
              $scope.graph = response.data;
              $scope.loading = false;
            },function(){
              console.log('Error loading ImageLayers');
            });
          }
        };

        // Load data from RouteParams
        self.searchImages($routeParams);

        // public
        $scope.graph = [];
        
        $scope.filters =  {
          'image': ''
        };

        $scope.applyFilters = function(graphData, filter) {
          var filteredData = [],
              element = {},
              key = '',
              locked = commandService.locked();

          for (var i=0; i < graphData.length; i ++) {
            element = graphData[i].repo;
            key = element.name + ':' + element.tag
            if (key.lastIndexOf(filter) !== -1) {
              filteredData.push(graphData[i]);
            }
          }
          
          $scope.$evalAsync(function() { 
            commandService.release();
            commandService.lock(locked) 
          });
          
          return filteredData;
        };

        $scope.showCommands = function(repo) {
          var data = $scope.graph;

          for (var i=0; i < data.length; i++) {
            if (data[i].repo.name === repo.name && data[i].repo.tag === repo.tag) {
              commandService.highlight(data[i].layers);
              break;
            }
          }
        };
    }]
  );

