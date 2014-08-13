'use strict'
require('jasmine2-pit')
var testUtil = require('./testUtil'),
    fs = require('fs'),
    Promise = require('bluebird')

var symlink = Promise.promisify(fs.symlink)

describe('epr', function(){
  pit('should add symlinks to node_modules', function(){
    return testUtil.runInFixture('simple').then(function(){
      return testUtil.fixtureFilesExist([
          'node_modules/test1/test1.json',
          'node_modules/test2/test2.js'
        ])
    })
  })

  pit('should clean symlinks from node_modules', function(){
    return testUtil.createFixture('simple').then(function(){
      fs.mkdirSync(__dirname + '/fixture/node_modules')
      return symlink(__dirname + '/util', __dirname + '/fixture/node_modules/bad')
    }).then(function(){
      return testUtil.runProgram('clean')
    }).then(function(){
      return testUtil.fixtureFilesNotExist([
        'node_modules/bad/package.json'
      ])
    })
  })

  pit('should empty all symlinks from node_modules', function(){
    return testUtil.createFixture('simple').then(function(){
      fs.mkdirSync(__dirname + '/fixture/node_modules')
      return Promise.all([
        symlink(__dirname + '/util', __dirname + '/fixture/node_modules/bad'),
        symlink(__dirname + '/lib/test1', __dirname + '/fixture/node_modules/test1')
      ])
    }).then(function(){
      return testUtil.runProgram('empty')
    }).then(function(){
      return testUtil.fixtureFilesNotExist([
        'node_modules/test1/test1.json',
        'node_modules/bad/package.json'
      ])
    })
  })
})
