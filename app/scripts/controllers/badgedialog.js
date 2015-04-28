'use strict';

/**
 * @ngdoc function
 * @name iLayers.controller:BadgedialogCtrl
 * @description
 * # BadgedialogCtrl
 * Controller of the iLayers
 */
angular.module('iLayers')
  .controller('BadgeDialogCtrl', ['$scope', '$sce', function ($scope, $sce) {
      $scope.selectedImage;


      $scope.imageList = function() {
        var data = $scope.graph,
            images = {};
        
        angular.forEach(data, function(image) {  
          images[image.repo.name] = image.repo;
        });

        return Object.keys(images).map(function(key){return images[key]})
      };

      $scope.$watch('selectedWorkflow', function() {
        $scope.selectedImage = '';
      });

      $scope.$watch('selectedImage', function() {
        $scope.htmlCopied = false;
        $scope.markdownCopied = false;
      });

      $scope.badgeAsHtml = function () {
        if ($scope.selectedImage == undefined) return "";
        return $sce.trustAsHtml("<a href='https://imagelayers.io/#/?images=" + $scope.selectedImage.name + ":latest' title='Get your own badge on imagelayers.io'>" +
        "<img src='https://badge.imagelayers.io/" + $scope.selectedImage.name + ".svg'></a>")
      };

      $scope.badgeAsMarkdown = function () {
        if ($scope.selectedImage == undefined) return "";
        return "[![](https://badge.imagelayers.io/" + $scope.selectedImage.name + ".svg)]" +
          "(https://imagelayers.io/#/?images=" + $scope.selectedImage.name + ":latest) 'Get your own badge on imagelayers.io'";
      };
  }]);
