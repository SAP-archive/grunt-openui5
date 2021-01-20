"use strict";

const path = require("path");
const slash = require("slash");
const terser = require("terser");
const pd = require("pretty-data").pd;
const maxmin = require("maxmin");

const defaultResourcePatterns = [
	"**/*.js",
	"**/*.fragment.html",
	"**/*.fragment.json",
	"**/*.fragment.xml",
	"**/*.view.html",
	"**/*.view.json",
	"**/*.view.xml",
	"**/*.properties"
];

const copyrightCommentsPattern = /copyright|\(c\)|released under|license|\u00a9/i;
const xmlHtmlPrePattern = /<(?:\w+:)?pre>/;

function createJSPreload(preloadObject) {
	return "sap.ui.require.preload(" +
		JSON.stringify(preloadObject.modules, null, "\t") + ", \"" + preloadObject.name + "\");";
}
function createLegacyJSPreload(preloadObject) {
	return "jQuery.sap.registerPreloadedModules(" + JSON.stringify(preloadObject, null, "\t") + ");";
}
function createLegacyJSONPreload(preloadObject) {
	return JSON.stringify(preloadObject, null, "\t");
}

module.exports = function(grunt) {
	grunt.registerMultiTask("openui5_preload", "Create OpenUI5 preload files", function() {
		const done = this.async();
		preloadTask.apply(this).then(done, done);
	});

	async function preloadTask() {
		// Merge task-specific and/or target-specific options with these defaults.
		const options = this.options({
			resources: [],
			dest: null,
			compress: true,
			compatVersion: "edge"
		});

		const resourceMap = {};

		// normalize string/object to array
		if (
			typeof options.resources === "string" ||
			(typeof options.resources === "object" && !(options.resources instanceof Array))
		) {
			options.resources = [options.resources];
		}

		if (options.resources.length === 0) {
			grunt.fail.warn("\"resources\" option is not specified!");
			return;
		}

		grunt.verbose.subhead("Collecting resources");

		// process resources array
		options.resources.forEach(function(resource) {
			// transform string shorthand to object
			if (typeof resource === "string") {
				resource = {
					cwd: resource
				};
			}

			if (typeof resource.prefix !== "string") {
				resource.prefix = "";
			}

			resource.src = resource.src || defaultResourcePatterns;

			grunt.verbose.writeflags(resource, "resource");

			grunt.file.expand({
				cwd: resource.cwd,
				dot: true,
				filter: "isFile"
			}, resource.src).forEach(function(file) {
				let localFile = file;
				if (resource.prefix) {
					localFile = slash(path.join(resource.prefix, file));
				}
				const fullPath = path.join(resource.cwd, file);
				grunt.verbose.write("Collecting " + localFile + " (" + fullPath + ")...").ok();
				resourceMap[localFile] = {
					fullPath: fullPath,
					prefix: resource.prefix
				};
			});
		});

		const resourceFiles = Object.keys(resourceMap);

		if (resourceFiles.length === 0) {
			grunt.fail.warn("No files found. Check your \"resources\" option!");
			return;
		}

		const preloadData = this.data;
		if (!preloadData["components"] && !preloadData["libraries"]) {
			grunt.fail.warn("No preload type specified. " +
				"Please provide \"components\" and/or \"libraries\" in task target object!");
			return;
		}

		const preloadTypes = ["components", "libraries"];
		for (const preloadType of preloadTypes) {
			let iMajor;	let iMinor;	let preloadInfo; let preloadOptions;
			preloadOptions = preloadData[preloadType];
			if (!preloadOptions) {
				continue;
			}

			if (options.compatVersion !== "edge") {
				const aVersionMatch = options.compatVersion.match(/^([0-9]+)\.([0-9]+)$/);
				if (!aVersionMatch) {
					grunt.fail.warn("'" + options.compatVersion + "' is not a valid value for option compatVersion!");
					continue;
				}
				iMajor = parseInt(aVersionMatch[1], 10);
				iMinor = parseInt(aVersionMatch[2], 10);
			}

			if (preloadType === "libraries") {
				preloadInfo = {
					moduleName: "library-preload",
					ext: ".js",
					indicatorFile: "library.js"
				};

				if (options.compatVersion === "edge" || (iMajor === 1 && iMinor >= 54) || iMajor > 1) {
					// Build library-preload as .js file
					preloadInfo.createContent = createJSPreload;
				} else if (iMajor === 1 && iMinor >= 40 && iMinor < 54) {
					// Build library-preload as .js file
					preloadInfo.createContent = createLegacyJSPreload;
				} else {
					// Build as .json file (legacy, needed because UI5 < 1.40 only loads the .json files)
					preloadInfo.ext = ".json";
					preloadInfo.processModuleName = function(moduleName) {
						return moduleName.replace(/\//g, ".");
					};
					preloadInfo.createContent = createLegacyJSONPreload;
				}
			} else {
				preloadInfo = {
					moduleName: "Component-preload",
					ext: ".js",
					indicatorFile: "Component.js"
				};

				if (options.compatVersion === "edge" || (iMajor === 1 && iMinor >= 54) || iMajor > 1) {
					preloadInfo.createContent = createJSPreload;
				} else {
					preloadInfo.createContent = createLegacyJSPreload;
				}
			}


			if (preloadOptions === true) {
				preloadOptions = "**";
			}
			if (typeof preloadOptions === "string") {
				const pattern = preloadOptions;
				preloadOptions = {};
				preloadOptions[pattern] = {};
			}

			const preloadOptionKeys = Object.keys(preloadOptions);

			if (preloadOptionKeys.length === 0) {
				grunt.log.writeflags(preloadOptions, "preloadOptions");
				grunt.fail.warn("No valid options provided for \"" + preloadType + "\" preload!");
				continue;
			}

			for (const preloadPattern of preloadOptionKeys) {
				const preloadOption = preloadOptions[preloadPattern];
				const preloadFiles = grunt.file.match(preloadPattern + "/" + preloadInfo.indicatorFile, resourceFiles);

				if (preloadFiles.length < 1) {
					grunt.fail.warn("No \"" + preloadInfo.indicatorFile +
						"\" found for pattern \"" + preloadPattern + "\"!");
					continue;
				}

				for (const preloadFile of preloadFiles) {
					const preloadDir = path.dirname(preloadFile);
					const preloadModuleName = preloadDir + "/" + preloadInfo.moduleName;

					grunt.verbose.subhead("Creating preload module for " + preloadFile);

					const preloadObject = {
						version: "2.0",
						name: preloadModuleName,
						modules: {}
					};

					if (typeof preloadInfo.processModuleName === "function") {
						preloadObject.name = preloadInfo.processModuleName(preloadModuleName);
					} else {
						preloadObject.name = preloadModuleName;
					}

					let preloadPatterns = preloadOption.src ? preloadOption.src : [preloadDir + "/**"];
					if (typeof preloadPatterns === "string") {
						preloadPatterns = [preloadPatterns];
					}

					// Always exclude the corresponding preload file (Component-preload.js / library-preload.json)
					// Otherwise it might get included every time the build runs if src / dest are the same dir
					preloadPatterns.push("!" + preloadDir + "/" + preloadInfo.moduleName + preloadInfo.ext);

					const preloadFiles = grunt.file.match(preloadPatterns, resourceFiles);
					if (preloadFiles.length === 0) {
						const patternsString =
							(typeof preloadPatterns === "string") ? preloadPatterns : preloadPatterns.join("\", \"");
						grunt.fail.warn("No files found for pattern(s): \"" + patternsString + "\"!");
						continue;
					}

					let iPreloadOriginalSize = 0; let iPreloadCompressedSize = 0;

					for (const preloadFile of preloadFiles) {
						const fileName = resourceMap[preloadFile].fullPath;
						let fileContent = grunt.file.read(fileName);
						const fileExtension = path.extname(fileName);

						let iOriginalSize; let iCompressedSize;

						if (options.compress) {
							iOriginalSize = fileContent.length;
							iPreloadOriginalSize += iOriginalSize;

							// Convert default compression to empty configuration object
							if (options.compress === true) {
								options.compress = {};
							}

							// Make sure to have an object
							options.compress.terser = options.compress.terser || options.compress.uglifyjs || {};

							// Set default "comments" option if not given already
							options.compress.terser.output = options.compress.terser.output || {};
							if (!Object.prototype.hasOwnProperty.call(options.compress.terser.output, "comments")) {
								options.compress.terser.output.comments = copyrightCommentsPattern;
							}

							try {
								switch (fileExtension) {
								case ".js":
									// Javascript files are processed by Uglify
									fileContent = (await terser.minify(fileContent, options.compress.terser)).code;
									break;
								case ".json":
									// JSON is parsed and written to string again to remove unwanted white space
									fileContent = JSON.stringify(JSON.parse(fileContent));
									break;
								case ".xml":
									// For XML we use the pretty data

									// Do not minify if XML(View) contains an <*:pre> tag because whitespace of
									// HTML <pre> should be preserved (should only happen rarely)
									if (!xmlHtmlPrePattern.test(fileContent)) {
										fileContent = pd.xmlmin(fileContent, false);
									}

									break;
								}
							} catch (e) {
								grunt.log.error("Failed to compress " + fileName +
									". This might be due to a syntax error in the file.");
								grunt.fail.warn(e);
							}

							iCompressedSize = fileContent.length;
							iPreloadCompressedSize += iCompressedSize;
						}

						if (grunt.option("verbose")) {
							let log = "Adding " + preloadFile;
							if (iOriginalSize && iCompressedSize && iOriginalSize !== iCompressedSize) {
								log += " (" + maxmin({length: iOriginalSize}, {length: iCompressedSize}) + ")";
							}
							grunt.verbose.writeln(log);
						}

						preloadObject.modules[preloadFile] = fileContent;
					}

					const content = preloadInfo.createContent(preloadObject);

					let destPath = options.dest;
					const preloadResourceInfo = resourceMap[preloadFile];
					if (preloadModuleName.indexOf(preloadResourceInfo.prefix) === 0) {
						destPath = path.join(destPath, preloadModuleName.substr(preloadResourceInfo.prefix.length));
					} else {
						destPath = path.join(destPath, preloadModuleName);
					}
					destPath += preloadInfo.ext;

					grunt.file.write(destPath, content);
					let log = "File " + destPath + " created with " +
						Object.keys(preloadObject.modules).length + " files";
					if (
						iPreloadOriginalSize && iPreloadCompressedSize &&
						iPreloadOriginalSize !== iPreloadCompressedSize
					) {
						log += " (" + maxmin({length: iPreloadOriginalSize}, {length: iPreloadCompressedSize}) + ")";
					}
					grunt.log.writeln(log);
				}
			}
		}
	}
};
