'use strict';

/**
 * @ngdoc function
 * @name iLayers.controller:BadgedialogCtrl
 * @description
 * # BadgedialogCtrl
 * Controller of the iLayers
 */
angular.module('iLayers')
  .controller('BadgeDialogCtrl', BadgeDialogCtrl);

BadgeDialogCtrl.$inject = ['$scope', '$sce']; 
                                  
function BadgeDialogCtrl($scope, $sce, registryService) {
  $scope.selectedImage = {};

  $scope.imageList = function() {
    var data = $scope.graph,
        images = {};

    angular.forEach(data, function(image) {
      images[image.repo.name] = image.repo;
    });

    return Object.keys(images).map(function(key){return images[key]})
  };

  $scope.$watch('selectedWorkflow', function() {
    $scope.selectedImage = {};
  });

  $scope.$watch('selectedImage', function() {
    var image = $scope.selectedImage;

    if ($scope.selectedWorkflow === 'imagelayers' && image.name) {
      $scope.selectedImage.selected = true; 
    }

    if ($scope.selectedWorkflow === 'hub' 
        && (image.missing || (image.name && image.name.length < 3))) {
       $scope.selectedImage.selected = false; 
    }

    $scope.htmlCopied = false;
    $scope.markdownCopied = false;
  }, true);

  $scope.badgeAsHtml = function () {
    if ($scope.selectedImage == undefined) return "";
    return $sce.trustAsHtml("<a href='https://imagelayers.io/?images=" + $scope.selectedImage.name + ":latest' title='Get your own badge on imagelayers.io'>" +
    "<img src='https://badge.imagelayers.io/" + $scope.selectedImage.name + ".svg'></a>")
  };

  $scope.badgeAsMarkdown = function () {
    if ($scope.selectedImage == undefined) return "";
    return "[![](https://badge.imagelayers.io/" + $scope.selectedImage.name + ".svg)]" +
      "(https://imagelayers.io/?images=" + $scope.selectedImage.name + ":latest 'Get your own badge on imagelayers.io')";
  };
};

