'use strict';

describe('Controller: SearchCtrl', function () {

  // load the controller's module
  beforeEach(module('iLayers'));

  var SearchCtrl,
      location,
      dialog,
      ga,
      scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope, $location, _ngDialog_) {
    scope = $rootScope.$new();
    location = $location;
    dialog = _ngDialog_;
    SearchCtrl = $controller('SearchCtrl', {
      $scope: scope
    });
  }));

  it('should initialize searchList', function() {
    expect(scope.searchList.length).toEqual(1);
  });

  describe('buildQueryParams', function() {
    describe('when a tag is not provided', function() {
      it('creates a name element', function() {
        var list = SearchCtrl.buildQueryParams([{ 'name':'foo', 'tag':'' }]);
        expect(list).toEqual('foo');
      });

      it('creates a comma list of names', function() {
        var list = SearchCtrl.buildQueryParams([{ 'name':'foo', 'tag':'' }, { 'name':'bar', 'tag':'' }]);
        expect(list).toEqual('foo,bar');
      });
    });

    describe('when a tag is provided', function() {
      it('creates a name:tag pair', function() {
        var list = SearchCtrl.buildQueryParams([{ 'name':'foo', 'tag':'latest' }]);
        expect(list).toEqual('foo:latest');
      });

      it('creates a comma list of names', function() {
        var list = SearchCtrl.buildQueryParams([{ 'name':'foo', 'tag':'latest' }, { 'name':'bar', 'tag':'1' }]);
        expect(list).toEqual('foo:latest,bar:1');
      });
    });
  });

  describe('populateSearch', function() {
    beforeEach(function() {
      location.search('images', 'foo:latest');
    });
    it('should create list from url search string', function() {
      var result = SearchCtrl.populateSearch();
      expect(result[0].name).toEqual('foo');
      expect(result[0].tag).toEqual('latest');
    });
  });

  describe('$scope.showSearch', function() {
    it('should open dialog', function() {
      var options = {
        closeByDocument: false,
        template: 'views/searchDialog.html',
        className: 'ngdialog-theme-layers',
        controller: 'SearchCtrl'
      };
      spyOn(dialog, 'open');
      scope.showSearch();
      expect(dialog.open).toHaveBeenCalledWith(options);
    });
  });
  
  describe('$scope.removeAll', function() {
    it('should set searchList to single empty image', function() {
      scope.searchList = [{ name: 'one', tag: 'oneTag' },
                          { name: 'two', tag: 'twoTag' }];
      
      expect(scope.searchList.length).toEqual(2);
      
      scope.removeAll();
      
      expect(scope.searchList.length).toEqual(1);
      expect(scope.searchList[0].name).toEqual('');
      expect(scope.searchList[0].tag).toEqual('latest');
    });
  });

  describe('$scope.addRow', function() {
    it('should add blank row to searchList', function() {
      scope.searchList = [];
      scope.addRow();
      expect(scope.searchList.length).toEqual(1);
      expect(scope.searchList[0]).toEqual({ 'name': '', 'tag': 'latest' });
    });
  });

  describe('$scope.closeDialog', function() {
    it('should call closeAll() on dialog', function() {
      spyOn(dialog, 'closeAll');
      scope.closeDialog();
      expect(dialog.closeAll).toHaveBeenCalled();
    });
  });

  describe('$scope.showExampleSearch', function () {
    it('should add example images to $scope.selectedImages', function () {
      scope.showExampleSearch();
      expect(scope.searchList.length).toEqual(6);
    });
    it('should call addImages() for the searchList', function () {
      spyOn(scope, 'addImages');
      scope.showExampleSearch();
      expect(scope.addImages).toHaveBeenCalled();
    });
  });

  describe('$scope.addImages', function() {
    beforeEach(function() {
      spyOn(location, 'search');
      spyOn(scope, 'closeDialog');
      scope.searchList = [{'name': 'foo', 'tag': 'latest', 'found': true }];
    });

    it('should remove empty image rows from list', function() {
      spyOn(location, 'url');
      scope.searchList = [{'name': '', 'tag': ''}];
      scope.addImages();
      expect(location.url).toHaveBeenCalled();
    });

    it('should remove any image not found', function() {
      spyOn(location, 'url');
      scope.searchList = [{'name': 'foo', 'tag': 'latest', 'missing': true}];
      scope.addImages();
      expect(location.url).toHaveBeenCalled();
    });

    it('should change the search string', function() {
      scope.addImages();
      expect(location.search).toHaveBeenCalledWith('images', 'foo:latest');
    });

    it('should close the dialog', function() {
      scope.addImages();
      expect(scope.closeDialog).toHaveBeenCalled();
    });
  });

  describe('$scope.removeImage', function() {
    it('should remove the image by index', function() {
      scope.searchList = ['foo', 'bar', 'baz'];
      scope.removeImage(1);
      expect(scope.searchList).toEqual(['foo','baz']);
    });
  });
});
