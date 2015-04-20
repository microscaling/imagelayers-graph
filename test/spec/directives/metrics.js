describe('Metrics Directive', function() {
  // Load the module
  beforeEach(module('iLayers'));
  // Load the templates
  beforeEach(module('views/metrics.html'));

  var directive, scope, controller, layers;

  beforeEach(inject(function ($compile, $rootScope) {
    var elem = angular.element("<metrics></metrics>");
    scope = $rootScope.$new();
    scope.graph = [];
    scope.applyFilters = function() { return [] };
    directive = $compile(elem)(scope);
    scope.$digest();
    controller = elem.controller('metrics');
  }));

  it('should initialize metrics', function() {
     expect(angular
             .equals(scope.metrics, { count: 0, size: 0, ave: 0, largest:0 }))
             .toBeTruthy();
  });

  describe('calculateMetrics', function() {
    beforeEach(function() {
      spyOn(scope, "sequential");

      layers = [{ layers: [
        { id: 'foo', Size: 300 },
        { id: 'baz', Size: 200 },
        { id: 'bar', Size: 1000 }
        ]}
     ]
    });

    it('should call sequential with the total layer count', function() {
      scope.calculateMetrics(layers);
      expect(scope.sequential).toHaveBeenCalledWith('count', 0, 3, 600);
    });

    it('should call sequential with the total layer size', function() {
      scope.calculateMetrics(layers);
      expect(scope.sequential).toHaveBeenCalledWith('size', 0, 1500, 520);
    });

    it('should call sequential with the layer average', function() {
      scope.calculateMetrics(layers);
      expect(scope.sequential).toHaveBeenCalledWith('ave', 0, 500, 520);
    });

    it('should call sequential with the largest layer size', function() {
      scope.calculateMetrics(layers);
      expect(scope.sequential).toHaveBeenCalledWith('largest', 0, 1000, 520);
    });
  });
});
