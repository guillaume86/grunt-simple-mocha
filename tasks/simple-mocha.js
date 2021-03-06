/*
 * grunt-simple-mocha
 * https://github.com/yaymukund/grunt-simple-mocha
 *
 * Copyright (c) 2012 Mukund Lakshman
 * Licensed under the MIT license.
 */
"use strict";

module.exports = function(grunt) {

  var path = require('path'),
      fs = require('fs'),
      Mocha = require('mocha'),
      cwd = process.cwd(),
      join = path.join, 
      exists = fs.existsSync || path.existsSync;


  module.paths.push(cwd, join(cwd, 'node_modules'));

  grunt.registerMultiTask('simplemocha', 'Run tests with mocha', function() {

    var paths = this.filesSrc.map(path.resolve),
        options = this.options(),
        required = options.require,
        mocha_instance = new Mocha(options);

    // handle require option
    if(required) {
      if(!Array.isArray(required)) {
        required = [required];
      }
      required.forEach(function(mod){
        var abs = exists(mod)
          || exists(mod + '.js')
          || exists(mod + '.coffee');

        if (abs) mod = join(cwd, mod);
        require(mod);
      });
    }

    paths.map(mocha_instance.addFile.bind(mocha_instance));

    // We will now run mocha asynchronously and receive number of errors in a
    // callback, which we'll use to report the result of the async task by
    // calling done() with the appropriate value to indicate whether an error
    // occurred.

    var done = this.async();

    mocha_instance.run(function(errCount) {
      var withoutErrors = (errCount === 0);
      done(withoutErrors);
    });
  });
};