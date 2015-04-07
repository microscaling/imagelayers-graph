'use strict';

describe('Directive: resetField', function () {
 // load the directive's module
  beforeEach(module('iLayers'));

   var directive, scope, elem, btn;

  beforeEach(inject(function ($compile, $rootScope) {
    var tmpl = angular.element("<div><input type='text' ng-model='filter' reset-field></div>");
    scope = $rootScope.$new();
    scope.filter = "";
    scope.graph = [];
    directive = $compile(tmpl)(scope);
    scope.$digest();
    elem = tmpl.find('input');
    btn = tmpl.find('.reset-icon');
  }));

  describe('compiling the directive', function()
           {
    it('should throw an error if a model is absent', function() {
      function template() {
        return $compile('<input type="text" reset-field />')(scope);
      }
      expect(template).toThrow();
    });
  });

  it('should show the icon when the field has a value', function() {
    expect(btn.hasClass('hidden')).toBeTruthy();
    elem.val('test');
    elem.triggerHandler('focus');
    expect(btn.hasClass('hidden')).toBeFalsy();
  });

  it('should hide the icon when the field is empty', function() {
    elem.val('');
    elem.triggerHandler('focus');
    expect(btn.hasClass('hidden')).toBeTruthy();

  });

  it('should clear the field when clicked', function() {
    elem.val('testing');
    btn.click();
    expect(elem.val() === '').toBeTruthy();
  });
});
