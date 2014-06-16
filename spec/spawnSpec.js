'use strict'
var spawn = require('../lib/spawn')

describe('spawn', function(){
  pit('should resolve if the process completes sucessfully', function(){
    return spawn('true')
  })
  pit('should reject if the process completes unsuccessfully', function(){
    return spawn('false').then(function () {
      throw 'spawn should not call the success callback'
    }, function(){
      return true
    })
  })
  pit('should capture stdout', function(){
    return spawn('echo', ['test']).then(function(result){
      expect(result.stdout).toEqual('test\n')
    })
  })
  pit('should capture stderr', function(){
    return spawn(__dirname + '/util/echoErr.sh', ['test']).then(function(result){
      expect(result.stderr).toEqual('test\n')
    })
  })
  pit('should capture the exit code', function(){
    return spawn(__dirname + '/util/failWithCode.sh', [0]).then(function(result){
      expect(result.code).toEqual(0)
      return spawn(__dirname + '/util/failWithCode.sh', [45])
    }).catch(function(result){
      expect(result.code).toEqual(45)
    })
  })
})