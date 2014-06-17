'use strict'
var readPackage = require('./lib/readPackage'),
    parsePackage = require('./lib/parsePackage'),
    fs = require('fs'),
    spawn = require('./lib/spawn'),
    path = require('path'),
    _ = require('lodash'),
    Promise = require('bluebird')

var symlink = Promise.promisify(fs.symlink)

function makeLink(src, dest) {
  var srcPath = path.resolve(src),
      destPath = path.join(process.cwd(), 'node_modules', dest)
  return symlink(srcPath, destPath, 'dir')
}

function ensureNodeModulesExists() {
  return new Promise(function promiseMkdir(resolve, reject){
    fs.mkdir(path.join(process.cwd(), 'node_modules'), function resolveMkdir(err){
      if(err && err.code !== 'EEXIST') {
        reject(err)
      }
      resolve()
    })
  })
}

ensureNodeModulesExists().then(readPackage).then(function parse(packageStr){
  return parsePackage(packageStr)
}).then(function createSymlinks(linkMapping){
  return Promise.all(_.map(linkMapping, makeLink))
})
