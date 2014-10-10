// Copyright 2014 SAP SE.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http: //www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the License.

'use strict';

// TODO rethink configuration
// TODO use uglify for files (on the fly)


var path = require('path');
var async = require('async');

module.exports = function (grunt) {

	grunt.registerMultiTask('openui5_library_preload', 'Create OpenUI5 Library Preload File', function () {

		var done = this.async();

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
		  libraryName: '',
			dest: ''
		});

		var preloadDest = path.join(options.dest, options.libraryName.replace(/\./g, path.sep), 'library-preload.json');

		var preload = {
			version: '2.0',
			name: options.libraryName ? options.libraryName + '.library-preload' : null,
			modules: {}
		};

		// TODO check no file

		// Iterate over all specified file groups.
		async.eachSeries(this.files, function(fileObj, nextFileObj) {
			var files = fileObj.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			});

			// TODO check no file

			async.concatSeries(files, function(file, next) {
				var moduleName = path.relative(fileObj.orig.cwd, file).split(path.sep).join('/');
				preload.modules[moduleName] = grunt.file.read(file, { encoding: 'utf-8' });
				next();
			}, nextFileObj);

		}, function(err, results) {

			if (err) {
				done(err);
				return;
			}

			grunt.file.write(preloadDest, JSON.stringify(preload, null, '\t'));
			grunt.log.writeln('File ' + preloadDest + ' created with ' + Object.keys(preload.modules).length + ' files.');

			done();
		});

	});
};
