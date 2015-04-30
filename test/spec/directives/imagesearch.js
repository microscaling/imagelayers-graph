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
      deferredTag,
      deferredSuccess,
      rootScope,
      scope;

  beforeEach(inject(function ($q, $compile, $rootScope, _registryService_) {
    var autoElem = angular.element("<div mass-autocomplete><section image-search model='model'></section></div>");

    rootScope = $rootScope.$new();

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
      scope.model = { name: 'test' };
    }));

    it('should return empty array when term size < 3', function() {
      var list = scope.suggestImages('me');
      expect(list.length).toEqual(0);
    });

    it('calls registryService.search when term > 2', function() {
      deferredSuccess.resolve({ data: { results: [{ name: 'foo' },{ name: 'bar' }] } });

      var list = scope.suggestImages('term');
      expect(registryService.search).toHaveBeenCalledWith('term');
    });

    describe('when image is valid', function() {
      it('should remove missing', function() {
        deferredSuccess.resolve({ data: { results: [{ name: 'foo' },{ name: 'bar' }] } });

        scope.suggestImages('xtermx');

        scope.$apply();

        expect(scope.model.missing).toBe(true);
      });
    });

    describe('when image is not in results', function() {
      it('should set missing flag', function() {
        expect(scope.model.missing).toBeFalsy();
        deferredSuccess.resolve({ data: { results: [{ name: 'term/bar' },{ name: 'bar' }] } });

        scope.suggestImages('term');

        scope.$apply();

        expect(scope.model.missing).toBeTruthy();
      });
    });
  });

  describe('$watch model', function() {
    it('should fetchTags when model intially loaded', inject(function($q) {
      var deferredTag = $q.defer();
      spyOn(registryService, 'fetchTags').and.returnValue(deferredTag.promise);
      deferredTag.resolve({});

      scope.model = { name: 'blah' };
      scope.$digest();
      scope.model = { name: 'blah' };
      scope.$digest();
      expect(registryService.fetchTags).toHaveBeenCalled();
    }));
  });
});
