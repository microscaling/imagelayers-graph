(function() {
  'use strict';

  /**
   * @ngdoc directive
   * @name iLayers.directive:about
   * @description
   * # about
   */
  angular.module('iLayers')
    .directive('about', About);

  About.$inject = ['$timeout', '$templateRequest'];

  function About($timeout, $templateRequest) {
    return {
      restrict: 'A',
      scope: {},
      controller: function() {
        $templateRequest('views/about-menu.html');
      },
      link: function postLink(scope, element) {
        var main = element.closest('main'),
            headerHeight = $('header').height(),
            html = $('html');
        
        scope.menuVisible = false;

        scope.toggleMenu = function(aboutMenu) {
          aboutMenu.slideToggle();
          scope.menuVisible = !scope.menuVisible;
        };

        element.bind('click', function(e) {
          e.stopPropagation();
          var aboutMenu = $('div.about');
          scope.toggleMenu(aboutMenu);
        });

        html.bind('click', function(e) {
          var aboutMenu = $('div.about');

          if (scope.menuVisible && !aboutMenu.is(e.target) && aboutMenu.has(e.target).length === 0) {
            aboutMenu.slideUp();
            scope.menuVisible = !scope.menuVisible;
          }
        });

          main.bind('scroll', function () {
          if (scope.menuVisible) {
            if (headerHeight*3 < $('main').scrollTop()) {
              var aboutMenu = $('div.about');
              scope.toggleMenu(aboutMenu);
            }
          }
        })
      }
    };
  }
})();
