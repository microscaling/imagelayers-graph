'use strict';

/**
 * @ngdoc function
 * @name iLayers.controller:BadgedialogCtrl
 * @description
 * # BadgedialogCtrl
 * Controller of the iLayers
 */
angular.module('iLayers')
  .controller('BadgeDialogCtrl', ['$scope', '$sce', 'registryService', function ($scope, $sce, registryService) {
    var constants = {
      termLimit: 2
    };

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

    $scope.suggestImages = function(term) {
      if (term.length > constants.termLimit) {
        $('.image-name').addClass('searching');

        return registryService.search(term).then(function(response) {
          var data = response.data.results,
            list = [],
            found = false;

          for (var i=0; i < data.length; i++) {
            list.push({ 'label': $sce.trustAsHtml(data[i].name), 'value': data[i].name});
            if (term === data[i].name) {
              found = true;
            }
          }

          $('.image-name').removeClass('searching');
          return list;
        });
      } else {
        return [];
      }
    };

    var attached = function() {
      $('.ac-container').css('top', '94px');
    };

    var selected = function(item) {
      console.log(item);
      $scope.selectedImage = {name: item.value};
      console.log($scope.selectedImage);
    };

    $scope.autocomplete_options = {
      'suggest': $scope.suggestImages,
      'on_error': console.log,
      'on_attach': attached,
      'on_select': selected
    };

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
