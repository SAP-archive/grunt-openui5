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

describe('resourcelist', function() {
	it("processes js files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/js/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/js/resources.json',
			sMessage: 'Resource list of .js file was not correctly created.'
		});
	});
	it("processes -dbg.js files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/jsDbg/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/jsDbg/resources.json',
			sMessage: 'Resource list of -dbg.js file was not correctly created.'
		});
	});
	it("processes css files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/js/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/js/resources.json',
			sMessage: 'Resource list of .js file was not correctly created.'
		});
	});
	it("processes -dbg.css files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/jsDbg/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/jsDbg/resources.json',
			sMessage: 'Resource list of -dbg.js file was not correctly created.'
		});
	});
	it("processes .properties files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/properties/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/properties/resources.json',
			sMessage: 'Resource list of .properties file was not correctly created.'
		});
	});
	it("processes locale .properties files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/propertiesLocale/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/propertiesLocale/resources.json',
			sMessage: 'Resource list of locale .properties file was not correctly created.'
		});
	});
	it("processes region locale .properties files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/propertiesLocaleRegion/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/propertiesLocaleRegion/resources.json',
			sMessage: 'Resource list of region locale .properties file was not correctly created.'
		});
	});

});

