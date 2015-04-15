'use strict';

describe('Service: errorInterceptor', function () {

  // load the service's module
  beforeEach(module('iLayers'));

  // instantiate service
  var errorInterceptor;
  beforeEach(inject(function (_errorInterceptor_) {
    errorInterceptor = _errorInterceptor_;
  }));

  it('should do something', function () {
    expect(!!errorInterceptor).toBe(true);
  });

});
