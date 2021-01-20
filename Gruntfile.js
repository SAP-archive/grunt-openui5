"use strict";

module.exports = function(grunt) {
	// Project configuration.
	grunt.initConfig({

		// Before generating any new files, remove any previously-created files.
		"clean": {
			tests: [
				"tmp",
				"test/preload/fixtures/app-same-dest/my/app/Component-preload.js",
				"test/preload/fixtures/library-same-dest/my/ui/lib/library-preload.json"
			]
		},

		// Configuration to be run (and then tested).
		"openui5_theme": {
			"default_options": {
				options: {},
				files: [
					{
						expand: true,
						cwd: "test/theme/fixtures/lib1/my/theme/foo",
						src: "foo.less",
						dest: "tmp/theme/default_options"
					}
				]
			},
			"compress_option": {
				options: {
					compiler: {
						compress: true
					}
				},
				files: [
					{
						expand: true,
						cwd: "test/theme/fixtures/lib1/my/theme/foo",
						src: "foo.less",
						dest: "tmp/theme/compress_option"
					}
				]
			},
			"rootPaths_option": {
				options: {
					rootPaths: [
						"test/theme/fixtures/lib1",
						"test/theme/fixtures/lib2"
					]
				},
				files: [
					{
						expand: true,
						cwd: "test/theme/fixtures/lib2/my/theme/bar",
						src: "bar.less",
						dest: "tmp/theme/rootPaths_option"
					}
				]
			}
		},

		// Configuration to be run (and then tested).
		"openui5_preload": {

			"component_default_options": {
				options: {
					resources: "test/preload/fixtures/app",
					dest: "tmp/preload/component_default_options"
				},
				components: "**"
			},

			"component_resource_prefix": {
				options: {
					resources: [
						{
							cwd: "test/preload/fixtures/app/my/app",
							prefix: "my/app"
						}
					],
					dest: "tmp/preload/component_resource_prefix"
				},
				components: "my/app"
			},

			"component_no_compress": {
				options: {
					resources: "test/preload/fixtures/app",
					dest: "tmp/preload/component_no_compress",
					compress: false
				},
				components: "**"
			},

			// The following two targets are testing that a generated preload file
			// doesn't get included when runnign the preload again
			// (same folder for src and dest)
			"component_same_dest_1": {
				options: {
					resources: "test/preload/fixtures/app-same-dest",
					dest: "test/preload/fixtures/app-same-dest"
				},
				components: "**"
			},
			"component_same_dest_2": {
				options: {
					resources: "test/preload/fixtures/app-same-dest",
					dest: "test/preload/fixtures/app-same-dest"
				},
				components: "**"
			},

			"component_compat_140": {
				options: {
					resources: "test/preload/fixtures/app",
					dest: "tmp/preload/component_compat_140",
					compatVersion: "1.40"
				},
				components: "**"
			},

			"component_compat_154": {
				options: {
					resources: "test/preload/fixtures/app",
					dest: "tmp/preload/component_compat_154",
					compatVersion: "1.54"
				},
				components: "**"
			},

			"library_default_options": {
				options: {
					resources: "test/preload/fixtures/library",
					dest: "tmp/preload/library_default_options"
				},
				libraries: "**"
			},

			"library_compat_138": {
				options: {
					resources: "test/preload/fixtures/library",
					dest: "tmp/preload/library_compat_138",
					compatVersion: "1.38"
				},
				libraries: "**"
			},

			"library_compat_140": {
				options: {
					resources: "test/preload/fixtures/library",
					dest: "tmp/preload/library_compat_140",
					compatVersion: "1.40"
				},
				libraries: "**"
			},

			"library_compat_154": {
				options: {
					resources: "test/preload/fixtures/library",
					dest: "tmp/preload/library_compat_154",
					compatVersion: "1.54"
				},
				libraries: "**"
			},

			"library_resource_prefix": {
				options: {
					resources: [
						{
							cwd: "test/preload/fixtures/library/my/ui/lib",
							prefix: "my/ui/lib"
						}
					],
					dest: "tmp/preload/library_resource_prefix"
				},
				libraries: "my/ui/lib"
			},

			"library_no_compress": {
				options: {
					resources: "test/preload/fixtures/library",
					dest: "tmp/preload/library_no_compress",
					compress: false
				},
				libraries: "**"
			},

			// The following two targets are testing that a generated preload file
			// doesn't get included when runnign the preload again
			// (same folder for src and dest)
			"library_same_dest_1": {
				options: {
					resources: [
						{
							cwd: "test/preload/fixtures/library-same-dest",
							src: [
								// Defaults
								"**/*.js",
								"**/*.fragment.html",
								"**/*.fragment.json",
								"**/*.fragment.xml",
								"**/*.view.html",
								"**/*.view.json",
								"**/*.view.xml",
								"**/*.properties",
								// Include "library-preload.json" for this test
								"**/library-preload.json"
							]
						}
					],
					dest: "test/preload/fixtures/library-same-dest"
				},
				libraries: "**"
			},
			"library_same_dest_2": {
				options: {
					resources: [
						{
							cwd: "test/preload/fixtures/library-same-dest",
							src: [
								// Defaults
								"**/*.js",
								"**/*.fragment.html",
								"**/*.fragment.json",
								"**/*.fragment.xml",
								"**/*.view.html",
								"**/*.view.json",
								"**/*.view.xml",
								"**/*.properties",
								// Include "library-preload.json" for this test
								"**/library-preload.json"
							]
						}
					],
					dest: "test/preload/fixtures/library-same-dest"
				},
				libraries: "**"
			},

			"library_custom_terser_params": {
				options: {
					resources: "test/preload/fixtures/library-custom-terser-params",
					dest: "tmp/preload/library_custom_terser_params",
					compress: {
						terser: {
							mangle: false,
							output: {
								ascii_only: true
							}
						}
					}
				},
				libraries: "**"
			},

			"library_custom_uglify_params": {
				options: {
					resources: "test/preload/fixtures/library-custom-uglify-params",
					dest: "tmp/preload/library_custom_uglify_params",
					compress: {
						uglifyjs: {
							mangle: false,
							output: {
								ascii_only: true
							}
						}
					}
				},
				libraries: "**"
			}

		},

		"connect": {

			connectTest: {
				options: {
					port: 8080,
					middleware: function(connect, options, middlewares) {
						middlewares.push(["/foo", function(req, res, next) {
							res.end("bar");
						}]);
						return middlewares;
					}
				}
			},

			serverToBeProxified: {
				options: {
					port: 9000
				}
			}

		},

		"openui5_connect": {

			connectTest: {
				options: {
					appresources: [
						"test/connect/fixtures",
						"test/connect/fixtures/app"
					],
					resources: [
						"test/connect/fixtures/someLib/resources",
						"test/connect/fixtures/anotherLib/res"
					],
					testresources: [
						"test/connect/fixtures/someLib/test-resources",
						"test/connect/fixtures/anotherLib/testres"
					],
					contextpath: "mycontext",
					proxypath: "proxy"
				}
			},

			serverToBeProxified: {
				options: {
					appresources: [
						"test/connect/fixtures",
						"test/connect/fixtures/app"
					],
					resources: [
						"test/connect/fixtures/someLib/resources",
						"test/connect/fixtures/anotherLib/res"
					],
					testresources: [
						"test/connect/fixtures/someLib/test-resources",
						"test/connect/fixtures/anotherLib/testres"
					],
					contextpath: "mycontext"
				}
			}

		},

		// Unit tests.
		"mochaTest": {
			tests: {
				src: ["test/*_test.js"]
			}
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks("tasks");

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks("grunt-contrib-connect");
	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-mocha-test");

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask("test", [
		"clean",

		"openui5_theme",
		"openui5_preload",
		"openui5_connect",

		"mochaTest:tests"
	]);

	// By default, lint and run all tests.
	grunt.registerTask("default", ["test"]);
};
