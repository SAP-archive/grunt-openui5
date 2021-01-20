/* eslint-env mocha */
"use strict";

const assert = require("assert");
const http = require("http");
const async = require("async");

function getHttpStatus(sUrl, fnCallback) {
	const oOptions = {
		hostname: "localhost",
		port: 8080,
		path: sUrl,
		method: "GET"
	};

	const oRequest = http.request(oOptions, function(oResponse) {
		// If you do not add this the server will hang after 5 requests
		oResponse.on("data", function() {/* do nothing */});

		fnCallback(oResponse.statusCode);
	});


	oRequest.end();
}

function fnStatusOkTestCase(sUrl, fnDone) {
	getHttpStatus(sUrl, function(statusCode) {
		assert.equal(statusCode, 200, "Did return a 200 for url: " + sUrl + " returned http-status: " + statusCode);
		fnDone();
	});
}

function fnStatusNotFoundTestCase(sUrl, fnDone) {
	getHttpStatus(sUrl, function(iStatusCode) {
		assert.equal(iStatusCode, 404, "Did return a 404 for url: " + sUrl + " returned http-status: " + iStatusCode);
		fnDone();
	});
}

describe("openui5 connect should return status 200 ok for", function() {
	it("an existing test-resource file of another library", function(fnDone) {
		fnStatusOkTestCase("/mycontext/test-resources/SomeTest.html", fnDone);
	});

	it("a file in a different folter in the app resources", function(fnDone) {
		fnStatusOkTestCase("/mycontext/foo.html", fnDone);
	});

	it("an existing resource file", function(fnDone) {
		fnStatusOkTestCase("/mycontext/resources/controlOfAnotherLib.js", fnDone);
	});

	it("an existing test-resource file", function(fnDone) {
		fnStatusOkTestCase("/mycontext/test-resources/someTest.js", fnDone);
	});

	it("an existing resource file of another library", function(fnDone) {
		fnStatusOkTestCase("/mycontext/resources/someHtml.html", fnDone);
	});

	it("a file in the app resources", function(fnDone) {
		fnStatusOkTestCase("/mycontext/app.html", fnDone);
	});

	it("a file from custom connect middleware", function(fnDone) {
		fnStatusOkTestCase("/foo", fnDone);
	});
});

describe("openui5 connect should return status 404 not found for", function() {
	it("a non existing resource file", function(fnDone) {
		fnStatusNotFoundTestCase("/mycontext/resources/hundekuchen.js", fnDone);
	});

	it("a existing resource file without the context path", function(fnDone) {
		fnStatusNotFoundTestCase("/resources/someHtml.html", fnDone);
	});

	it("a file in the app resources", function(fnDone) {
		fnStatusNotFoundTestCase("/resources/someHtml.html", fnDone);
	});
});

function connectTestcase(fnDone, sUrl) {
	let sExpectedData = "";
	let sActualData = "";
	let iExpectedStatusCode;
	let iActualStatusCode;
	const aCalls = [];

	aCalls.push(function(fnCallback) {
		http.get("http://localhost:9000/" + sUrl, function(oResponse) {
			oResponse.on("data", function(oData) {
				sExpectedData += oData;
			});
			iExpectedStatusCode = oResponse.statusCode;
			oResponse.on("end", fnCallback);
		});
	});

	aCalls.push(function(fnCallback) {
		http.get("http://localhost:8080/mycontext/proxy/http/localhost:9000/" + sUrl, function(oResponse) {
			oResponse.on("data", function(oData) {
				sActualData += oData;
			});
			iActualStatusCode = oResponse.statusCode;
			oResponse.on("end", fnCallback);
		});
	});

	async.parallel(aCalls, function() {
		assert.equal(sExpectedData, sActualData);
		assert.equal(iExpectedStatusCode, iActualStatusCode);
		fnDone();
	});
}

describe("openui5 connect should proxy requests", function() {
	it("proxies a request to an existing resource", function(done) {
		connectTestcase(done, "mycontext/resources/someHtml.html");
	});

	it("proxies a request to an non existing resource", function(done) {
		connectTestcase(done, "mycontext/resources/hundekuchen.js");
	});

	it("proxies a request to an non existing resource not in the context", function(done) {
		connectTestcase(done, "any/other/url.js");
	});
});
