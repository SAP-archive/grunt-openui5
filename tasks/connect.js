// Copyright 2014 SAP SE.
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

var oui5connect = require('connect-openui5'),
	cors = require('cors');

// connect server
module.exports = function(grunt, config) {

	/*
	// some playground testing
	grunt.event.on('watch', function(action, filepath) {
		console.log("Resource changed: " + filepath + " - action: " + action);
	});
	*/

	grunt.registerMultiTask('openui5_connect', 'Grunt task to start a connect server', function(mode) {

		// Merge task-specific and/or target-specific options with these defaults.
		var configOptions = this.options({
			contextpath: '',
			appresources: [],
			resources: [],
			registerResources: true,
			testresources: [],
			registerTestresources: true,
			useLess: false,
			keepalive: true
		});

		grunt.config(['connect'], {

			// default options
			options: {

				// makes the server accessible from the outside
				hostname: '0.0.0.0',

				// port can be specified via grunt option: --port=8080
				onCreateServer: function(server, connect, options) {
					var port = configOptions.port;
					options.port = typeof port !== 'undefined' ? port : 8080;
				},

				// enable injecting livereload script into html pages
				livereload: configOptions.livereload || false

			},

			// for development serve all projects from the individual src folders
			run: {

				options: {

					// add middleware to remove testsuite segment from url
					// add .properties Content-Type middleware
					middleware: function(connect, options, aMiddleware) {

						aMiddleware = []; // ignore the original middleware

						// Cors header must be set on all responses
						if (configOptions.cors) {
							aMiddleware.push(cors({
								origin: configOptions.cors
							}));
						}

						// register a context handler for testsuite and a properties handler
						// for the I18N files which are ISO-8859-1 encoded and the header must specify this
						if (configOptions.contextpath) {
							aMiddleware.push(oui5connect.context(configOptions.contextpath));
						}
						aMiddleware.push(oui5connect.properties());

						// register the less on-the-fly compiler handler
						if (configOptions.useLess) {
							aMiddleware.push(connect().use('/resources', oui5connect.less({
									paths: configOptions.resources
							})));
						}

						// register the handler for application resources, resources and test resources
						configOptions.appresources.forEach(function(sPath) {
							aMiddleware.push(connect().use('/', connect.static(sPath)));
						});
						if (configOptions.registerResources) {
							configOptions.resources.forEach(function(sPath) {
								aMiddleware.push(connect().use('/resources', connect.static(sPath, {hidden:true})));
							});
						}
						if (configOptions.registerTestresources) {
							configOptions.testresources.forEach(function(sPath) {
								aMiddleware.push(connect().use('/test-resources', connect.static(sPath)));
							});
						}

						// register the discovery service
						aMiddleware.push(oui5connect.discovery({
							contextpath: configOptions.contextpath,
							appresources: configOptions.appresources,
							resources: configOptions.resources,
							testresources: configOptions.testresources
						}));

						return aMiddleware;

					}

				}
			}

		});

		if (grunt.option('watch')) {
			grunt.task.run([ 'connect:run', 'watch' ]);
		} else {
			grunt.task.run([ 'connect:run' + (configOptions.keepalive ? ':keepalive' : '') ]);
		}

	});

};
