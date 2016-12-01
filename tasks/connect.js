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

var openui5 = {
	connect: require('connect-openui5')
};
var serveStatic = require('serve-static');
var inject = require('connect-inject');
var cors = require('cors');
var urljoin = require('urljoin');
var multiline = require('multiline');

var liveReloadLessCssPlugin = multiline(function() {/*
var LiveReloadPluginLessCss = function(window, host) {
	this.window = window;
	this.host = host;
};
LiveReloadPluginLessCss.identifier = 'less_css';
LiveReloadPluginLessCss.version = '1.0';
LiveReloadPluginLessCss.prototype.reload = function(path, options) {
	// do only run this if less is not loaded (LiveReload LessPlugin will handle this)
	if (!this.window.less) {
		// reload stylesheets (css) also if a less file was changed
		if (path.match(/\.less$/i)) {
			return this.window.LiveReload.reloader.reloadStylesheet(path);
		}
		if (options.originalPath.match(/\.less$/i)) {
			return this.window.LiveReload.reloader.reloadStylesheet(options.originalPath);
		}
	}
	return false;
};
LiveReloadPluginLessCss.prototype.analyze = function() {
	// disable the plugin if less is loaded (LiveReload LessPlugin will handle this)
	return {
		disable: (this.window.less && this.window.less.refresh)
	};
};
*/});

module.exports = function(grunt, config) {

	grunt.registerMultiTask('openui5_connect', 'Grunt task to start an OpenUI5 connect server', function() {

		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			contextpath: '/',
			appresources: [],
			resources: [],
			testresources: [],
			cors: null,
			proxypath: null,
			proxyOptions: null,
			lessOptions: null
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

		// save original middleware object before overwriting it
		var vOriginalMiddleware = grunt.config(['connect', target, 'options', 'middleware']) || grunt.config(['connect', 'options', 'middleware']);

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
					mountMiddleware(serveStatic(staticPath, { dotfiles: 'allow' }), context);
				};
			}

			// handle livereload option including css/less files (reload css if less files got changed)
			if (connectOptions.livereload !== false) {
				var port = (connectOptions.livereload === true) ? 35729 : connectOptions.livereload;
				connectOptions.livereload = false; // prevent grunt-contrib-connect from inserting the livereload script
				mountMiddleware(inject({
					snippet: [
						'\n<script>//<![CDATA[\n' + liveReloadLessCssPlugin + '\n//]]></script>\n',
						'\n<script>//<![CDATA[\ndocument.write("<script src=\'//" + (location.hostname || "localhost") + ":' + port + '/livereload.js?snipver=1\'><\\/script>")\n//]]></script>\n'
					]
				}));
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
			options.lessOptions = options.lessOptions || {};
			options.lessOptions.rootPaths = options.resources;
			mountMiddleware(openui5.connect.less(options.lessOptions), '/resources');

			// mount a generic proxy
			if (options.proxypath) {
				mountMiddleware(openui5.connect.proxy(typeof options.proxyOptions === 'object' ? options.proxyOptions : undefined), options.proxypath);
			}

			// run original middleware function
			if (typeof vOriginalMiddleware === 'function') {
				middlewares = vOriginalMiddleware.call(this, connect, connectOptions, middlewares);
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
