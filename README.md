![OpenUI5](http://openui5.org/images/OpenUI5_new_big_side.png)

[![Build Status](http://img.shields.io/travis/SAP/grunt-openui5.svg?style=flat)](https://travis-ci.org/SAP/grunt-openui5)
[![NPM Version](http://img.shields.io/npm/v/grunt-openui5.svg?style=flat)](https://www.npmjs.org/package/grunt-openui5)

# grunt-openui5

> Grunt tasks around OpenUI5

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-openui5 --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-openui5');
```

## openui5_theme

### Overview

Builds a theme and creates the following files in the dest directory of the specified less file
 - library.css (regular css)
 - library-RTL.css (mirrored css for right-to-left support)
 - library-parameters.json (key-value map of all global less variables)

### Options

#### rootPaths
Type: `array` of `string`

Root paths to use for import directives.

This option differs from the `parser.paths` option.  
It is useful if less files are located in separate folders but referenced as they would all be in one.  
If `rootPaths` are provided and a file can not be found, the `parser.paths` option will be used instead.

#### parser

Type: `object`

Options for the [less](http://lesscss.org) parser (`less.Parser`).

#### compiler

Type `object`

Options for the [less](http://lesscss.org) compiler (`tree.toCss`).

### Usage Examples

#### Default Options

```js
grunt.initConfig({
  openui5_theme: {
    options: {},
    files: [
      {
        expand: true,
        cwd: 'lib1',
        src: 'my/ui/lib/themes/foo/library.source.less',
        dest: 'tmp'
      }
    ]
  },
});
```

Creates the following files
- tmp/my/ui/lib/themes/foo/library.css
- tmp/my/ui/lib/themes/foo/library-RTL.css
- tmp/my/ui/lib/themes/foo/library-parameters.json

#### Custom Options

If import directives are used to import files from other src folders, the root paths should be defined.  
The compress option can be used to minify the output css/json.

```js
grunt.initConfig({
  openui5: {
    options: {
      rootPaths: [
        'lib1',
        'lib2'
      ],
      compiler: {
        compress: true
      }
    },
    files: [
      {
        expand: true,
        cwd: 'lib2',
        src: 'my/ui/lib/themes/bar/library.source.less',
        dest: 'tmp'
      }
    ]
  },
});
```

Creates the following files
- tmp/my/ui/lib/themes/bar/library.css
- tmp/my/ui/lib/themes/bar/library-RTL.css
- tmp/my/ui/lib/themes/bar/library-parameters.json

## openui5_library_preload

### Overview

Creates a "library-preload.json" file which contains all files/modules specified in the task configuration.

### Options

#### libraryName
Type: `string`

Name of the library (e.g. foo.bar)

#### dest
Type: `string`  
Default value: `.`

Path to the dest folder in which the preload file should be created. All other dest paths (from the files configuration) will be ignored.

#### compress
Type: `boolean`
Default value: `true`

Optional parameter to turn off the compression/minifiers on the files.
- Javascript is minified using [UglifyJS2](https://github.com/mishoo/UglifyJS2) and copyright comments are preserved (comments matching regular expression `/copyright|\(c\)|released under|license|\u00a9/i` )
- XML is minified using [pretty-data](https://github.com/vkiryukhin/pretty-data)
- JSON is parsed for correctness and to remove extra whitespace

### Usage Examples

```js
grunt.initConfig({
  openui5_library_preload: {
    options: {
      libraryName: 'my.ui.lib',
      dest: 'tmp'
    },
    files: [
      {
        expand: true,
        cwd: 'lib1',
        src: 'my/ui/lib/**/*.{js,json,xml}'
      }
    ]
  },
});
```

Creates
- tmp/my/ui/lib/library-preload.json

## openui5_component_preload

### Overview

Creates a "Component-preload.json" file which contains all files/modules specified in the task configuration. A component preload file optimizes performance by reducing the number of request made to the server.

### Options

#### componentName
Type: `string`

Name of the component (e.g. foo.bar)

#### dest
Type: `string`  
Default value: `.`

Path to the dest folder in which the preload file should be created. All other dest paths (from the files configuration) will be ignored.

#### compress
Type: `boolean`
Default value: `true`

Optional parameter to turn off the compression/minifiers on the files.
- Javascript is minified using [UglifyJS2](https://github.com/mishoo/UglifyJS2) and copyright comments are preserved (comments matching regular expression `/copyright|\(c\)|released under|license|\u00a9/i` )
- XML is minified using [pretty-data](https://github.com/vkiryukhin/pretty-data)
- JSON is parsed for correctness and to remove extra whitespace

### Usage Examples

```js
grunt.initConfig({
  openui5_component_preload: {
    'default_options': {
      options: {
        componentName: 'mycomp',
          dest: 'tmp'
      },
      files: [{
        expand: true,
        cwd: 'test/component_preload/fixtures',
           src: [
            'mycomp/**/*.js',
            '!mycomp/Grunt.js',
            '!mycomp/Component-preload*.js',
            'mycomp/{fragments,view,utils}/*.{js,json,xml}'
           ]
      }]
  },
});
```

Creates
- tmp/mycomp/Component-preload.json

## openui5_connect

### Overview

Provides middleware for the [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) task to run a web server.  
This task will configure the `connect` task target with the same name and invoke it with the provided arguments.

### Options

#### contextpath

Type: `string`  
Default value: `/`  

The contextpath for all middlewares provided by this task.

#### appresources

Type: `array` of `string`

Directories that should be served under the root `/` path.

Example
```js
appresources: 'webapp'
```
```
webapp
  - dir
    - index.html
```
`http://localhost/contextpath/dir/index.html`

#### resources

Type: `array` of `string`

Directories that should be served under the `/resources` path.

Example
```js
resources: 'src'
```
```
src
  - my
    - lib
      - Button.js
```
`http://localhost/contextpath/resources/my/lib/Button.js`

#### testresources

Type: `array` of `string`

Directories that should be served under the `/test-resources` path.

Example
```js
testresources: 'test'
```
```
test
  - my
    - lib
      - Button.html
```
`http://localhost/contextpath/test-resources/my/lib/Button.html`

#### cors

Type: `object`  
Default: `null`

Configuration for [node-cors](https://github.com/troygoode/node-cors/) to enable Cross Origin Resource Sharing (CORS).

Example
```js
cors: {
  origin: '*'
}
```

#### proxypath

Type: `string`

If set, a generic proxy under the specified path will be provided to consume resources from other origins without causing CORS issues.

URL-Format: `proxypath/{http|https}/{host}/{path}`

Example
```js
proxypath: 'proxy'
```
`http://localhost/contextpath/proxy/http/example.com/foo`

### Usage Examples

#### App

This example will run a web server at `http://localhost:8000/`.  
It serves the `webapp` directory at root level and the openui5 resources at `http://localhost:8000/resources/*`.

```js
connect: {
  server: {
    options: {
      port: 8000
    }
  }
},

openui5_connect: {
  server: {
    options: {
      appresources: 'webapp',
      resources: 'path/to/openui5/resources'
    }
  }

}
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

## Release History

See [CHANGELOG.md](CHANGELOG.md).

## Lisense

[Apache License 2.0](http: //www.apache.org/licenses/LICENSE-2.0) © 2014 [SAP SE](http://www.sap.com)
