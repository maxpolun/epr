'use strict'
require('jasmine2-pit')
var testUtil = require('./testUtil')

describe('epr', function(){
  pit('should add symlinks to node_modules', function(){
    return testUtil.runInFixture('simple').then(function(cmdOutput){
      console.log(cmdOutput)
      return testUtil.fixtureFilesExist([
          'node_modules/test1/test1.json',
          'node_modules/this/is/test/2/test2.js'
        ])
    })
  })
})