'use strict'
module.exports = function(grunt) {
  var config = {}
  config.pkg = grunt.file.readJSON('package.json')
  config.nodespecfiles = ['spec/**/*Spec.js']
  config.nodefiles = ['main.js','lib/**/*.js','lib/*.js']
  config.backendFiles = config.nodespecfiles.concat(config.nodefiles)
  config.allCodeFiles = config.nodefiles
  config.allSpecFiles = config.nodespecfiles
  config.allJS = config.backendFiles

  config.concurrent = {
    dev: {
      tasks: ['node-inspector', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  }

  config['node-inspector'] = {
    dev: {}
  }

  config.spec = {
    default: {
      specs: config.allSpecFiles,
      isVerbose: true,
      showColors: true,
      includeStackTrace: true,
      defaultTimeoutInterval: 5000
    }
  }

  config.eslint = {
    code: {
      files: {
        src: config.allCodeFiles,
      },
      options: {
        config: 'config/eslint.json'
      }
    },
    specs: {
      files: {
        src: config.allSpecFiles,
      },
      options: {
        config: 'config/eslint-specs.json'
      }
    }
  }

  config.watch = {
    nodeSpecs: {
      files: config.backendFiles,
      tasks: 'spec'
    },
    lint: {
      files: config.allJS,
      tasks: 'eslint'
    }
  }

  grunt.initConfig(config)

  grunt.loadNpmTasks('eslint-grunt')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-node-inspector')
  grunt.loadNpmTasks('grunt-concurrent')

  grunt.registerMultiTask('spec', 'Run node jasmine specs', function(){
    var done = this.async();
    var jasmineLib = require('minijasminenode2');
    this.data.specs = grunt.file.expand(this.data.specs)
    this.data.onComplete = done
    jasmineLib.executeSpecs(this.data)
  })

  grunt.registerTask('default', ['concurrent:dev'])

}
