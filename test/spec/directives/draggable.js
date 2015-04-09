'use strict';

describe('Directive: draggable', function () {

  // load the directive's module
  beforeEach(module('iLayers'));

  var directive, isoScope, element, main, footer, window;

  beforeEach(inject(function ($compile, $rootScope, $window) {
    var scope = $rootScope.$new(),
        elem = angular.element("<div><style>main { bottom: 0px; } footer { height: 0px; }</style><main></main><footer></footer><draggable></draggable></div>");

    window = $window;
    directive = $compile(elem)(scope);
    scope.$digest();
    element = elem.find('.draggable');
    main = elem.find('main');
    footer = elem.find('footer');
    isoScope = element.isolateScope();
  }));

  it('should add class "dragging" on mousedown', function() {
    expect(element.hasClass('dragging')).toBeFalsy();
    element.find('.drag-handle').triggerHandler('mousedown');
    expect(element.hasClass('dragging')).toBeTruthy();
  });

  it('should remove class "dragging" on mouseup', function() {
    element.addClass('dragging');
    $('body').triggerHandler('mouseup');
    expect(element.hasClass('dragging')).toBeFalsy();
  });

  describe('when mousemove', function() {
    beforeEach(function() {
      window.innerHeight = 1000;
      spyOn(isoScope, 'updatePosition');
    });

    it('should do nothing if not "dragging"', function() {
      $('body').triggerHandler({
        type : 'mousemove',
        pageX: 0,
        pageY: 500
      });

      expect(isoScope.updatePosition).not.toHaveBeenCalled();
    });

    it('should set main and footer size when "dragging"', function() {
      element.addClass('dragging');

      $('body').triggerHandler({
        type : 'mousemove',
        pageX: 0,
        pageY: 500
      });

      expect(isoScope.updatePosition).toHaveBeenCalledWith(500);
    });
  });
});
