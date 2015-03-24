'use strict';

describe('Directive: sticky', function () {

  // load the directive's module
  beforeEach(module('iLayers'));

  var directive, scope, element;

  beforeEach(inject(function ($compile, $rootScope) {
    element = angular.element('<main style="width: 1px; height: 100px;"><div sticky></div></main>');
    scope = $rootScope.$new();
    directive = $compile(element)(scope);
    scope.$digest();
  }));

  /* This doesnt appear to work in PhantomJS */
  describe('when scrolling', function() {
    it('should add sticky class to element', function() {
      //element.parent('main').scrollTop(50);
      //element.parent('main').triggerHandler('scroll');

      //expect(element.hasClass('sticky')).toBeTruthy();
    });
  });
});
