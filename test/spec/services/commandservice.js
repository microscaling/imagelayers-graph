describe('Command Service', function() {
  // Load the module
  beforeEach(module('iLayers'));

  var service, rootScope;

  beforeEach(inject(function ($rootScope, _commandService_) {
    service = _commandService_;
    rootScope = $rootScope;
    spyOn(rootScope, '$broadcast');
  }));

  describe('constructCommand', function (){
    it('should transform port mappings', function() {
      var result = service.constructCommand('#(nop) EXPOSE map[9292/tcp:{}]');
      expect(result)
        .toEqual('EXPOSE 9292');
    });

    it('should transform command brackets', function() {
      var result = service.constructCommand('#(nop) CMD [test]');
      expect(result)
        .toEqual('CMD test');
    });
    it('should set an undefined command to empty string', function() {
      var result = service.constructCommand(undefined);
      expect(result)
        .toEqual('');
    });
    it('should set a null command to FROM scratch', function() {
      var result = service.constructCommand(null);
      expect(result)
        .toEqual('FROM scratch');
    });
  });

  describe('highlight', function() {
    it('should broadcast "command-change" event with commands', function() {
      service.highlight([{ container_config: { Cmd: ['RUN this thing'] } }]);
      expect(rootScope.$broadcast)
        .toHaveBeenCalledWith('command-change', {'commands': ['RUN this thing']});
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
