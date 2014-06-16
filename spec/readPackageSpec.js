'use strict'
var readPackage = require('../lib/readPackage')
describe('readPackage', function(){
  pit('should resolve the package string if one exists in the current directory', function(){
    spyOn(process, 'cwd').and.callFake(function(){
      return __dirname + '/util'
    })
    return readPackage().then(function(packageStr){
      expect(packageStr).toEqual('{}')
    })
  })
  pit('should reject if no package.json exists in the current dir', function(){
    spyOn(process, 'cwd').and.callFake(function(){
      return __dirname 
    })
    return readPackage().then(function(data){
      console.log(data)
      throw 'should throw when no package.json present'
    }, function(){
      return true
    })
  })
})