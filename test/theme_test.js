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

/*eslint-env mocha */
'use strict';

var assert = require('assert');
var grunt = require('grunt');

describe('openui5_theme', function() {

  it('default_options', function(done) {

    var actualCss = grunt.file.read('tmp/theme/default_options/library.css');
    var expectedCss = grunt.file.read('test/theme/expected/default_options/library.css');
    assert.equal(actualCss, expectedCss, 'css file should be correctly created.');

    var actualRtlCss = grunt.file.read('tmp/theme/default_options/library-RTL.css');
    var expectedRtlCss = grunt.file.read('test/theme/expected/default_options/library-RTL.css');
    assert.equal(actualRtlCss, expectedRtlCss, 'rtl css file should be correctly created.');

    var actualParameters = grunt.file.read('tmp/theme/default_options/library-parameters.json');
    var expectedParameters = grunt.file.read('test/theme/expected/default_options/library-parameters.json').replace(/\n$/, ''); // remove the last LF
    assert.equal(actualParameters, expectedParameters, 'parameters file should be correctly created.');

    done();
  });

  it('compress_option', function(done) {

    var actualCss = grunt.file.read('tmp/theme/compress_option/library.css');
    var expectedCss = grunt.file.read('test/theme/expected/compress_option/library.css').replace(/\n$/, ''); // remove the last LF
    assert.equal(actualCss, expectedCss, 'css file should be correctly created.');

    var actualRtlCss = grunt.file.read('tmp/theme/compress_option/library-RTL.css');
    var expectedRtlCss = grunt.file.read('test/theme/expected/compress_option/library-RTL.css').replace(/\n$/, ''); // remove the last LF
    assert.equal(actualRtlCss, expectedRtlCss, 'rtl css file should be correctly created.');

    var actualParameters = grunt.file.read('tmp/theme/compress_option/library-parameters.json');
    var expectedParameters = grunt.file.read('test/theme/expected/compress_option/library-parameters.json').replace(/\n$/, ''); // remove the last LF
    assert.equal(actualParameters, expectedParameters, 'parameters file should be correctly created.');

    done();
  });

  it('rootPaths_option', function(done) {

    var actualCss = grunt.file.read('tmp/theme/rootPaths_option/library.css');
    var expectedCss = grunt.file.read('test/theme/expected/rootPaths_option/library.css');
    assert.equal(actualCss, expectedCss, 'css file should be correctly created.');

    var actualRtlCss = grunt.file.read('tmp/theme/rootPaths_option/library-RTL.css');
    var expectedRtlCss = grunt.file.read('test/theme/expected/rootPaths_option/library-RTL.css');
    assert.equal(actualRtlCss, expectedRtlCss, 'rtl css file should be correctly created.');

    var actualParameters = grunt.file.read('tmp/theme/rootPaths_option/library-parameters.json');
    var expectedParameters = grunt.file.read('test/theme/expected/rootPaths_option/library-parameters.json').replace(/\n$/, ''); // remove the last LF
    assert.equal(actualParameters, expectedParameters, 'parameters file should be correctly created.');

    done();
  });

});
