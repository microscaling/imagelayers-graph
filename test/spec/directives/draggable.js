'use strict';

describe('Directive: draggable', function () {

  // load the directive's module
  beforeEach(module('iLayers'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<draggable></draggable>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the draggable directive');
  }));
});
