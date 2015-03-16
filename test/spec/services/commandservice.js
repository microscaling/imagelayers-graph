describe('Command Service', function() {
  // Load the module
  beforeEach(module('iLayers'));

  var service, rootScope;

  beforeEach(inject(function ($rootScope, _commandService_) {
    service = _commandService_;
    rootScope = $rootScope;
    spyOn(rootScope, '$broadcast');
  }));

  describe('highlight', function() {
    it('should broadcast "command-change" event with commands', function() {
      service.highlight([{container_config: { Cmd: ['one', 'two']}}]);
      expect(rootScope.$broadcast)
        .toHaveBeenCalledWith('command-change', {'commands': ['RUN two']});
    });
  });

  describe('clear', function() {
    it('should broadcast "command-change" event with no commands', function() {
      service.clear();
      expect(rootScope.$broadcast)
        .toHaveBeenCalledWith('command-change', {'commands': []});
    });
  });

});
