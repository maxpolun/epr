'use strict'
var fs = require('fs'),
    Promise = require('bluebird'),
    path = require('path')

module.exports = function readPackage() {
  return new Promise(function resolvePackage(resolve, reject){
    var file = path.join(process.cwd(), 'package.json')
    fs.readFile(file, {encoding: 'UTF-8'}, function readComplete(err, data){
      if(err) {
        return reject(err)
      }
      resolve(data)
    })
  })
}