'use strict';

describe('Service: errorService', function () {

  // load the service's module
  beforeEach(module('iLayers'));

  // instantiate service
  var errorService;
  beforeEach(inject(function (_errorService_) {
    errorService = _errorService_;
  }));

  it('should do something', function () {
    expect(!!errorService).toBe(true);
  });

});
