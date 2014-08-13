'use strict'
var readPackage = require('../lib/readPackage')
describe('readPackage', function(){
  pit('should resolve the package string if one exists in the current directory', function(){
    return readPackage(__dirname + '/util').then(function(packageStr){
      expect(packageStr).toEqual('{}')
    })
  })
  pit('should reject if no package.json exists in the current dir', function(){
    return readPackage(__dirname).then(function(){
      throw 'should throw when no package.json present'
    }, function(){
      // this should always be executed
    })
  })
})
