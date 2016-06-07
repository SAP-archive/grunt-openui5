// Copyright 2016 SAP SE.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http: //www.apache.org/licenses/LICENSE-2.0
//
// Unless 	 by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the License.

'use strict';

var path = require('path');

var debugResourcePattern = /(-dbg\.js|-dbg\.controller\.js|-dbg\.view\.js|-dbg\.fragment\.js|-dbg\.css)$/;
var mergedResourcePattern = /(Component-preload\.js|library-preload\.js|library-preload-dbg\.js|library-preload\.json|library-all\.js|library-all-dbg\.js)$/;
var localePattern = /^((?:[^\/]+\/)*[^\/]+?)_([A-Z]{2}(?:_[A-Z]{2}(?:_[A-Z0-9_]+)?)?)(\.properties|\.hdbtextbundle)/i;
var designtimeResourcePattern = /(\.designtime\.js|\.control|\.interface|\.type|themes\/[^\/]*\/[^\/]*\.less)$/;
var themePattern = /^((?:[^\/]+\/)*)themes\/([^\/]+)\//;

module.exports = function(grunt) {

	grunt.registerMultiTask('openui5_resourcelist', 'Create resource list', function() {

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			dest: null
		});

		var isDebugResource = function(file) {
			return file.match(debugResourcePattern);
		}

		var isMergedResource = function(file) {
			return file.match(mergedResourcePattern);
		}

		var isDesigntimeResource = function(file) {
			return file.match(designtimeResourcePattern);
		}

		var localizedProperty = function(file) {
			var match = file.match(localePattern);
			if (match) {
				return { raw: match[1] + match[3], locale: match[2] };
			} else {
				return null;
			}
		}

		var getTheme = function(file) {
			var match = file.match(themePattern);
			if (match) {
				return match[2];
			} else {
				return null;
			}
		}

		var resources = [];

		// set default values for destination and extract cwd
		if (typeof options.dest === 'undefined' || options.dest === null) {
			options.dest = 'resources.json';
		}
		var cwd = null;
		if (typeof this.data.files !== 'undefined' && this.data.files !== null
			&& this.data.files.length != 0
			&& typeof this.data.files[0].cwd !== 'undefined' && this.data.files[0].cwd !== null) {
			cwd = this.data.files[0].cwd;
		} else {
			grunt.fail.warn('No valid cwd as root dir for resourcelist defined.');
			return;
		}
		grunt.verbose.writeln('Take ' + cwd + ' as root dir.');

		// dest was given relative to cwd
		var resourceListFile = path.posix.join(cwd, options.dest);

		// calculate cwd path relative to resource list file.
		// All the resource.json entry paths have to be prefixed with them to make them relative to the 
		// resource.json location
		var resoucelistRelativePath = path.posix.relative(path.posix.parse(resourceListFile).dir, cwd);

		var getResourceElement = function(p) {
			var resourceElement = { name: path.posix.join(resoucelistRelativePath, p) };
			if (isDebugResource(p)) { resourceElement.isDebug = "true" };
			if (isMergedResource(p)) { resourceElement.merged = "true" };
			if (isDesigntimeResource(p)) { resourceElement.designtime = "true" };
			var localeData = localizedProperty(p);
			if (localeData) {
				resourceElement.raw = localeData.raw;
				resourceElement.locale = localeData.locale;
			}
			var themeData = getTheme(p);
			if (themeData) {
				resourceElement.theme = themeData;
			}
			return resourceElement;
		}

		var createFileStructure = function(f) {

			var src = f.src.filter(function(filepath) {
				if (!grunt.file.isDir(filepath)) {
					return true;
				};
				grunt.verbose.writeln(filepath + ' is directory entry, skipped.');
				return false;
			});

			if (src.length !== 0) {
				resources.push(getResourceElement(f.dest));
			}
		}

		// Iterate over all src-dest file pairs. Filter the dirs. Populate resources array.
		this.files.forEach(createFileStructure);
		var noOfFiles = resources.length;
		resources = { 'resources': resources };

		grunt.file.write(resourceListFile, JSON.stringify(resources, null, '\t'));
		grunt.log.writeln('File ' + resourceListFile + ' created with ' + noOfFiles + ' files.');

	});
}
