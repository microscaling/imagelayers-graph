'use strict';

angular.module ('iLayers')
  .directive('imageSearch', ['$sce', 'registryService',
    function($sce, registryService) {

    return {
      restrict: 'A',
      scope: {
        model: '='
      },
      templateUrl: 'views/imageSearch.html',
      controller: function($scope) {
        var self = this,
            constants = {
              offset: 41
            };

        self.suggestImages = function(term) {
          if (term.length > 2) {
            return registryService.search(term).then(function(response){
              var data = response.data.results,
                  list = [];

              for (var i=0; i < data.length; i++) {
                list.push({ 'label': $sce.trustAsHtml(data[i].name), 'value': data[i].name});
              }

              return list;
            });
          } else {
             return [];
          }

        };

        self.attached = function(element) {
          $('.ac-container').css('top', (element[0].offsetTop + constants.offset) + 'px');
        };

        self.selectImage = function(selected) {
          registryService.fetchTags(selected.value).then(function(response) {
            var data = Object.keys(response.data);

            $scope.tagList = [];
            for (var i=0; i < data.length; i++) {
              $scope.tagList.push(data[i]);
            }
          });
        };

        $scope.tagList = [];

        $scope.autocomplete_options = {
          'suggest': self.suggestImages,
          'on_error': console.log,
          'on_attach': self.attached,
          'on_select': self.selectImage
        };

      }
    };
  }]);
