'use strict';

angular.module('iLayers')
  .controller('SearchCtrl', ['$scope', '$location', 'ngDialog',
      function($scope, $location, ngDialog) {
        var self = this;

        self.buildQueryParams = function(list) {
          var params = [];
          for (var i=0; i < list.length; i++) {
            if (list[i].tag === '') {
              params.push(list[i].name);
            } else {
              params.push(list[i].name + ':' + list[i].tag);
            }
          }

          return params.join(',');
        };

        self.populateSearch = function() {
           var terms = $location.search(),
               searchList = [];
           if (terms.images) {
               var images = terms.images.split(',');
               angular.forEach(images, function(value, idx) {
                 var parts = value.split(':'),
                     tag = 'latest';
                 if (parts.length === 2) {
                    tag = parts[1];
                 }
                 searchList.push(self.makeImage(parts[0], tag));
               });
           } else {
              searchList.push(self.makeImage('', 'latest'));
           }

           return searchList;
        };

        self.makeImage = function(name, tag) {
             return {
            'name': name,
            'tag': tag
          };
        };

        $scope.searchList = self.populateSearch();

        $scope.showSearch = function() {
          ngDialog.open({
            closeByDocument: false,
            template: 'views/searchDialog.html',
            className: 'ngdialog-theme-layers',
            controller: 'SearchCtrl' });
        };

        $scope.addRow = function() {
          $scope.searchList.push(self.makeImage('', 'latest'));
        };

        $scope.closeDialog = function() {
          ngDialog.closeAll();
        };

        $scope.addImages = function() {
          var sanitizedList = [];

          angular.forEach($scope.searchList, function(value) {
            if (value.name !== '') {
              this.push(value);
            }
          }, sanitizedList);

          $location.search('images', self.buildQueryParams(sanitizedList));
          $scope.closeDialog();
        };

        $scope.removeImage = function(index) {
          $scope.searchList.splice(index,1);
        }
      }]);
