'use strict';

describe('Service: registryService', function () {

  // load the service's module
  beforeEach(module('iLayers'));

  // instantiate service
  var httpBackend, requestHandler, env, registryService, errorService;
  
  beforeEach(inject(function ($httpBackend, _ENV_, _registryService_, _errorService_) {
    registryService = _registryService_;
    errorService = _errorService_;
    httpBackend = $httpBackend;
    env = _ENV_;
    env.apiEndpoint = 'http://localhost';
  }));
  
  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  describe('inspect', function() {
    beforeEach(function() {
      requestHandler = httpBackend.whenPOST('http://localhost/registry/analyze');
      requestHandler.respond(200, [{ layers: [] }]);
      spyOn(errorService, 'notification');
    });
    
    it('should return list of images', function() {
      httpBackend.expectPOST('http://localhost/registry/analyze');
      registryService.inspect([]);
      httpBackend.flush();
    });
    
    it('should call errorService.notification when image not found', function() {
      requestHandler.respond(200, [{ layers: null, repo: { name: 'foo', tag: 'bar' } }]);
      httpBackend.expectPOST('http://localhost/registry/analyze');
      registryService.inspect([]);
      httpBackend.flush();
      
      expect(errorService.notification).toHaveBeenCalled();
    });
    
  });
  
  describe('search', function() {
     beforeEach(function() {
      requestHandler = httpBackend.whenGET('http://localhost/registry/search?name=foo');
      requestHandler.respond(200, '');
    });
    
    it('should call search url', function() {
      httpBackend.expectGET('http://localhost/registry/search?name=foo');
      registryService.search('foo');
      httpBackend.flush();
    });
  });
  
  describe('fetchTags', function() {
    beforeEach(function() {
      requestHandler = httpBackend.whenGET('http://localhost/registry/images/foo/tags');
      requestHandler.respond(200, '');
    });
    
    it('should call tags url', function() {
      httpBackend.expectGET('http://localhost/registry/images/foo/tags');
      registryService.fetchTags('foo');
      httpBackend.flush();
    });
  });
});
