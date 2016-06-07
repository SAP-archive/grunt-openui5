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
	it("don't processes false -dbg.js files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/falseJsDbg/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/falseJsDbg/resources.json',
			sMessage: 'Resource list of false -dbg.js file was not correctly created.'
		});
	});
	it("processes css files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/css/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/css/resources.json',
			sMessage: 'Resource list of .css file was not correctly created.'
		});
	});
	it("processes -dbg.css files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/cssDbg/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/cssDbg/resources.json',
			sMessage: 'Resource list of -dbg.sss file was not correctly created.'
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
	it("processes false preload files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/falsePreload/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/falsePreload/resources.json',
			sMessage: 'Resource list of false preload file was not correctly created.'
		});
	});
	it("processes theme files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/theme/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/theme/resources.json',
			sMessage: 'Resource list of theme file was not correctly created.'
		});
	});
	it("processes designtime files", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/designtime/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/designtime/resources.json',
			sMessage: 'Resource list of designtime file was not correctly created.'
		});
	});
	it("creates custom resourcefile name", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/customResourcefileName/myResources.json',
			sExpectedFileSource: 'test/resourcelist/expected/customResourcefileName/myResources.json',
			sMessage: 'Resource list in subdir was not correctly created.'
		});
	});
	it("creates resourcefile in subdir", function() {
		fileContent.equal({
			sActualFileSource: 'tmp/resourcelist/resourcefileInSubdir/subdir1/subdir1_1/resources.json',
			sExpectedFileSource: 'test/resourcelist/expected/resourcefileInSubdir/subdir1/subdir1_1/resources.json',
			sMessage: 'Resource list in subdir was not correctly created.'
		});
	})
});

