describe('DashboardCtrl', function() {
  // Load the module
  beforeEach(module('iLayers'));

  var ctrl, scope, layers, registryService;

  beforeEach(inject(function ($controller, $rootScope, _registryService_) {
    scope = $rootScope.$new();

    registryService = _registryService_;

    ctrl = $controller('DashboardCtrl', {
      $scope: scope
    });
  }));

  it('should initialize graph', function() {
    expect(scope.graph.length).toEqual(0);
  });

  describe('buildTerms', function () {
    it('should add latest tag when empty', function() {
      var data = ctrl.buildTerms("foo");

      expect(data[0].tag).toEqual("latest");
      expect(data[0].name).toEqual("foo");
    });

    it('should return tag and name when provided', function() {
      var data = ctrl.buildTerms("foo:1.0.0");

      expect(data[0].tag).toEqual("1.0.0");
      expect(data[0].name).toEqual("foo");
    });

    it('should create terms for each image provided', function() {
      var data = ctrl.buildTerms("foo:1.0.0, baz:2.0.0");

      expect(data.length).toEqual(2);
      expect(angular
               .equals(data[0], { "name": "foo", "tag": "1.0.0" }))
               .toBeTruthy();
      expect(angular
               .equals(data[1], { "name": "baz", "tag": "2.0.0" }))
               .toBeTruthy();
    });
  });

  describe('searchImages', function() {

    beforeEach(inject(function($q) {
      deferredSuccess = $q.defer();
      spyOn(registryService, 'inspect').and.returnValue(deferredSuccess.promise);
      deferredSuccess.resolve({data: {'repo': {}, 'layers': []}});
    }));

    it('should do nothing when no images provided', function() {
      ctrl.searchImages({});
      expect(registryService.inspect).not.toHaveBeenCalled();
    });

    it('should call registryService with provided images', function() {
      ctrl.searchImages({'images': 'foo,bar:1.0.0'});
      expect(registryService.inspect).toHaveBeenCalledWith([{"name":"foo","tag":"latest"}, {"name":"bar","tag":"1.0.0"}]);
    });
  });
});
