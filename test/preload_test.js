// Copyright 2015 SAP SE.
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

/*eslint-env mocha */
'use strict';

var fileContent = require('./asserts/fileContent');

describe('openui5_preload', function() {

	describe('library', function() {

		it('default_options', function() {
			fileContent.equal({
				sActualFileSource: 'tmp/preload/library_default_options/my/ui/lib/library-preload.json',
				sExpectedFileSource: 'test/preload/expected/library_default_options/my/ui/lib/library-preload.json',
				sMessage: 'library preload JSON should be correctly created.'
			});
		});

		it('resource_prefix', function() {
			fileContent.equal({
				sActualFileSource: 'tmp/preload/library_resource_prefix/library-preload.json',
				sExpectedFileSource: 'test/preload/expected/library_resource_prefix/library-preload.json',
				sMessage: 'library preload JSON should be correctly created.'
			});
		});

		it('no_compress', function() {
			fileContent.equal({
				sActualFileSource: 'tmp/preload/library_no_compress/my/ui/lib/library-preload.json',
				sExpectedFileSource: 'test/preload/expected/library_no_compress/my/ui/lib/library-preload.json',
				sMessage: 'library preload JSON should be correctly created.'
			});
		});

	});

	describe('component', function() {

		it('default_options', function() {
			fileContent.equal({
				sActualFileSource: 'tmp/preload/component_default_options/my/app/Component-preload.js',
				sExpectedFileSource: 'test/preload/expected/component_default_options/my/app/Component-preload.js',
				sMessage: 'component preload JS should be correctly created.'
			});
		});

		it('resource_prefix', function() {
			fileContent.equal({
				sActualFileSource: 'tmp/preload/component_resource_prefix/Component-preload.js',
				sExpectedFileSource: 'test/preload/expected/component_resource_prefix/Component-preload.js',
				sMessage: 'component preload JS should be correctly created.'
			});
		});

		it('no_compress', function() {
			fileContent.equal({
				sActualFileSource: 'tmp/preload/component_no_compress/my/app/Component-preload.js',
				sExpectedFileSource: 'test/preload/expected/component_no_compress/my/app/Component-preload.js',
				sMessage: 'component preload JS should be correctly created.'
			});
		});

	});

});
