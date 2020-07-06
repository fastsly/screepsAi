/*
 * grunt-screeps
 * https://github.com/screeps/grunt-screeps
 *
 * Copyright (c) 2015 Artem Chivchalov
 * Licensed under the MIT license.
 */

'use strict'



module.exports = function (grunt) {
    console.log("Started")
   grunt.loadNpmTasks('grunt-screeps')
   var config = require('./.screeps.json')
  grunt.initConfig({
    screeps: {
      options: {
        email: config.email,
        password: config.password,
        branch: config.branch,
        ptr: false
      },
      dist: {
        files: [
          {
            src: ['dist/*.js']
          }
        ]
      }
    }
  })
  //grunt.loadTasks('tasks')
  grunt.registerTask('default',  ['screeps']);
console.log("Done!")
  // These plugins provide necessary tasks.
  // grunt.loadNpmTasks('grunt-contrib-jshint')
  // grunt.loadNpmTasks('grunt-contrib-nodeunit')
}