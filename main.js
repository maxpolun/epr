'use strict'
var readPackage = require('./lib/readPackage'),
    parsePackage = require('./lib/parsePackage'),
    epr = require('./lib/epr'),
    minimist = require('minimist')


function entangle() {
  readPackage(process.cwd()).then(function parse(packageStr){
    return parsePackage(packageStr)
  }).then(function createSymlinks(linkMapping){
    epr.entangle(process.cwd(), linkMapping)
  })
}

function clean(){
  readPackage(process.cwd()).then(function parse(packageStr){
    return parsePackage(packageStr)
  }).then(function createSymlinks(linkMapping){
    return epr.clean(process.cwd(), linkMapping)
  })
}

function clear(){
  return epr.clear(process.cwd())
}

var commands = {
  entangle: entangle,
  clean: clean,
  clear: clear
}

function main(args) {
  var command = args._[0]
  if(args._.length === 0) {
    command = 'entangle'
  }
  commands[command]()
}

main(minimist(process.argv.slice(2)))
