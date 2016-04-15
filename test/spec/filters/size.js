describe('Size Filter', function() {
  // Load the module
  beforeEach(module('iLayers'));

  var filter;

  beforeEach(inject(function ($filter) {
    filter = $filter;
  }));

  it('should convert 0 to 0 Bytes', function() {
    var result = filter('size')(0);
    expect(result.$$unwrapTrustedValue()).toEqual('0 <span>Bytes</span>');
  });

  it('should convert 1 to 1 byte', function() {
    var result = filter('size')(1);
    expect(result.$$unwrapTrustedValue()).toEqual('1 <span>Byte</span>');
  });

  it('should convert 10 to 10 bytes', function() {
    var result = filter('size')(10);
    expect(result.$$unwrapTrustedValue()).toEqual('10 <span>Bytes</span>');
  });

  it('should convert 1024 to 1 KiB', function() {
    var result = filter('size')(1024);
    expect(result.$$unwrapTrustedValue()).toEqual('1 <span>KiB</span>');
  });

  it('should convert 1,048,576 to 1 MiB', function() {
    var result = filter('size')(1048576);
    expect(result.$$unwrapTrustedValue()).toEqual('1 <span>MiB</span>');
  });

  it('should convert 1,073,741,824 to 1 GiB', function() {
    var result = filter('size')(1073741824);
    expect(result.$$unwrapTrustedValue()).toEqual('1 <span>GiB</span>');
  });

  it('should convert 1,099,511,627,776 to 1 TiB', function() {
    var result = filter('size')(1099511627776);
    expect(result.$$unwrapTrustedValue()).toEqual('1 <span>TiB</span>');
  });

});
