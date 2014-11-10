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

var openui5 = {
	connect: require('connect-openui5')
};
var cors = require('cors');
var urljoin = require('url-join');

module.exports = function(grunt, config) {

	grunt.registerMultiTask('openui5_connect', 'Grunt task to start an OpenUI5 connect server', function() {

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			contextpath: '/',
			appresources: [],
			resources: [],
			testresources: [],
			cors: null,
			proxypath: null
		});

		// normalize strings to arrays for "resources" options
		['appresources', 'resources', 'testresources'].forEach(function(optionName) {
			var option = options[optionName];
			if (typeof option === 'string') {
				options[optionName] = [ option ];
			}
		});

		var target = this.target;
		var args = this.args;

		// Make sure the same target is configured for the 'connect' task
		this.requiresConfig(['connect', this.target]);

		// Adopt connect middleware
		grunt.config(['connect', target, 'options', 'middleware'], function(connect, connectOptions, middlewares) {
			middlewares = []; // clear existing middlewares

			// get connect app instance
			var app = connect();

			// adds the middleware (with optional context url)
			function mountMiddleware(middleware, context) {
				if (typeof context === 'string') {
					middleware = app.use(urljoin('/', options.contextpath, context), middleware);
				}
				middlewares.push(middleware);
			}

			// returns a function that mounts the static middleware using the provided path
			function mountStatic(context) {
				return function(staticPath) {
					mountMiddleware(connect.static(staticPath, { hidden: true }), context);
				};
			}

			// fix serving *.properties files (encoding)
			mountMiddleware(openui5.connect.properties());

			// enable cors when configured and pass in configuration
			if (options.cors) {
				mountMiddleware(cors(options.cors));
			}

			// mount discovery middleware (for testsuite)
			mountMiddleware(openui5.connect.discovery({
				appresources: options.appresources,
				resources: options.resources,
				testresources: options.testresources
			}), '/discovery');

			// mount all static paths
			options.appresources.forEach(mountStatic('/'));
			options.resources.forEach(mountStatic('/resources'));
			options.testresources.forEach(mountStatic('/test-resources'));

			// compile themes on-the-fly using openui5 less middleware
			mountMiddleware(openui5.connect.less({
				rootPaths: options.resources
			}), '/resources');

			// mount a generic proxy
			if (options.proxypath) {
				mountMiddleware(openui5.connect.proxy(), options.proxypath);
			}

			return middlewares;
		});

		// Run the 'connect' task with the same target and arguments
		var task = 'connect:' + target;
		if (args.length > 0) {
			task += ':' + args.join(':');
		}
		grunt.task.run(task);

	});

};
