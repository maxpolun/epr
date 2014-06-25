'use strict'

var listSymlinks = require('../lib/listSymlinks'),
    testUtil = require('./testUtil'),
    fs = require('fs')

describe('listSymlinks', function(){
  pit('should list all symlinks in a directory', function(){
    return testUtil.createFixture('empty').then(function(){
      fs.writeFileSync(__dirname + '/fixture/real1', 'test')
      fs.symlinkSync(__dirname + '/fixture/real1', __dirname + '/fixture/link1')
      return listSymlinks(__dirname + '/fixture')
    }).then(function(symlinks){
      expect(symlinks).toContain(__dirname + '/fixture/link1')
    })
  })
  pit('should list symlink dirs', function(){
    return testUtil.createFixture('empty').then(function(){
      fs.mkdirSync(__dirname + '/fixture/real2')
      fs.symlinkSync(__dirname + '/fixture/real2', __dirname + '/fixture/link2', 'dir')
      return listSymlinks(__dirname + '/fixture')
    }).then(function(symlinks){
      expect(symlinks).toContain(__dirname + '/fixture/link2')
    })
  })
})
