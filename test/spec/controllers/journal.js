'use strict';

describe('Controller: JournalCtrl', function () {

  // load the controller's module
  beforeEach(module('iLayers'));

  var JournalCtrl, scope, data;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    JournalCtrl = $controller('JournalCtrl', {
      $scope: scope
    });
  }));

  describe('when image is not locked', function() {
    beforeEach(function() {
      scope.lockedImage = undefined;
      data = ['one']
    });  
    
    it('should set $scope.commands', function() {
      scope.$broadcast('command-change', { commands: data });
      expect(scope.commands.length).toEqual(1);
      expect(scope.commands[0]).toEqual('one');
    })
    
  });
  
  describe('when image is locked', function() {
    beforeEach(function() {
      scope.lockedImage = 'locked';
      scope.commands = ['foo', 'bar'];
    }); 
    
    it('should not change $scope.commands', function() {
      scope.$broadcast('command-change', { commands: data });
      expect(scope.commands.length).toEqual(2);
      expect(scope.commands[0]).toEqual('foo');
    });
  });
});
