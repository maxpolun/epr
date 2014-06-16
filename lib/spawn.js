'use strict'
var cp = require('child_process'),
    Promise = require('bluebird')

module.exports = function spawn(cmd, args, options){
  return new Promise(function resolveProcess(resolve, reject){
    var spawnedProcess = cp.spawn(cmd, args, options),
        result = {
          stdout: '',
          stderr: '',
          code: 0
        }
    spawnedProcess.stdout.on('data', function gotStdoutChunk(chunk){
      result.stdout += chunk.toString()
    })
    spawnedProcess.stderr.on('data', function gotStderrChunk(chunk){
      result.stderr += chunk.toString()
    })
    spawnedProcess.on('close', function processClosed(code){
      result.code = code
      if(code) {
        reject(result)
      } else {
        resolve(result)
      }
    })
  })
}