/* eslint-env mocha */
"use strict";

const fileContent = require("./asserts/fileContent");
function themeTestcase(sFolderName) {
	return function() {
		fileContent.equal({
			sActualFileSource: "tmp/theme/" + sFolderName + "/library.css",
			sExpectedFileSource: "test/theme/expected/" + sFolderName + "/library.css",
			sMessage: "css file should be correctly created."
		});

		fileContent.equal({
			sActualFileSource: "tmp/theme/" + sFolderName + "/library-RTL.css",
			sExpectedFileSource: "test/theme/expected/" + sFolderName + "/library-RTL.css",
			sMessage: "rtl css file should be correctly created."
		});

		fileContent.equal({
			sActualFileSource: "tmp/theme/" + sFolderName + "/library-parameters.json",
			sExpectedFileSource: "test/theme/expected/" + sFolderName + "/library-parameters.json",
			sMessage: "parameters file should be correctly created."
		});
	};
}

describe("openui5_theme", function() {
	it("default_options", themeTestcase("default_options"));

	it("compress_option", themeTestcase("compress_option"));

	it("rootPaths_option", themeTestcase("rootPaths_option"));
});
