"use strict";

const path = require("path");
const async = require("async");
const less = require("less-openui5");

module.exports = function(grunt) {
	grunt.registerMultiTask("openui5_theme", "OpenUI5 Theme Build", function() {
		// Merge task-specific and/or target-specific options with these defaults.
		const options = this.options({
			rootPaths: [],
			rtl: true,
			parser: {},
			compiler: {}
		});

		const builder = new less.Builder();

		// TODO check no file

		// Iterate over all specified file groups.
		async.eachSeries(this.files, function(fileObj, nextFileObj) {
			const files = fileObj.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn("Source file \"" + filepath + "\" not found.");
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
					const destDir = path.dirname(fileObj.dest);

					const cssDestFile = destDir + "/library.css";
					grunt.file.write(cssDestFile, result.css);
					grunt.log.writeln("File " + cssDestFile + " created.");

					const rtlCssDestFile = destDir + "/library-RTL.css";
					grunt.file.write(rtlCssDestFile, result.cssRtl);
					grunt.log.writeln("File " + rtlCssDestFile + " created.");

					const parametersDestFile = destDir + "/library-parameters.json";
					const parametersFileContent = JSON.stringify(
						result.variables, null, options.compiler.compress ? 0 : 4
					);
					grunt.file.write(parametersDestFile, parametersFileContent);
					grunt.log.writeln("File " + parametersDestFile + " created.");

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
