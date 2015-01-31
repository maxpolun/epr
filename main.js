#!/usr/bin/env node
'use strict'
var readPackage = require('./lib/readPackage'),
    parsePackage = require('./lib/parsePackage'),
    epr = require('./lib/epr'),
    minimist = require('minimist')


function entangle() {
  readPackage(process.cwd()).then(function parse(packageStr){
    return parsePackage(packageStr)
  }).then(function createSymlinks(linkMapping){
    epr.entangle(process.cwd(), linkMapping, global.verbose)
  })
}

function clean(){
  readPackage(process.cwd()).then(function parse(packageStr){
    return parsePackage(packageStr)
  }).then(function createSymlinks(linkMapping){
    return epr.clean(process.cwd(), linkMapping, global.verbose)
  })
}

function empty(){
  return epr.empty(process.cwd(), global.verbose)
}

function version(){
  console.log(require('./package.json').version)
}

function help(){
  var message = 'epr: use short require paths in node\n\n' +
    'epr will create symlinks in your node_modules directory.\n' +
    '    specify the directories in your package.json using the following format\n' +
    '    "epr": {\n' +
    '      "my-module": "lib/modules/my-module"\n' +
    '    }\n' +
    'syntax:\n' +
    '    epr [COMMAND]\n' +
    'COMMAND can be one of\n' +
    '    entangle: (default command) create symlinks in node_modules/\n' +
    '    clean: delete all symlinks in node_modules not listed in package.json\n' +
    '    clear: delete all symlinks in node_modules\n' +
    '    help: view this message\n' +
    '    version: print versionof epr\n' + 
    'FLAGS:\n' +
    '    -v, --verbose: print verbose messages'
  console.log(message)
}

var commands = {
  entangle: entangle,
  clean: clean,
  empty: empty,
  help: help,
  version: version
}

function main(args) {
  var command = args._[0]
  global.verbose = false
  if(args._.length === 0) {
    command = 'entangle'
  }
  if(args.h || args.help) {
    command = 'help'
  }
  if(args.v || args.verbose) {
    global.verbose = true
  }

  commands[command]()
}

main(minimist(process.argv.slice(2)))
