'use strict';

describe('Controller: BadgedialogCtrl', function () {

  // load the controller's module
  beforeEach(module('iLayers'));

  var controller,
    scope,
    graph,
    deferredSuccess,
    registryService;


    // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, _registryService_) {
    scope = $rootScope.$new();
    registryService = _registryService_;
    controller = $controller('BadgeDialogCtrl', {
      $scope: scope
    });
  }));

  describe('$scope.imageList', function () {
    beforeEach(function () {
      scope.graph = [
        {
          repo: {name: 'myRepo', tag: 'latest'}
        },
        {
          repo: {name: 'myOtherRepo', tag: 'latest'}
        }
      ]
    });

    it('should return a list of images', function () {
      var list = scope.imageList();
      expect(list.length).toEqual(2);
      expect(list[0].name).toEqual('myRepo');
      expect(list[1].name).toEqual('myOtherRepo');
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

    //describe('when image is not in results', function() {
    //  it('should set missing flag', function() {
    //    expect(scope.model.missing).toBeFalsy();
    //    deferredSuccess.resolve({ data: { results: [{ name: 'term/bar' },{ name: 'bar' }] } });
    //
    //    scope.suggestImages('term');
    //
    //    scope.$apply();
    //
    //    expect(scope.model.missing).toBeTruthy();
    //  });
    //});
  });

  describe('$scope.badgeAsHtml', function  () {
    it('should return an HTML embed code', function () {
      scope.selectedImage = { name: 'node' };
      var embedCode = scope.badgeAsHtml();
      expect(embedCode.$$unwrapTrustedValue()).toEqual("<a href='https://imagelayers.io/#/?images=node:latest' title='Get your own badge on imagelayers.io'><img src='https://badge.imagelayers.io/node.svg'></a>")
    });
  });

  describe('$scope.badgeAsMarkdown', function  () {
    it('should return an HTML embed code', function () {
      scope.selectedImage = { name: 'node' };
      var embedCode = scope.badgeAsMarkdown();
      expect(embedCode).toEqual("[![](https://badge.imagelayers.io/node.svg)](https://imagelayers.io/#/?images=node:latest) 'Get your own badge on imagelayers.io'")
    });
  });
});
