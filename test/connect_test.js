// Copyright 2014 SAP SE.
//
// Licensed under the Apache License, Version 2.0 (the 'License');
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http: //www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// 'AS IS' BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
// either express or implied. See the License for the specific
// language governing permissions and limitations under the License.

/*eslint-env mocha */
'use strict';

var assert = require('assert');
var http = require('http');

function getHttpStatus (sUrl, fnCallback) {
	var oOptions = {
		hostname: 'localhost',
		port: 8080,
		path: sUrl,
		method: 'GET'
	};
	console.log('start ' + sUrl);

	var oRequest = http.request(oOptions, function (oResponse) {

		//If you do not add this the server will hang after 5 requests
		oResponse.on('data', function() { /* do nothing */ });

		fnCallback(oResponse.statusCode);
	});


	oRequest.end();

}

function fnStatusOkTestCase(sUrl, fnDone) {
	getHttpStatus(sUrl, function (statusCode) {
		assert.equal(statusCode, 200, 'Did return a 200 for url: ' + sUrl + ' returned http-status: ' + statusCode);
		fnDone();
	});
}

function fnStatusNotFoundTestCase(sUrl, fnDone) {
	getHttpStatus(sUrl, function (iStatusCode) {
		assert.equal(iStatusCode, 404, 'Did return a 404 for url: ' + sUrl + ' returned http-status: ' + iStatusCode);
		fnDone();
	});
}

describe('openui5 connect should return status 200 ok for', function() {

	it('an existing test-resource file of another library', function(fnDone) {

		fnStatusOkTestCase('/mycontext/test-resources/SomeTest.html', fnDone);

	});

	it('a file in a different folter in the app resources', function(fnDone) {

		fnStatusOkTestCase('/mycontext/foo.html', fnDone);

	});

	it('an existing resource file', function(fnDone) {

		fnStatusOkTestCase('/mycontext/resources/controlOfAnotherLib.js', fnDone);

	});

	it('an existing test-resource file', function(fnDone) {

		fnStatusOkTestCase('/mycontext/test-resources/someTest.js', fnDone);

	});

	it('an existing resource file of another library', function(fnDone) {

		fnStatusOkTestCase('/mycontext/resources/someHtml.html', fnDone);

	});

	it('a file in the app resources', function(fnDone) {

		fnStatusOkTestCase('/mycontext/app.html', fnDone);

	});

});

describe('openui5 connect should return status 404 not found for', function() {

	it('a non existing resource file', function(fnDone) {

		fnStatusNotFoundTestCase('/mycontext/resources/hundekuchen.js', fnDone);

	});

	it('a existing resource file without the context path', function(fnDone) {

		fnStatusNotFoundTestCase('/resources/someHtml.html', fnDone);

	});

	it('a file in the app resources', function(fnDone) {

		fnStatusNotFoundTestCase('/resources/someHtml.html', fnDone);

	});

});