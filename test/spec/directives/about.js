'use strict';

describe('Directive: about', function () {

  // load the directive's module
  beforeEach(module('iLayers'));
  // Load the templates
  beforeEach(module('views/about-menu.html'));

  var directive, scope, controller, elem, menu;

  beforeEach(inject(function ($compile, $rootScope) {
    var rootScope = $rootScope.$new();
    elem = angular.element("<div about></div><ul class='about'></ul>");


    directive = $compile(elem)(rootScope);
    rootScope.$digest();
    controller = elem.controller('about');
    scope = elem.isolateScope();
    menu = $('ul.about');
  }));

  describe('scope.toggleMenu', function() {
    describe('when menu is visible and not active', function() {
      beforeEach(function() {
        scope.menuVisible = true;
      });

      it('should call slideToggle', function() {
        spyOn(menu, 'slideToggle');
        scope.toggleMenu(menu);

        expect(menu.slideToggle).toHaveBeenCalled();
      });
    });
  });
});
