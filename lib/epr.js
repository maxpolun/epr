'use strict'
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Promise = require('bluebird')

var symlink = Promise.promisify(fs.symlink)

function makeLink(src, dest, cwd) {
  var srcPath = path.resolve(src),
      destPath = path.join(cwd, 'node_modules', dest)
  return symlink(srcPath, destPath, 'dir').catch(function ignoreEEXIST(err){
    if(err.cause.code !== 'EEXIST') {
      throw err
    }
  })
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

function entangle(cwd, linkMapping) {
  return ensureNodeModulesExists().then(function makeAllLinks(){
    return Promise.all(_.map(linkMapping, function mapLinks(src, dest){
      return makeLink(src, dest, cwd)
    }))
  })
}

module.exports.entangle = entangle
