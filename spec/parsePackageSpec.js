'use strict'
var parsePackage = require('../lib/parsePackage')
describe('parsePackage', function(){
  it('should read the config object from package.json', function(){
    var output = parsePackage('{"epr":{"test": "lib/test"}}')
    expect(output).toEqual({test: 'lib/test'})
  })
})