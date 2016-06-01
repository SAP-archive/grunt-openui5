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

var debugResourcePattern = /(-dbg\.js|-dbg\.controller\.js|-dbg\.view\.js|-dbg\.fragment\.js|-dbg\.css)$/;
var mergedResourcePattern = /(Component-preload.js|library-preload.js|library-preload-dbg.js|library-preload.json|library-all.js|library-all-dbg.js)$/;
var localePattern = /^((?:[^\/]+\/)*[^\/]+?)_([A-Z]{2}(?:_[A-Z]{2}(?:_[A-Z0-9_]+)?)?)(\.properties|\.hdbtextbundle)/i;


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

		var localizedProperty = function(file) {
			var match = file.match(localePattern);
			if (match) {
				return { raw: match[1] + match[3], locale: match[2] };
			} else {
				return null;
			}
		}

		var getResourceElement = function(path) {
			var resourceElement = { name: path };
			if (isDebugResource(path)) { resourceElement.isDebug = "true" };
			if (isMergedResource(path)) { resourceElement.merged = "true" };
			var localeData = localizedProperty(path);
			if (localeData) {
				resourceElement.raw = localeData.raw;
				resourceElement.locale = localeData.locale;
			}
			return resourceElement;
		}

		var createFileStructure = function(path) {
			var dirEntries = fs.readdirSync(path);
			var resources = [];

			dirEntries.forEach(function(element) {
				if (fs.statSync(path + '/' + element).isFile()) {
					resources.push(getResourceElement(element));
				} else {
					resources = resources.concat(createFileStructure(path + '/' + element));
				}
			}, this);

			return resources;
		}

		var resources = [];

		var tmpFunc = function(f) {

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
		this.files.forEach(tmpFunc);
		var noOfFiles = resources.length;
		resources = { 'resources': resources };

		grunt.file.write(options.dest, JSON.stringify(resources, null, '\t'));
		grunt.log.writeln('File ' + options.dest + ' created with ' + noOfFiles + ' files.');

	});
}
