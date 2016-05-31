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

'use strict';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({

		eslint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js',
				'<%= mochaTest.tests.src %>'
			]
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: [
				'tmp',
				'test/preload/fixtures/app-same-dest/my/app/Component-preload.js',
				'test/preload/fixtures/library-same-dest/my/ui/lib/library-preload.json'
			]
		},

		// Configuration to be run (and then tested).
		'openui5_theme': {
			'default_options': {
				options: {},
				files: [
					{
						expand: true,
						cwd: 'test/theme/fixtures/lib1/my/theme/foo',
						src: 'foo.less',
						dest: 'tmp/theme/default_options'
					}
				]
			},
			'compress_option': {
				options: {
					compiler: {
						compress: true
					}
				},
				files: [
					{
						expand: true,
						cwd: 'test/theme/fixtures/lib1/my/theme/foo',
						src: 'foo.less',
						dest: 'tmp/theme/compress_option'
					}
				]
			},
			'rootPaths_option': {
				options: {
					rootPaths: [
						'test/theme/fixtures/lib1',
						'test/theme/fixtures/lib2'
					]
				},
				files: [
					{
						expand: true,
						cwd: 'test/theme/fixtures/lib2/my/theme/bar',
						src: 'bar.less',
						dest: 'tmp/theme/rootPaths_option'
					}
				]
			}
		},

		// Configuration to be run (and then tested).
		'openui5_preload': {

			'component_default_options': {
				options: {
					resources: 'test/preload/fixtures/app',
					dest: 'tmp/preload/component_default_options'
				},
				components: '**'
			},

			'component_resource_prefix': {
				options: {
					resources: [
						{
							cwd: 'test/preload/fixtures/app/my/app',
							prefix: 'my/app'
						}
					],
					dest: 'tmp/preload/component_resource_prefix'
				},
				components: 'my/app'
			},

			'component_no_compress': {
				options: {
					resources: 'test/preload/fixtures/app',
					dest: 'tmp/preload/component_no_compress',
					compress: false
				},
				components: '**'
			},

			// The following two targets are testing that a generated preload file
			// doesn't get included when runnign the preload again
			// (same folder for src and dest)
			'component_same_dest_1': {
				options: {
					resources: 'test/preload/fixtures/app-same-dest',
					dest: 'test/preload/fixtures/app-same-dest'
				},
				components: '**'
			},
			'component_same_dest_2': {
				options: {
					resources: 'test/preload/fixtures/app-same-dest',
					dest: 'test/preload/fixtures/app-same-dest'
				},
				components: '**'
			},

			'library_default_options': {
				options: {
					resources: 'test/preload/fixtures/library',
					dest: 'tmp/preload/library_default_options'
				},
				libraries: '**'
			},

			'library_resource_prefix': {
				options: {
					resources: [
						{
							cwd: 'test/preload/fixtures/library/my/ui/lib',
							prefix: 'my/ui/lib'
						}
					],
					dest: 'tmp/preload/library_resource_prefix'
				},
				libraries: 'my/ui/lib'
			},

			'library_no_compress': {
				options: {
					resources: 'test/preload/fixtures/library',
					dest: 'tmp/preload/library_no_compress',
					compress: false
				},
				libraries: '**'
			},

			// The following two targets are testing that a generated preload file
			// doesn't get included when runnign the preload again
			// (same folder for src and dest)
			'library_same_dest_1': {
				options: {
					resources: [
						{
							cwd: 'test/preload/fixtures/library-same-dest',
							src: [
								// Defaults
								'**/*.js',
								'**/*.fragment.html',
								'**/*.fragment.json',
								'**/*.fragment.xml',
								'**/*.view.html',
								'**/*.view.json',
								'**/*.view.xml',
								'**/*.properties',
								// Include "library-preload.json" for this test
								'**/library-preload.json'
							]
						}
					],
					dest: 'test/preload/fixtures/library-same-dest'
				},
				libraries: '**'
			},
			'library_same_dest_2': {
				options: {
					resources: [
						{
							cwd: 'test/preload/fixtures/library-same-dest',
							src: [
								// Defaults
								'**/*.js',
								'**/*.fragment.html',
								'**/*.fragment.json',
								'**/*.fragment.xml',
								'**/*.view.html',
								'**/*.view.json',
								'**/*.view.xml',
								'**/*.properties',
								// Include "library-preload.json" for this test
								'**/library-preload.json'
							]
						}
					],
					dest: 'test/preload/fixtures/library-same-dest'
				},
				libraries: '**'
			}

		},

		connect: {

			connectTest: {
				options: {
					port: 8080,
					middleware: function(connect, options, middlewares) {
						middlewares.push(['/foo', function(req, res, next) {
							res.end('bar');
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

		'openui5_connect': {

			connectTest: {
				options: {
					appresources: [
						'test/connect/fixtures',
						'test/connect/fixtures/app'
					],
					resources: [
						'test/connect/fixtures/someLib/resources',
						'test/connect/fixtures/anotherLib/res'
					],
					testresources: [
						'test/connect/fixtures/someLib/test-resources',
						'test/connect/fixtures/anotherLib/testres'
					],
					contextpath: 'mycontext',
					proxypath: 'proxy'
				}
			},

			serverToBeProxified: {
				options: {
					appresources: [
						'test/connect/fixtures',
						'test/connect/fixtures/app'
					],
					resources: [
						'test/connect/fixtures/someLib/resources',
						'test/connect/fixtures/anotherLib/res'
					],
					testresources: [
						'test/connect/fixtures/someLib/test-resources',
						'test/connect/fixtures/anotherLib/testres'
					],
					contextpath: 'mycontext'
				}
			}

		},

		// Configuration to be run (and then tested).
		'openui5_resourcelist': {
			js: {
				files: [{
					expand: true,
					src: '**/*.js',
					cwd: 'test/resourcelist/fixtures/js'
				}],
				options: {
					dest: 'tmp/resourcelist/js/resources.json'
				}
			},
			jsDbg: {
				files: [{
					expand: true,
					src: '**/*.js',
					cwd: 'test/resourcelist/fixtures/jsDbg'
				}],
				options: {
					dest: 'tmp/resourcelist/jsDbg/resources.json'
				}
			},
			css: {
				files: [{
					expand: true,
					src: '**/*.css',
					cwd: 'test/resourcelist/fixtures/css'
				}],
				options: {
					dest: 'tmp/resourcelist/css/resources.json'
				}
			},
			cssDbg: {
				files: [{
					expand: true,
					src: '**/*.css',
					cwd: 'test/resourcelist/fixtures/cssDbg'
				}],
				options: {
					dest: 'tmp/resourcelist/cssDbg/resources.json'
				}
			},
			properties: {
				files: [{
					expand: true,
					src: '**/*.properties',
					cwd: 'test/resourcelist/fixtures/properties'
				}],
				options: {
					dest: 'tmp/resourcelist/properties/resources.json'
				}
			},
			propertiesLocale: {
				files: [{
					expand: true,
					src: '**/*.properties',
					cwd: 'test/resourcelist/fixtures/propertiesLocale'
				}],
				options: {
					dest: 'tmp/resourcelist/propertiesLocale/resources.json'
				}
			},
			propertiesLocaleRegion: {
				files: [{
					expand: true,
					src: '**/*.properties',
					cwd: 'test/resourcelist/fixtures/propertiesLocaleRegion'
				}],
				options: {
					dest: 'tmp/resourcelist/propertiesLocaleRegion/resources.json'
				}
			}
		},

		// Unit tests.
		mochaTest: {
			tests: {
				src: ['test/*_test.js']
			}
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-connect');
	grunt.loadNpmTasks('grunt-eslint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-test');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', [
		'clean',

		'openui5_theme',
		'openui5_preload',
		'openui5_connect',
		'openui5_resourcelist',

		'mochaTest:tests'
	]);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['eslint', 'test']);

};
