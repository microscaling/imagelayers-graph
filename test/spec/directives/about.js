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
  
  describe('scope.showMenu', function() {    
    describe('when menu is not visible', function() {
      beforeEach(function() {
        scope.menuVisible = false; 
      });
      
      it('should bind events to menu', function() {
        spyOn(scope, 'bindEvents');
        scope.showMenu(menu);
        
        expect(scope.bindEvents).toHaveBeenCalled();
      });
      
      it('should call animate', function() {
        spyOn(menu, 'animate');
        scope.showMenu(menu);
        
        expect(menu.animate).toHaveBeenCalled();
      });
    });
  });
  
  describe('scope.hideMenu', function() {
    describe('when menu is visible and not active', function() {
      beforeEach(function() {
        scope.menuVisible = true;
        scope.menuActive = false;
      });
      
      it('should unbind events', function() {
        spyOn(scope, 'unbindEvents');
        scope.hideMenu(menu);
      
        expect(scope.unbindEvents).toHaveBeenCalled();
      });
      
      it('should call animate', function() {
        spyOn(menu, 'animate');
        scope.hideMenu(menu);
        
        expect(menu.animate).toHaveBeenCalled();
      });
    });
  });
  
  describe('when mouseover', function() {
    it('should call showMenu', function() {
      spyOn(scope, 'showMenu');
      elem.trigger('mouseover');
      
      expect(scope.showMenu).toHaveBeenCalled();
    });
  });
  
  describe('when mouseleave', function() {
    it('should call hideMenu', inject(function($timeout) {
      spyOn(scope, 'hideMenu');
      elem.trigger('mouseleave');
      
      $timeout.flush();
      expect(scope.hideMenu).toHaveBeenCalled();
    }));
  });
});
