'use strict';

describe('Service: registryService', function () {

  // load the service's module
  beforeEach(module('iLayers'));

  // instantiate service
  var registryService;
  beforeEach(inject(function (_registryService_) {
    registryService = _registryService_;
  }));

  it('should do something', function () {
    expect(!!registryService).toBe(true);
  });

});
