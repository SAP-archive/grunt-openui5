"use strict";

const openui5 = {
	connect: require("connect-openui5")
};
const serveStatic = require("serve-static");
const inject = require("connect-inject");
const cors = require("cors");
const urljoin = require("urljoin");

const liveReloadLessCssPlugin = `
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
		if (path.match(/\\.less$/i)) {
			return this.window.LiveReload.reloader.reloadStylesheet(path);
		}
		if (options.originalPath.match(/\\.less$/i)) {
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
};`;

module.exports = function(grunt, config) {
	grunt.registerMultiTask("openui5_connect", "Grunt task to start an OpenUI5 connect server", function() {
		// Merge task-specific and/or target-specific options with these defaults.
		const options = this.options({
			contextpath: "/",
			appresources: [],
			resources: [],
			testresources: [],
			cors: null,
			proxypath: null,
			proxyOptions: null,
			lessOptions: null
		});

		// normalize strings to arrays for "resources" options
		["appresources", "resources", "testresources"].forEach(function(optionName) {
			const option = options[optionName];
			if (typeof option === "string") {
				options[optionName] = [option];
			}
		});

		const target = this.target;
		const args = this.args;

		// Make sure the same target is configured for the 'connect' task
		this.requiresConfig(["connect", this.target]);

		// save original middleware object before overwriting it
		const vOriginalMiddleware =
			grunt.config(["connect", target, "options", "middleware"]) ||
			grunt.config(["connect", "options", "middleware"]);

		// Adopt connect middleware
		grunt.config(["connect", target, "options", "middleware"], function(connect, connectOptions, middlewares) {
			middlewares = []; // clear existing middlewares

			// get connect app instance
			const app = connect();

			// adds the middleware (with optional context url)
			function mountMiddleware(middleware, context) {
				if (typeof context === "string") {
					middleware = app.use(urljoin("/", options.contextpath, context), middleware);
				}
				middlewares.push(middleware);
			}

			// returns a function that mounts the static middleware using the provided path
			function mountStatic(context) {
				return function(staticPath) {
					mountMiddleware(serveStatic(staticPath, {dotfiles: "allow"}), context);
				};
			}

			// handle livereload option including css/less files (reload css if less files got changed)
			if (connectOptions.livereload !== false) {
				const port = (connectOptions.livereload === true) ? 35729 : connectOptions.livereload;
				connectOptions.livereload = false; // prevent grunt-contrib-connect from inserting the livereload script
				mountMiddleware(inject({
					snippet: [
						"\n<script>//<![CDATA[\n" + liveReloadLessCssPlugin + "\n//]]></script>\n",
						"\n<script>//<![CDATA[\ndocument.write(\"<script src='//\" + " +
						"(location.hostname || \"localhost\") + \":" +
						port +
						"/livereload.js?snipver=1'><\\/script>\")\n//]]></script>\n"
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
			}), "/discovery");

			// mount all static paths
			options.appresources.forEach(mountStatic("/"));
			options.resources.forEach(mountStatic("/resources"));
			options.testresources.forEach(mountStatic("/test-resources"));

			// compile themes on-the-fly using openui5 less middleware
			options.lessOptions = options.lessOptions || {};
			options.lessOptions.rootPaths = options.resources;
			mountMiddleware(openui5.connect.less(options.lessOptions), "/resources");

			// mount a generic proxy
			if (options.proxypath) {
				mountMiddleware(
					openui5.connect.proxy(
						typeof options.proxyOptions === "object" ? options.proxyOptions : undefined
					),
					options.proxypath
				);
			}

			// run original middleware function
			if (typeof vOriginalMiddleware === "function") {
				middlewares = vOriginalMiddleware.call(this, connect, connectOptions, middlewares);
			}

			return middlewares;
		});

		// Run the 'connect' task with the same target and arguments
		let task = "connect:" + target;
		if (args.length > 0) {
			task += ":" + args.join(":");
		}
		grunt.task.run(task);
	});
};
