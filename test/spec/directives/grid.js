'use strict';

describe('Directive: grid', function () {
  // load the directive's module
  beforeEach(module('iLayers'));
  // Load the templates
  beforeEach(module('views/grid.html'));

var directive, scope, controller, layer, commandService, gridService;

  beforeEach(inject(function ($compile, $rootScope, _commandService_, _gridService_) {
    var elem = angular.element("<section grid graph='graph'></section>");
    scope = $rootScope.$new();
    scope.graph = [];
    scope.applyFilters = function() { return [] };
    directive = $compile(elem)(scope);
    scope.$digest();
    controller = elem.controller('grid');
    layer = { Size: 0, container_config: { Cmd: [] } };
    commandService = _commandService_;
    gridService = _gridService_;
  }));

  describe('classifyLayer', function() {
    it('should return noop when count is 0', function() {
      var classes = controller.classifyLayer(layer, 0);
      expect(classes).toEqual('noop');
    });

    it('should return command classes', function() {
      layer.container_config.Cmd = ['RUN '];
      expect(controller.classifyLayer(layer, 1)).toEqual('box cat1');
      layer.container_config.Cmd = ['ADD '];
      expect(controller.classifyLayer(layer, 1)).toEqual('box cat2');
      layer.container_config.Cmd = ['VOLUME '];
      expect(controller.classifyLayer(layer, 1)).toEqual('box cat3');
      layer.container_config.Cmd = ['CMD '];
      expect(controller.classifyLayer(layer, 1)).toEqual('box cat4');
      layer.container_config.Cmd = ['FROM '];
      expect(controller.classifyLayer(layer, 1)).toEqual('box cat5');
    });
  });

  describe('findWidth', function() {
    it('should return 0 when count = 0', function() {
      expect(controller.findWidth(0)).toEqual(0);
    });

    it('should return box width when count is 1', function() {
      expect(controller.findWidth(1)).toEqual(180);
    });

    it('should return box width + 20 padding', function() {
      expect(controller.findWidth(2)).toEqual(380);
    });
  });

  describe('$scope.unwrapGrid', function() {
    it('creates an array from matrix data', function() {
      var data = { cols: 1, rows: 1, matrix: { map: [[{layer: { id: 'foo' } }]],
                                      inventory: {'foo': {image: { repo: 'test' } }, count: 1 } } },
          res = gridService.findLeaves(data);

      expect(res.length).toEqual(1);
    });
  });

  describe('scope.highlightCommand', function() {

  });

  describe('scope.clearCommand', function() {

  });
});
