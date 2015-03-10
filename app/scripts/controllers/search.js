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

        $scope.searchList = [];

        $scope.showSearch = function() {
          $scope.searchList = [];
          ngDialog.open({
            template: 'views/searchDialog.html',
            className: 'ngdialog-theme-layers',
            controller: 'SearchCtrl' });
        };

        $scope.addRow = function() {
          var item = {
            'name': '',
            'tag': 'latest'
          };
          $scope.searchList.push(item);
        };

        $scope.closeDialog = function() {
          ngDialog.closeAll();
        };

        $scope.addImages = function() {
          $location.search('images', self.buildQueryParams($scope.searchList));
          ngDialog.closeAll();
        };
      }]);
