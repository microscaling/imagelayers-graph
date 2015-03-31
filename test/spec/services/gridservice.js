'use strict';

describe('Service: gridService', function () {

  // load the service's module
  beforeEach(module('iLayers'));

  // instantiate service
  var gridService, data;

  beforeEach(inject(function (_gridService_) {
    gridService = _gridService_;
  }));

  describe('buildGrid', function() {
    describe('when no images are defined', function() {
      beforeEach(function() {
        data = [];
      });

      it('should have rows = 0', function() {
        var res = gridService.buildGrid(data);
        expect(res.rows).toEqual(0);
      });

      it('should have cols = 0', function() {
        var res = gridService.buildGrid(data);
        expect(res.cols).toEqual(0);
      });

      it('should return empty matrix', function() {
        var res = gridService.buildGrid(data);
        expect(res.matrix).toEqual({ inventory: {}, map: [] });
      });
    });

    describe('when images are defined', function() {
      beforeEach(function() {
        data = [
          { layers: [{id: 'baz', 'parent': 'bar' }, { id: 'bar', 'parent': 'foo' }, { id: 'foo', 'parent': '' }] },
          { layers: [{ id: 'bak', 'parent': 'foo' }, { id: 'foo', 'parent': '' }] },
          { layers: [{ id: 'boo', 'parent': 'bar' }, { id: 'bar', 'parent': 'foo' }, { id: 'foo', 'parent': '' }] }
        ];
      });

      it('should eliminate images without layers', function() {
        var res = '';

        data.push({ layers: [] });

        expect(data.length).toEqual(4);
        res = gridService.buildGrid(data);
        expect(res.cols).toEqual(3);
      });

      it('should have rows = 3', function() {
        var res = gridService.buildGrid(data);
        expect(res.rows).toEqual(3);
      });

      it('should have cols = 3', function() {
        var res = gridService.buildGrid(data);
        expect(res.cols).toEqual(3);
      });

      it('should return a foo location data', function() {
        var res = gridService.buildGrid(data);
        expect(res.matrix.inventory.foo.row).toEqual(2);
        expect(res.matrix.inventory.foo.count).toEqual(3);
      });

      it('should return a bar location data', function() {
        var res = gridService.buildGrid(data);
        expect(res.matrix.inventory.bar.row).toEqual(1);
        expect(res.matrix.inventory.bar.count).toEqual(2);
      });

      it('should return a baz location data', function() {
        var res = gridService.buildGrid(data);
        expect(res.matrix.inventory.baz.row).toEqual(0);
        expect(res.matrix.inventory.baz.count).toEqual(1);
      });

      it('should return a boo location data', function() {
        var res = gridService.buildGrid(data);
        expect(res.matrix.inventory.boo.row).toEqual(0);
        expect(res.matrix.inventory.boo.count).toEqual(1);
      });
    });
  });

  describe('findLeaves', function() {
    it('creates an array of repo items', function() {
      var data = { cols: 1,rows: 1,  matrix: { map: [[{layer: { id: 'foo' } }]],
                                      inventory: {'foo': {image: { repo: 'test' } } } } },
          res = gridService.findLeaves(data);

      expect(res.length).toEqual(1);
    });
  });
});
