/* eslint-env mocha */
"use strict";

const fileContent = require("./asserts/fileContent");

describe("openui5_preload", function() {
	describe("library", function() {
		it("default_options", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/library_default_options/my/ui/lib/library-preload.js",
				sExpectedFileSource: "test/preload/expected/library_default_options/my/ui/lib/library-preload.js",
				sMessage: "library preload JS should be correctly created."
			});
		});

		it("compat_138", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/library_compat_138/my/ui/lib/library-preload.json",
				sExpectedFileSource: "test/preload/expected/library_compat_138/my/ui/lib/library-preload.json",
				sMessage: "library preload JSON should be correctly created."
			});
		});

		it("compat_140", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/library_compat_140/my/ui/lib/library-preload.js",
				sExpectedFileSource: "test/preload/expected/library_compat_140/my/ui/lib/library-preload.js",
				sMessage: "library preload JS should be correctly created."
			});
		});

		it("compat_154", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/library_compat_154/my/ui/lib/library-preload.js",
				sExpectedFileSource: "test/preload/expected/library_compat_154/my/ui/lib/library-preload.js",
				sMessage: "library preload JS should be correctly created."
			});
		});

		it("resource_prefix", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/library_resource_prefix/library-preload.js",
				sExpectedFileSource: "test/preload/expected/library_resource_prefix/library-preload.js",
				sMessage: "library preload JS should be correctly created."
			});
		});

		it("no_compress", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/library_no_compress/my/ui/lib/library-preload.js",
				sExpectedFileSource: "test/preload/expected/library_no_compress/my/ui/lib/library-preload.js",
				sMessage: "library preload JS should be correctly created."
			});
		});

		it("custom_terser_params", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/library_custom_terser_params/my/ui/lib/library-preload.js",
				sExpectedFileSource: "test/preload/expected/library_custom_terser_params/my/ui/lib/library-preload.js",
				sMessage: "library preload JS should be correctly created."
			});
		});

		it("custom_uglify_params", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/library_custom_uglify_params/my/ui/lib/library-preload.js",
				sExpectedFileSource: "test/preload/expected/library_custom_uglify_params/my/ui/lib/library-preload.js",
				sMessage: "library preload JS should be correctly created."
			});
		});

		it("library_same_dest", function() {
			fileContent.equal({
				sActualFileSource: "test/preload/fixtures/library-same-dest/my/ui/lib/library-preload.js",
				sExpectedFileSource: "test/preload/expected/library_default_options/my/ui/lib/library-preload.js",
				sMessage: "library preload JS should be correctly created."
			});
		});
	});

	describe("component", function() {
		it("default_options", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/component_default_options/my/app/Component-preload.js",
				sExpectedFileSource: "test/preload/expected/component_default_options/my/app/Component-preload.js",
				sMessage: "component preload JS should be correctly created."
			});
		});

		it("compat_140", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/component_compat_140/my/app/Component-preload.js",
				sExpectedFileSource: "test/preload/expected/component_compat_140/my/app/Component-preload.js",
				sMessage: "component preload JS should be correctly created."
			});
		});

		it("compat_154", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/component_compat_154/my/app/Component-preload.js",
				sExpectedFileSource: "test/preload/expected/component_compat_154/my/app/Component-preload.js",
				sMessage: "component preload JS should be correctly created."
			});
		});

		it("resource_prefix", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/component_resource_prefix/Component-preload.js",
				sExpectedFileSource: "test/preload/expected/component_resource_prefix/Component-preload.js",
				sMessage: "component preload JS should be correctly created."
			});
		});

		it("no_compress", function() {
			fileContent.equal({
				sActualFileSource: "tmp/preload/component_no_compress/my/app/Component-preload.js",
				sExpectedFileSource: "test/preload/expected/component_no_compress/my/app/Component-preload.js",
				sMessage: "component preload JS should be correctly created."
			});
		});

		it("component_same_dest", function() {
			fileContent.equal({
				sActualFileSource: "test/preload/fixtures/app-same-dest/my/app/Component-preload.js",
				sExpectedFileSource: "test/preload/expected/component_default_options/my/app/Component-preload.js",
				sMessage: "component preload JS should be correctly created."
			});
		});
	});
});
