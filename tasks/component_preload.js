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

// TODO rethink configuration

var path   = require('path'),
    async  = require('async'),
    uglify = require('uglify-js'),
    pd     = require('pretty-data').pd;

var copyrightCommentsPattern = /copyright|\(c\)|released under|license|\u00a9/i;
var xmlHtmlPrePattern = /<(?:\w+:)?pre>/;
var registerFnStr = 'jQuery.sap.registerPreloadedModules(PRELOAD);';

module.exports = function (grunt) {

    function readFile(fileName, cb) {
        cb(grunt.file.read(fileName, { encoding: 'utf-8' }));
    }

    function compressFile(fileName, cb) {
        var result = grunt.file.read(fileName, { encoding: 'utf-8' }),
                extension = path.extname(fileName);

        switch (extension) {
            case '.js':
                // Javascript files are processed by Uglify
                result = uglify.minify(result, {
                    fromString: true,
                    warnings: grunt.option('verbose') === true,
                    output: {
                        comments: copyrightCommentsPattern
                    }
                }).code;
                cb(result);
                break;

            case '.json':
                // JSON is parsed and written to string again to remove unwanted white space
                result = JSON.stringify(JSON.parse(result));
                cb(result);
                break;

            case '.xml':
                // For XML we use the pretty data

                // Do not minify if XML(View) contains an <*:pre> tag because whitespace of HTML <pre> should be preserved (should only happen rarely)
                if (!xmlHtmlPrePattern.test(result)) {
                    result = pd.xmlmin(result, false);
                }

                cb(result);
                break;

            default:
                // We want to return just the file if we can't make it happen
                cb(result);
        }
    }

    grunt.registerMultiTask('openui5_component_preload', 'Create OpenUI5 Component Preload File', function () {

        // To call when complete
        var done = this.async(),

            // Merge task-specific and/or target-specific options with these defaults.
            options = this.options({
                componentName: '',
                dest: '',
                version: '2.0',
                compress: true
            }),

            // Location to write library file
            preloadDest  = path.join(options.dest, options.componentName.replace(/\./g, path.sep), 'Component-preload.js'),

            // The beginning of the library file
            preload = {
                version: options.version,
                name: options.componentName ? options.componentName.replace(/\./g, '/') + '/Component-preload.js' : null,
                modules: {}
            },

            jsSrc = {},

            builder = options.compress ? compressFile : readFile;

        // TODO check no file

        // Iterate over all specified file groups.
        async.eachSeries(this.files, function (fileObj, nextFileObj) {
            var files = fileObj.src.filter(function (filepath) {
                // Warn on and remove invalid source files (if nonull was set).
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file "' + filepath + '" not found.');
                    return false;
                }
                return true;
            });

            // TODO check no file
            async.concatSeries(files, function (file, next) {
                var moduleName = path.relative(fileObj.orig.cwd, file).split(path.sep).join('/');
                builder(file, function (src) {
                    //store js source separately, add placeholder to be replaced after JSON.stringify
                    if (path.extname(moduleName) === '.js') {
                        var srcName = moduleName.toUpperCase() + '_SRC';
                        preload.modules[moduleName] = srcName;
                        jsSrc[srcName] = 'function(){' + src + '}';
                    } else {
                        preload.modules[moduleName] = src;
                    }
                    next();
                });
            }, nextFileObj);

        }, function (err) {

            if (err) {
                done(err);
                return;
            }

             var preloadContent = registerFnStr.replace('PRELOAD', JSON.stringify(preload, null, '\t'));

            //replace placeholder with raw js source
            var prop;
            for (prop in jsSrc) {
                preloadContent = preloadContent.replace( '"' + prop + '"', jsSrc[prop]);
            }

            grunt.file.write(preloadDest, preloadContent);
            grunt.log.writeln('File ' + preloadDest + ' created with ' + Object.keys(preload.modules).length + ' files.');

           done();
        });
    });
};
