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
      link: function(scope, element) {
        var constants = {
              offset: 41
            };

        var attached = function(element) {
          $('.ac-container').css('top', (element[0].offsetTop + constants.offset) + 'px');
        };

        var clearError = function() {
          element.find('.image-name').removeClass('not-found');
        };

        scope.suggestImages = function(term) {
          if (term.length > 2) {
            element.find('.image-name').addClass('searching');

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

        scope.tagList = [];

        scope.autocomplete_options = {
          'suggest': scope.suggestImages,
          'on_error': console.log,
          'on_attach': attached,
          'on_select': clearError
        };

        scope.$watch('model', function(newValue) {
          clearError();

          if (newValue !== undefined && newValue.name !== '') {
            registryService.fetchTags(newValue.name).then(function(response) {
              scope.tagList = [];

              if (response.data) {
                var data = Object.keys(response.data);
                for (var i=0; i < data.length; i++) {
                  scope.tagList.push(data[i]);
                  clearError();
                  newValue.found = true;
                }
              } else {
                 element.find('.image-name').addClass('not-found');
                 newValue.found = false;
              }
              element.find('.image-name').removeClass('searching');
            });
          }
        }, true);
      }
    };
  }]);
