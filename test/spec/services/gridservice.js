'use strict';

describe('Service: gridService', function () {

  // load the service's module
  beforeEach(module('iLayers'));

  // instantiate service
  var gridService;
  beforeEach(inject(function (_gridService_) {
    gridService = _gridService_;
  }));

  it('should do something', function () {
    expect(!!gridService).toBe(true);
  });

});
