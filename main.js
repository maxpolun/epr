'use strict'
var readPackage = require('./lib/readPackage'),
    parsePackage = require('./lib/parsePackage'),
    fs = require('fs'),
    spawn = require('./lib/spawn'),
    path = require('path'),
    _ = require('lodash'),
    Promise = require('bluebird')

function makeLink(srcpath, name) {
  var src = path.join('..', srcpath)
  return spawn('ln', ['-s', src, name], {cwd: 'node_modules'})
}

function ensureNodeModulesExists() {
  return new Promise(function promiseMkdir(resolve, reject){
    fs.mkdir(path.join(process.cwd(), 'node_modules'), function resolveMkdir(err){
      if(err) {
        reject(err)
      }
      resolve()
    })
  })
}

ensureNodeModulesExists().then(readPackage).then(function parse(packageStr){
  return parsePackage(packageStr)
}).then(function createSymlinks(linkMapping){
  console.log(linkMapping)
  return Promise.all(_.map(linkMapping, makeLink))
})
