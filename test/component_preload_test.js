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

var fileContent = require('./asserts/fileContent');

describe('openui5_component_preload', function() {

    it('default_options', function() {

        fileContent.equal({
            sActualFileSource: 'tmp/component_preload/default_options/mycomp/Component-preload.js',
			sExpectedFileSource: 'test/component_preload/expected/default_options/mycomp/Component-preload.js',
            sMessage: 'preload JS should be correctly created.'
        });
    });

    it('raw_options', function() {

        fileContent.equal({
            sActualFileSource: 'tmp/component_preload/raw_options/mycomp/Component-preload.js',
            sExpectedFileSource: 'test/component_preload/expected/raw_options/mycomp/Component-preload.js',
            sMessage: 'preload JS should be correctly created.'
        });
    });
});
