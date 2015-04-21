'use strict';

describe('Directive: leaf', function () {

  // load the directive's module
  beforeEach(module('iLayers'));
    // Load the templates
  beforeEach(module('views/leaf.html'));

   var directive, scope, controller, commandService, location, repo, elem;

  beforeEach(inject(function ($compile, $rootScope, $location, _commandService_) {
    elem = angular.element("<leaf></leaf>");
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
      repo = { 'name': 'foo', 'tag': 'do'};
      scope.showCommands(repo);
      expect(commandService.highlight).toHaveBeenCalledWith(['one','two'], undefined);
    });

    it('should not call commandService if no image matches', function() {
      var repo = { 'name': 'boo', 'tag': 'hoo'};
      scope.showCommands(repo);
      expect(commandService.highlight).not.toHaveBeenCalled();
    });
  });
  
  describe('applyLock', function() {
    beforeEach(function() {
      spyOn(commandService, 'release');
      repo = { identity: 'foo' };
    });
    
    describe('when locking', function() {
      beforeEach(function() {
        spyOn(commandService, 'lock').and.returnValue(undefined);
      });
      
      it('sets lockParam', function() {
        scope.applyLock(repo);
        expect(scope.lockParam).toBeTruthy();
      });
      
      it('calls release on commandService', function() {
        scope.applyLock(repo);
        expect(commandService.release).toHaveBeenCalled();
      });
      
      it('calls lock on commandService', function() {
        scope.applyLock(repo);
        expect(commandService.lock).toHaveBeenCalledWith(repo);
      });
    })
    
    describe('when unlocking', function() {
      beforeEach(function() {
        elem.addClass('locked');
        spyOn(commandService, 'lock').and.returnValue(repo);
      });
      
      it('should call commandService.release', function() {
        scope.applyLock(repo);
        expect(commandService.release).toHaveBeenCalled();
      });
    });
    
  });
});
