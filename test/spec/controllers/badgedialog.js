'use strict';

describe('Controller: BadgedialogCtrl', function () {

  // load the controller's module
  beforeEach(module('iLayers'));

  var controller,
    scope,
    graph;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
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
