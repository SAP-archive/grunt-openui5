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

/*eslint-env mocha */
'use strict';

var fileContent = require('./asserts/fileContent');
function themeTestcase (sFolderName) {

	return function () {
		fileContent.equal({
			sActualFileSource : 'tmp/theme/' + sFolderName + '/library.css',
			sExpectedFileSource : 'test/theme/expected/' + sFolderName + '/library.css',
			sMessage : 'css file should be correctly created.'
		});

		fileContent.equal({
			sActualFileSource : 'tmp/theme/' + sFolderName + '/library-RTL.css',
			sExpectedFileSource : 'test/theme/expected/' + sFolderName + '/library-RTL.css',
			sMessage : 'rtl css file should be correctly created.'
		});

		fileContent.equal({
			sActualFileSource : 'tmp/theme/' + sFolderName + '/library-parameters.json',
			sExpectedFileSource : 'test/theme/expected/' + sFolderName + '/library-parameters.json',
			sMessage : 'parameters file should be correctly created.'
		});
	};

}

describe('openui5_theme', function() {

	it('default_options', themeTestcase('default_options'));

	it('compress_option', themeTestcase('compress_option'));

	it('rootPaths_option', themeTestcase('rootPaths_option'));

});
