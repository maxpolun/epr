'use strict'
var fs = require('fs'),
    path = require('path'),
    _ = require('lodash'),
    Promise = require('bluebird'),
    listSymlinks = require('./listSymlinks')

var symlink = Promise.promisify(fs.symlink),
    unlink = Promise.promisify(fs.unlink)

function cd(location) {
  return new Promise(function changedir(resolve){
    resolve(process.chdir(location))
  })
}

function makeLink(src, dest, cwd, verbose) {
  var srcPath = path.join('..', src),
      destPath = dest
  if(verbose) {
    console.log('linking:', path.resolve(srcPath), '->', path.resolve(destPath))
  }
  return symlink(srcPath, destPath, 'dir').catch(function ignoreEEXIST(err){
    if(err.cause.code !== 'EEXIST') {
      throw err
    }
  })
}

function ensureNodeModulesExists(cwd) {
  return new Promise(function promiseMkdir(resolve, reject){
    fs.mkdir(path.join(cwd, 'node_modules'), function resolveMkdir(err){
      if(err && err.code !== 'EEXIST') {
        reject(err)
      }
      resolve()
    })
  })
}

function entangle(cwd, linkMapping, verbose) {
  return ensureNodeModulesExists(cwd).then(function(){
      return cd(path.join(cwd, 'node_modules'))
    }).then(function makeAllLinks(){
    return Promise.all(_.map(linkMapping, function mapLinks(src, dest){
      return makeLink(src, dest, cwd, verbose)
    }))
  })
}

module.exports.entangle = entangle

function empty(cwd, verbose) {
  return listSymlinks(path.join(cwd, 'node_modules')).then(function rmSymlinks(symlinks){
    if(verbose) {
      symlinks.forEach(function(link){
        console.log('deleting', link)
      })  
    }
    return Promise.all(symlinks.map(unlink))
  })
}

module.exports.empty = empty

function clean(cwd, linkMapping, verbose) {
  return empty(cwd, false).then(function reEntangle(){
    entangle(cwd, linkMapping, verbose)
  })
}

module.exports.clean = clean
