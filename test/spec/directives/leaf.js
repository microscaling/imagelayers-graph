'use strict';

describe('Directive: leaf', function () {

  // load the directive's module
  beforeEach(module('iLayers'));
    // Load the templates
  beforeEach(module('views/leaf.html'));

   var directive, scope, controller, commandService, location;

  beforeEach(inject(function ($compile, $rootScope, $location, _commandService_) {
    var elem = angular.element("<leaf></leaf>");
    commandService = _commandService_;
    location = $location;
    scope = $rootScope.$new();
    scope.graph = [];
    directive = $compile(elem)(scope);
    scope.$digest();
    controller = elem.controller('leaf');
  }));

  describe('showCommands', function() {
    beforeEach(function() {
      scope.graph = [{ 'repo': { 'name': 'foo', 'tag': 'do'}, layers: ['one', 'two'] }];
      spyOn(commandService, 'highlight');
    });

    it('should send all layers to commandService.highlight', function() {
      var repo = { 'name': 'foo', 'tag': 'do'};
      scope.showCommands(repo);
      expect(commandService.highlight).toHaveBeenCalledWith(['one','two']);
    });

    it('should not call commandService if no image matches', function() {
      var repo = { 'name': 'boo', 'tag': 'hoo'};
      scope.showCommands(repo);
      expect(commandService.highlight).not.toHaveBeenCalled();
    });
  });
});
