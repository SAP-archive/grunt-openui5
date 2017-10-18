'use strict';


module.exports = function(grunt) {

	var rfc = require('node-rfc');
	var ip = require('ip');

	grunt.registerMultiTask("openui5_deploy_abap", "Deploy ui5 app to ABAP System", function() {

		var sArchive = this.data.targetDir + '/archive.zip';

		grunt.config.merge({
			compress: {
				openui5_deploy_build: {
					options: {
						archive: sArchive, //this.data.targetDir + '/archive.zip'
					},
					files: [{
							expand: 'true',
							cwd: this.data.targetDir,
							src: ['**']
						}, // includes files in path
					]
				}
			},
			connect: {
				openui5_deploy_build: {
					options: {
						useAvailablePort: true,
						base: this.data.targetDir
					}
				}
			},
			createTransportRequest: {
				default: {
					options: {
						description: this.data.transportDesc,
						conn: this.data.connection
					}
				}
			},
			uploadToABAP: {
				default: {
					options: {
						appName: this.data.appName,
						appDesc: this.data.appDesc,
						package: this.data.package,
						conn: this.data.connection
					}
				}
			},
			releaseTransport: {
				default: {
					options: {
						conn: this.data.connection
					}
				}
			}
		});

		grunt.loadNpmTasks('grunt-contrib-connect');

		grunt.event.once('connect.openui5_deploy_build.listening', function(host, port) {
			//Build the url to the zip after the web server starts
			var url = 'http://' + ip.address() + ':' + port + '/';
			grunt.log.writeln("Server started at: " + url);

			//Add the full path to the archive
			url = url + "archive.zip";
			grunt.log.writeln("Download zip at: " + url);

			//Ser the URL to use in the RFC call
			global['url'] = url
		});

		var rfcConnect = function(functionModule, importParameters, connection) {
			return new Promise(function(resolve, reject) {

				var client = new rfc.Client(connection);

				grunt.log.writeln("RFC client lib version:", client.getVersion());

				client.connect(function(err) {
					if (err) { // check for login/connection errors
						grunt.log.errorlns("could not connect to server", err);
						return reject();
					}
					// invoke remote enabled ABAP function module
					grunt.log.writeln("Invoking function module", functionModule);
					client.invoke(functionModule,
						importParameters,
						function(err, res) {
							if (err) { // check for errors (e.g. wrong parameters)
								grunt.log.errorlns("Error invoking", functionModule, err);
								return reject();
							}
							client.close();
							grunt.log.writeln("Messages:", res.EV_LOG_MESSAGES);
							return resolve(res);
						});
				});
			});
		};

		grunt.registerMultiTask("createTransportRequest", "Creates an ABAP Transport Request", function() {
			grunt.log.writeln("Creating Transport Request");

			var oOptions = this.options();

			var importParameters = {
				AUTHOR: oOptions.conn.user,
				TEXT: oOptions.description
			};
			var done = this.async();
			rfcConnect("BAPI_CTREQUEST_CREATE", importParameters, oOptions.conn)
				.then(
					function(returnValue) {
						if (returnValue.EV_SUCCESS == "E" || returnValue.EV_SUCCESS == "W") {
							grunt.log.errorlns("Error invoking BAPI_CTREQUEST_CREATE.");
							grunt.log.errorlns("Message Id:", returnValue.EV_MSG_ID);
							grunt.log.errorlns("Message No:", returnValue.EV_MSG_NO);
							grunt.log.errorlns("Messages:", returnValue.EV_LOG_MESSAGES);
							done(false);
							return;
						}
						if (returnValue.REQUESTID == "") {
							grunt.log.errorlns("Error invoking BAPI_CTREQUEST_CREATE.");
							grunt.log.errorlns("Transport request could not be created.");
							grunt.log.errorlns(returnValue.RETURN.MESSAGE);
							done(false);
							return;
						}
						grunt.log.writeln("Transport request", returnValue.REQUESTID, "created.");
						global['transport'] = returnValue.REQUESTID;
						done();
					},
					function() {
						done(false);
					});
		});

		grunt.registerMultiTask("uploadToABAP", "Uploads the application to the ABAP System", function() {
			grunt.log.writeln("Uploading to ABAP");

			var transportRequest = global['transport'];

			grunt.log.writeln("Transport request:", transportRequest);

			var oOptions = this.options();

			var importParameters = {
				IV_URL: global['url'],
				IV_SAPUI5_APPLICATION_NAME: oOptions.appName,
				IV_SAPUI5_APPLICATION_DESC: oOptions.appDesc,
				IV_PACKAGE: oOptions.package,
				IV_WORKBENCH_REQUEST: transportRequest,
				IV_TEST_MODE: "-",
				IV_EXTERNAL_CODE_PAGE: 'UTF8'
			};
			var done = this.async();
			grunt.log.writeln("Uploading application from", url);
			rfcConnect("/UI5/UI5_REPOSITORY_LOAD_HTTP", importParameters, oOptions.conn)
				.then(
					function(returnValue) {
						if (returnValue.EV_SUCCESS == "E" || returnValue.EV_SUCCESS == "W") {
							grunt.log.errorlns("Error invoking", "/UI5/UI5_REPOSITORY_LOAD_HTTP");
							grunt.log.errorlns("Message Id:", returnValue.EV_MSG_ID);
							grunt.log.errorlns("Message No:", returnValue.EV_MSG_NO);
							grunt.log.errorlns("Messages:", returnValue.EV_LOG_MESSAGES);
							done(false);
							return;
						}
						grunt.log.writeln("Application uploaded.");
						done();
					},
					function() {
						done(false);
					});
		});

		grunt.registerMultiTask("releaseTransport", "Releases an ABAP Transport Request", function() {
			grunt.log.writeln("Releasing Transport Request");
			var transportRequest = global['transport'];
			grunt.log.writeln("Transport request:", transportRequest);

			var oOptions = this.options();

			var importParameters = {
				REQUESTID: transportRequest,
				COMPLETE: "X",
				BATCH_MODE: "X"
			}
			var done = this.async();
			rfcConnect("BAPI_CTREQUEST_RELEASE", importParameters, oOptions.conn)
				.then(
					function(returnValue) {
						if (returnValue.EV_SUCCESS == "E" || returnValue.EV_SUCCESS == "W") {
							grunt.log.errorlns("Error invoking", "BAPI_CTREQUEST_RELEASE");
							grunt.log.errorlns("Message Id:", returnValue.EV_MSG_ID);
							grunt.log.errorlns("Message No:", returnValue.EV_MSG_NO);
							grunt.log.errorlns("Messages:", returnValue.EV_LOG_MESSAGES);
							done(false);
							return;
						}
						grunt.log.writeln("Transport request released.");
						done();
					},
					function() {
						done(false);
					});
		});


		grunt.task.run(['compress:openui5_deploy_build',
			'connect:openui5_deploy_build',
			'createTransportRequest',
			'uploadToABAP',
			'releaseTransport'
		]);

	});

};
