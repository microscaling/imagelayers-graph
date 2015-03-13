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

    it('should return size classes', function() {
      // small
      expect(controller.classifyLayer(layer, 1)).toEqual('box small');
      // medium
      layer.Size = 21 * 1000;
      expect(controller.classifyLayer(layer, 1)).toEqual('box medium');
      // large
      layer.Size = 101 * 1000;
      expect(controller.classifyLayer(layer, 1)).toEqual('box large');
    });

    it('should return command classes', function() {
      layer.container_config.Cmd = [' curl '];
      expect(controller.classifyLayer(layer, 1)).toEqual('box small curl');
      layer.container_config.Cmd = [' ADD '];
      expect(controller.classifyLayer(layer, 1)).toEqual('box small add');
      layer.container_config.Cmd = [' ENV '];
      expect(controller.classifyLayer(layer, 1)).toEqual('box small env');
      layer.container_config.Cmd = [' apt-get '];
      expect(controller.classifyLayer(layer, 1)).toEqual('box small cmd');
      layer.container_config.Cmd = [' cmd '];
      expect(controller.classifyLayer(layer, 1)).toEqual('box small cmd');
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
