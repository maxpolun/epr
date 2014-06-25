var Promise = require('bluebird'),
    path = require('path'),
    fs = require('fs'),
    spawn = require('../lib/spawn')

Promise.longStackTraces(true)

function exists(path) {
  return new Promise(function fileExists(resolve){
    fs.exists(path, resolve)
  })
}

function copyDir(src, dest) {
  return spawn('cp', ['-R', src, dest])
}

function clearDir(dir) {
  return spawn('rm', ['-rf', dir])
}

function runProgram(args) {
  var cmdArgs = [path.join(__dirname, '..', 'main.js')].concat(args||[])
  return spawn('node', cmdArgs, {
    cwd: path.join(__dirname, 'fixture')
  })
}

module.exports.runProgram = runProgram

function createFixture(fixtureName) {
  var usedFixtureDir = path.join(__dirname, 'fixture-templates', fixtureName),
      fixturePath = path.join(__dirname, 'fixture')
  return clearDir(fixturePath).then(function copyFixture() {
    return copyDir(usedFixtureDir, fixturePath)
  })
}

module.exports.createFixture = createFixture

function runInFixture(fixtureName) {
  return createFixture(fixtureName).then(function runMain(){
    return runProgram()
  })
}

module.exports.runInFixture = runInFixture

function prependFixturePath(file) {
  return path.join(__dirname, 'fixture', file)
}

function fixtureFilesExist(files) {
  return Promise.all(files.map(prependFixturePath).
                           map(exists)).then(function checkExists(results){
    results.forEach(function(exists, i){
      if(!exists) {
        throw "File does not exist: " + files[i]
      }
    })
  })
}

module.exports.fixtureFilesExist = fixtureFilesExist

function fixtureFilesNotExist(files) {
  return Promise.all(files.map(prependFixturePath).
                           map(exists)).then(function checkExists(results){
    results.forEach(function(exists, i){
      if(exists) {
        throw "File exists: " + files[i]
      }
    })
  })
}

module.exports.fixtureFilesNotExist = fixtureFilesNotExist
