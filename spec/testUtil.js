var Promise = require('bluebird'),
    path = require('path'),
    fs = require('fs'),
    spawn = require('child_process').spawn

Promise.longStackTraces(true)

function shellout(cmd, args, options) {
  return new Promise(function shelloutPromise(resolve, reject){
    var process = spawn(cmd, args, options),
        stdout = '', 
        stderr = ''
    process.stdout.on('data', function concatData(chunk){
      stdout += chunk.toString()
    })
    process.stderr.on('data', function concatErr(chunk){
      stdout += chunk.toString()
    })
    process.on('close', function processClosed(code){
      if(code === 0) {
        return resolve(stdout)
      }
      reject({code: code, stderr: stderr})
    })
  })
}

function exists(path) {
  return new Promise(function fileExists(resolve){
    fs.exists(path, resolve)
  })
}

function copyDir(src, dest) {
  return shellout('cp', ['-R', src, dest])
}

function clearDir(dir) {
  return shellout('rm', ['-rf', dir])
}

function runProgram(fixturePath, args) {
  var cmdArgs = [path.join(__dirname, '..', 'main.js')].concat(args||[])
  return shellout('node', cmdArgs, {
    cwd: fixturePath
  })
}

function runInFixture(fixture) {
  var usedFixtureDir = path.join(__dirname, 'fixture-templates', fixture),
      fixturePath = path.join(__dirname, 'fixture')
  return clearDir(fixturePath).then(function copyFixture() {
    return copyDir(usedFixtureDir, fixturePath)
  }).then(function runMain(){
    return runProgram(fixturePath)
  })
}

module.exports.runInFixture = runInFixture

function fixtureFilesExist(files) {
  return Promise.all(files.map(exists)).then(function checkExists(results){
    results.forEach(function(exists, i){
      if(!exists) {
        throw "File does not exist: " + files[i]
      }
    })
  })
}

module.exports.fixtureFilesExist = fixtureFilesExist
