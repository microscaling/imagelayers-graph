'use strict';

describe('Directive: imageSearch', function () {
  // load the directive's module
  beforeEach(module('iLayers'));
  // Load the templates
  beforeEach(module('views/imageSearch.html'));

  var element,
      controller,
      directive,
      registryService,
      scope;

  beforeEach(inject(function ($compile, $rootScope, _registryService_) {
    var rootScope = $rootScope.$new(),
        autoElem = autoElem = angular.element("<div mass-autocomplete><section image-search model='model'></section></div>");

    rootScope.model = {'name': 'foo', 'tag': '1.0.0'};
    directive = $compile(autoElem)(rootScope);
    rootScope.$digest();

    element = autoElem.find('[image-search]');
    scope = element.isolateScope();
    controller = element.controller('imageSearch');

    registryService = _registryService_;
  }));

  it('should initialize tagList', function() {
    expect(scope.tagList.length).toEqual(0);
  });

  it('should initialize autocomplete_options', function() {
    expect(scope.autocomplete_options).toEqual(
      {
        'suggest': jasmine.any(Function),
        'on_error': jasmine.any(Function),
        'on_attach': jasmine.any(Function),
        'on_select': jasmine.any(Function)
      });
  });

  describe('suggestImages', function() {
    beforeEach(inject(function($q) {
      deferredSuccess = $q.defer();
      spyOn(registryService, 'search').and.returnValue(deferredSuccess.promise);
      deferredSuccess.resolve({ data: { results: [{ name: 'foo' },{ name: 'bar' }] } });
    }));

    it('should return empty array when term size < 3', function() {
      var list = controller.suggestImages('me');
      expect(list.length).toEqual(0);
    });

    it('calls registryService.search when term > 2', function() {
      var list = controller.suggestImages('term');
      expect(registryService.search).toHaveBeenCalledWith('term');
    });
  });

  describe('selectImage', function() {
    beforeEach(inject(function($q) {
      deferredSuccess = $q.defer();
      spyOn(registryService, 'fetchTags').and.returnValue(deferredSuccess.promise);
      deferredSuccess.resolve({ data: { 'foo': '123',  'bar': '456' } });
    }));

    it('calls registryService.fetchTags', function() {
      var result = controller.selectImage({ value: 'foo' });
      expect(registryService.fetchTags).toHaveBeenCalledWith('foo');
    });
  });
});
