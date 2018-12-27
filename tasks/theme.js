// Copyright 2019 SAP SE.
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

var path = require('path');
var async = require('async');
var less = require('less-openui5');

module.exports = function(grunt) {

	grunt.registerMultiTask('openui5_theme', 'OpenUI5 Theme Build', function() {

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			rootPaths: [],
			rtl: true,
			parser: {},
			compiler: {}
		});

		var builder = new less.Builder();

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

				if (options.rootPaths) {

					// Map rootpaths and get lessInputPath
					options.rootPaths.forEach(function(path) {
						if (file.indexOf(path) !== -1) {
							file = file.substring(path.length);
						}
					});
				}

				builder.build(grunt.util._.extend({}, options, {
					lessInputPath: file
				})).then(function(result) {

					var destDir = path.dirname(fileObj.dest);

					var cssDestFile = destDir + '/library.css';
					grunt.file.write(cssDestFile, result.css);
					grunt.log.writeln('File ' + cssDestFile + ' created.');

					var rtlCssDestFile = destDir + '/library-RTL.css';
					grunt.file.write(rtlCssDestFile, result.cssRtl);
					grunt.log.writeln('File ' + rtlCssDestFile + ' created.');

					var parametersDestFile = destDir + '/library-parameters.json';
					var parametersFileContent = JSON.stringify(result.variables, null, options.compiler.compress ? 0 : 4);
					grunt.file.write(parametersDestFile, parametersFileContent);
					grunt.log.writeln('File ' + parametersDestFile + ' created.');

					process.nextTick(next);

				}, function(err) {
					nextFileObj(err);
				});
			}, function() {
				nextFileObj();
			});

		}, this.async());
	});

};
