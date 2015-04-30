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
              offset: 41,
              termLimit: 2
            };

        var attached = function(element) {
          $('.ac-container').css('top', (element[0].offsetTop + constants.offset) + 'px');
        };

        var clearError = function() {
          delete scope.model.missing;
        };
        
        var loadTags = function() {
          clearError();
          element.find('.styled-select').addClass('searching');
          registryService.fetchTags(scope.model.name).then(function(response) {
            scope.tagList = [];

            if (response.data) {
              var data = Object.keys(response.data);
              for (var i=0; i < data.length; i++) {
                scope.tagList.push(data[i]);
                clearError();
                element.find('.styled-select').removeClass('searching');
              }
            } else {
               scope.model.missing = true;
            }
          });
        };

        scope.suggestImages = function(term) {
          if (term.length > constants.termLimit) {
            element.find('.image-name').addClass('searching');

            return registryService.search(term).then(function(response) {
              var data = response.data.results,
                  list = [],
                  found = false;
    
              for (var i=0; i < data.length; i++) {
                list.push({ 'label': $sce.trustAsHtml(data[i].name), 'value': data[i].name});
                if (term === data[i].name) {
                  found = true; 
                }
                clearError();
              }
              
              if (list.length === 0) {
                scope.model.missing = true;
              } 
              
              scope.model.missing = !found; 
              
              element.find('.image-name').removeClass('searching');
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
          'on_select': loadTags
        };
        
        scope.$watch('model', function(newValue, oldValue) {
          if (newValue !== undefined && angular.equals(newValue, oldValue) && newValue.name.length > constants.termLimit) {
            loadTags();
          }
        });
      }
    };
  }]);
