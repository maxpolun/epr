'use strict'
var cp = require('child_process'),
    Promise = require('bluebird')

module.exports = function spawn(cmd, args, options){
  return new Promise(function resolveProcess(resolve, reject){
    var process = cp.spawn(cmd, args, options),
        result = {
          stdout: '',
          stderr: '',
          code: 0
        }
    process.stdout.on('data', function gotStdoutChunk(chunk){
      result.stdout += chunk.toString()
    })
    process.stderr.on('data', function gotStderrChunk(chunk){
      result.stderr += chunk.toString()
    })
    process.on('close', function processClosed(code){
      result.code = code
      if(code) {
        reject(result)
      } else {
        resolve(result)
      }
    })
  })
}