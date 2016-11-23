// Copyright 2016 SAP SE.
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
var slash = require('slash');
var uglify = require('uglify-js');
var pd = require('pretty-data').pd;
var maxmin = require('maxmin');

var defaultResourcePatterns = [
	'**/*.js',
	'**/*.fragment.html',
	'**/*.fragment.json',
	'**/*.fragment.xml',
	'**/*.view.html',
	'**/*.view.json',
	'**/*.view.xml',
	'**/*.properties'
];

var copyrightCommentsPattern = /copyright|\(c\)|released under|license|\u00a9/i;
var xmlHtmlPrePattern = /<(?:\w+:)?pre>/;

module.exports = function (grunt) {

	grunt.registerMultiTask('openui5_preload', 'Create OpenUI5 preload files', function() {

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			resources: [],
			dest: null,
			compress: true,
			compatVersion: "edge"
		});

		var resourceMap = {};

		// normalize string/object to array
		if (typeof options.resources === 'string' || (typeof options.resources === 'object' && !(options.resources instanceof Array))) {
			options.resources = [ options.resources ];
		}

		if (options.resources.length === 0) {
			grunt.fail.warn('"resources" option is not specified!');
			return;
		}

		grunt.verbose.subhead('Collecting resources');

		// process resources array
		options.resources.forEach(function(resource) {
			// transform string shorthand to object
			if (typeof resource === 'string') {
				resource = {
					cwd: resource
				};
			}

			if (typeof resource.prefix !== 'string') {
				resource.prefix = '';
			}

			resource.src = resource.src || defaultResourcePatterns;

			grunt.verbose.writeflags(resource, 'resource');

			grunt.file.expand({
				cwd: resource.cwd,
				dot: true,
				filter: 'isFile'
			}, resource.src).forEach(function(file) {
				var localFile = file;
				if (resource.prefix) {
					localFile = slash(path.join(resource.prefix, file));
				}
				var fullPath = path.join(resource.cwd, file);
				grunt.verbose.write('Collecting ' + localFile + ' (' + fullPath + ')...').ok();
				resourceMap[localFile] = {
					fullPath: fullPath,
					prefix: resource.prefix
				};
			});

		});

		var resourceFiles = Object.keys(resourceMap);

		if (resourceFiles.length === 0) {
			grunt.fail.warn('No files found. Check your "resources" option!');
			return;
		}

		var preloadData = this.data;
		if (!preloadData['components'] && !preloadData['libraries']) {
			grunt.fail.warn('No preload type specified. Please provide "components" and/or "libraries" in task target object!');
			return;
		}

		['components', 'libraries'].forEach(function(preloadType) {
			var iMajor, iMinor, preloadInfo, preloadOptions;

			preloadOptions = preloadData[preloadType];
			if (!preloadOptions) {
				return;
			}

			if (preloadType === 'libraries') {
				preloadInfo = {
					moduleName: 'library-preload',
					indicatorFile: 'library.js',
					processModuleName: function(moduleName) {
						return moduleName.replace(/\//g, '.');
					}
				};

				if (options.compatVersion !== "edge") {
					var aVersionMatch = options.compatVersion.match(/^([0-9]+)\.([0-9]+)$/);
					if (!aVersionMatch) {
						grunt.fail.warn('\'' + options.compatVersion + '\' is not a valid value for option compatVersion!');
						return;
					}
					iMajor = parseInt(aVersionMatch[1], 10);
					iMinor = parseInt(aVersionMatch[2], 10);
				}

				if (options.compatVersion === "edge" || (iMajor === 1 && iMinor >= 40) || iMajor > 1) {
					// Build library-preload as .js file
					preloadInfo.ext = ".js";
					preloadInfo.processContent = function(content) {
						return 'jQuery.sap.registerPreloadedModules(' + content + ');';
					};
				} else {
					// Build as .json file (legacy, needed because UI5 <1.40 only loads the .json files)
					preloadInfo.ext = ".json";
				}
			} else {
				preloadInfo = {
					moduleName: 'Component-preload',
					ext: '.js',
					indicatorFile: 'Component.js',
					processContent: function(content) {
						return 'jQuery.sap.registerPreloadedModules(' + content + ');';
					}
				};
			}



			if (preloadOptions === true) {
				preloadOptions = '**';
			}
			if (typeof preloadOptions === 'string') {
				var pattern = preloadOptions;
				preloadOptions = {};
				preloadOptions[pattern] = {};
			}

			var preloadOptionKeys = Object.keys(preloadOptions);

			if (preloadOptionKeys.length === 0) {
				grunt.log.writeflags(preloadOptions, 'preloadOptions');
				grunt.fail.warn('No valid options provided for "' + preloadType + '" preload!');
				return;
			}

			preloadOptionKeys.forEach(function(preloadPattern) {
				var preloadOption = preloadOptions[preloadPattern];
				var preloadFiles = grunt.file.match(preloadPattern + '/' + preloadInfo.indicatorFile, resourceFiles);

				if (preloadFiles.length < 1) {
					grunt.fail.warn('No "' + preloadInfo.indicatorFile + '" found for pattern "' + preloadPattern + '"!');
					return;
				}

				preloadFiles.forEach(function(preloadFile) {
					var preloadDir = path.dirname(preloadFile);
					var preloadModuleName = preloadDir + '/' + preloadInfo.moduleName;

					grunt.verbose.subhead('Creating preload module for ' + preloadFile);

					var preloadObject = {
						version: '2.0',
						name: preloadModuleName,
						modules: {}
					};

					if (typeof preloadInfo.processModuleName === 'function') {
						preloadObject.name = preloadInfo.processModuleName(preloadModuleName);
					} else {
						preloadObject.name = preloadModuleName;
					}

					var preloadPatterns = preloadOption.src ? preloadOption.src : [ preloadDir + '/**' ];
					if (typeof preloadPatterns === "string") {
						preloadPatterns = [ preloadPatterns ];
					}

					// Always exclude the corresponding preload file (Component-preload.js / library-preload.json)
					// Otherwise it might get included every time the build runs if src / dest are the same dir
					preloadPatterns.push('!' + preloadDir + '/' + preloadInfo.moduleName + preloadInfo.ext);

					var preloadFiles = grunt.file.match(preloadPatterns, resourceFiles);
					if (preloadFiles.length === 0) {
						var patternsString = (typeof preloadPatterns === 'string') ? preloadPatterns : preloadPatterns.join('", "');
						grunt.fail.warn('No files found for pattern(s): "' + patternsString + '"!');
						return;
					}

					var iPreloadOriginalSize = 0, iPreloadCompressedSize = 0;

					preloadFiles.forEach(function(preloadFile) {

						var fileName = resourceMap[preloadFile].fullPath;
						var fileContent = grunt.file.read(fileName);
						var fileExtension = path.extname(fileName);

						var iOriginalSize, iCompressedSize;

						if (options.compress) {

							iOriginalSize = fileContent.length;
							iPreloadOriginalSize += iOriginalSize;

							// Convert default compression to empty configuration object
							if (options.compress === true) {
							  options.compress = {};
							}

							// Make sure to have an object
							options.compress.uglifyjs = options.compress.uglifyjs || {};

							// Always override given options, override shouldn't be possible
							options.compress.uglifyjs.fromString = true;
							options.compress.uglifyjs.warnings = grunt.option('verbose') === true;

							// Set default "comments" option if not given already
							options.compress.uglifyjs.output = options.compress.uglifyjs.output || {};
							if (!options.compress.uglifyjs.output.hasOwnProperty("comments")) {
							  options.compress.uglifyjs.output.comments = copyrightCommentsPattern;
							}

							try {
								switch (fileExtension) {
								case '.js':
									// Javascript files are processed by Uglify
									fileContent = uglify.minify(fileContent, options.compress.uglifyjs).code;
									break;
								case '.json':
									// JSON is parsed and written to string again to remove unwanted white space
									fileContent = JSON.stringify(JSON.parse(fileContent));
									break;
								case '.xml':
									// For XML we use the pretty data

									// Do not minify if XML(View) contains an <*:pre> tag because whitespace of HTML <pre> should be preserved (should only happen rarely)
									if (!xmlHtmlPrePattern.test(fileContent)) {
										fileContent = pd.xmlmin(fileContent, false);
									}

									break;
								}
							} catch (e) {
								grunt.log.error('Failed to compress ' + fileName + '. This might be due to a syntax error in the file.');
								grunt.fail.warn(e);
							}

							iCompressedSize = fileContent.length;
							iPreloadCompressedSize += iCompressedSize;

						}

						if (grunt.option('verbose')) {
							var log = 'Adding ' + preloadFile;
							if (iOriginalSize && iCompressedSize && iOriginalSize !== iCompressedSize) {
								log += ' (' + maxmin({ length: iOriginalSize }, { length: iCompressedSize }) + ')';
							}
							grunt.verbose.writeln(log);
						}

						preloadObject.modules[preloadFile] = fileContent;
					});

					var content = JSON.stringify(preloadObject, null, '\t');
					if (typeof preloadInfo.processContent === 'function') {
						content = preloadInfo.processContent(content);
					}

					var destPath = options.dest;
					var preloadResourceInfo = resourceMap[preloadFile];
					if (preloadModuleName.indexOf(preloadResourceInfo.prefix) === 0) {
						destPath = path.join(destPath, preloadModuleName.substr(preloadResourceInfo.prefix.length));
					} else {
						destPath = path.join(destPath, preloadModuleName);
					}
					destPath += preloadInfo.ext;

					grunt.file.write(destPath, content);
					var log = 'File ' + destPath + ' created with ' + Object.keys(preloadObject.modules).length + ' files';
					if (iPreloadOriginalSize && iPreloadCompressedSize && iPreloadOriginalSize !== iPreloadCompressedSize) {
						log += ' (' + maxmin({ length: iPreloadOriginalSize }, { length: iPreloadCompressedSize }) + ')';
					}
					grunt.log.writeln(log);

				});

			});

		});

	});
};
