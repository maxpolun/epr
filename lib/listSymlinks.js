'use strict'
var fs = require('fs'),
    Promise = require('bluebird'),
    path = require('path')

var readdir = Promise.promisify(fs.readdir),
    lstat = Promise.promisify(fs.lstat)

module.exports = function listSymlinks(dir){
  var files = []
  return readdir(dir).then(function enumerateDirFiles(dirFiles){
    files = dirFiles.map(function resolveFilePath(file){
      return path.join(dir, file)
    })
    return Promise.all(files.map(function lstatFiles(file){
      return lstat(file)
    }))
  }).then(function collectLinks(stats){
    return files.filter(function isSymlink(_, i){
      return stats[i].isSymbolicLink()
    })
  })
}
