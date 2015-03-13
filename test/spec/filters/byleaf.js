'use strict';

describe('Filter: byLeaf', function () {

  // load the filter's module
  beforeEach(module('iLayers'));

  // initialize a new instance of the filter before each test
  var byLeaf, data;
  beforeEach(inject(function ($filter) {
    byLeaf = $filter('byLeaf');
    data = [{name: 'foo'},{name: 'bar'},{name: 'baz'}]
  }));

  it('should return the list of images containing name', function () {
    var result = byLeaf(data, 'a');
    expect(result.length).toEqual(2);
  });

});
