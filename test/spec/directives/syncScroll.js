'use strict';

describe('Directive: syncScroll', function () {

  // load the directive's module
  beforeEach(module('iLayers'));

  var directive, scope, element;

  beforeEach(inject(function ($compile, $rootScope) {
    element = angular.element('<main style="width: 1px; height: 100px;"><div class="graph"><div class="test" sync-scroll sync-target=".graph" offset="10"></div></div></main>');
    scope = $rootScope.$new();
    directive = $compile(element)(scope);
    scope.$digest();
  }));

  /* This doesn't appear to work in PhantomJS */
  describe('when scrolling', function() {
    it('should add sync-scroll class to element', function() {
      //element.scrollTop(50);
      //element.find('.graph').scrollLeft(50);
      //element.parent('main').triggerHandler('scroll');
      //expect(element.find('.test').css('left')).toEqual(50);
    });
  });
});
