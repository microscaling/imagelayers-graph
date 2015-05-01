'use strict';

describe('Service: errorInterceptor', function () {

  // load the service's module
  beforeEach(module('iLayers'));

  // instantiate service
  var errorInterceptor, errorService;
  
  beforeEach(inject(function (_errorInterceptor_, _errorService_) {
    errorInterceptor = _errorInterceptor_;
    errorService = _errorService_;
    spyOn(errorService, 'error');
  }));

  describe('when successful', function() {
    it('should return unchanged response', function() {
      var sample = 'testing',
          result = errorInterceptor.response(sample);
      
      expect(sample).toEqual(result);
    });
  });
  
  describe('when error', function() {
    it('should call error service with default string', function() {
      var msg = 'Unable to communicate to ImageLayers Services';
      errorInterceptor.responseError({})
      
      expect(errorService.error).toHaveBeenCalledWith(msg);
    });
    
    it('should call error with response message', function() {
      var msg = 'Testing';
      errorInterceptor.responseError({ data: msg });
      
      expect(errorService.error).toHaveBeenCalledWith(msg);
    });
  });

});
