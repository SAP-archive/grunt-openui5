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
    library: {
      files: [
        {
          expand: true,
          cwd: 'lib1',
          src: 'my/ui/lib/themes/foo/library.source.less',
          dest: 'tmp'
        }
      ]
    }
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
    library: {
      files: [
        {
          expand: true,
          cwd: 'lib2',
          src: 'my/ui/lib/themes/bar/library.source.less',
          dest: 'tmp'
        }
      ]
    }
  },
});
```

Creates the following files
- tmp/my/ui/lib/themes/bar/library.css
- tmp/my/ui/lib/themes/bar/library-RTL.css
- tmp/my/ui/lib/themes/bar/library-parameters.json

## openui5_preload

### Overview

Task to merge multiple files into one preload file.

### Options

#### resources
Type: `string` or `array` or `object`

Resources/files that should be used as source for preload files.

Type     | Result                             | Example
-------- | ---------------------------------- | -------
*String* | See `cwd`.                         | `'src'`
*Array*  | Array of `string` and/or `object`. | `[ 'src', { cwd: 'webapp', prefix: 'my/app' } ]`
*Object* | See `cwd`, `prefix` and `src`      | `{ cwd: 'webapp', prefix: 'my/app', src: '**' }`

##### cwd
Type: `string`

Base/root directory for finding resources.

##### prefix
Type: `string`  
Default: ` `

Directory namespace prefix that should be prepended to all found paths. This is useful if the source folder structure is not the same as the module namespace.

Example:  
`{ cwd: 'webapp', prefix: 'my/app' }`  
`webapp/foo.js` will be treated as `my/app/foo.js` instead of `foo.js`.

##### src
Type: `string` or `array` of `string`  
Default:
```
[
  '**/*.js',
  '**/*.fragment.html',
  '**/*.fragment.json',
  '**/*.fragment.xml',
  '**/*.view.html',
  '**/*.view.json',
  '**/*.view.xml',
  '**/*.properties'
]
```

Glob pattern(s) for finding relevant resources inside `cwd`. If set, the default patterns will be replaced.

##### compatVersion
Type: `string`  
Default: `edge`

Sets the UI5 version used for compatibility mode in the format `<major>.<minor>`. Use this when building older UI5 releases to ensure full functionality.

Example:  
When building for UI5 target version 1.38.x, use `compatVersion: '1.38'`.

#### dest
Type: `string`  
Default value: `.`

Path to the dest folder in which the preload files should be created.

#### compress
Type: `boolean` or `object`  
Default value: `true`

Optional parameter to set compression/minification of the files or to provide
additional options.

- JavaScript is minified using [UglifyJS2](https://github.com/mishoo/UglifyJS2)
- XML is minified using [pretty-data](https://github.com/vkiryukhin/pretty-data)
- JSON is parsed for correctness and to remove extra whitespace

An `object` can be used to provide options.  
Currrently only `uglifyjs` is supported.  
The given object will be passed to `UglifyJS2.minify` (see [here](https://github.com/mishoo/UglifyJS2#api-reference) for  options) and merged with the defaults (see below).  

```js
compress: {
  uglifyjs: {
    output: {
      comments: /copyright|\(c\)|released under|license|\u00a9/i
    }
  }
}
```
Note that `fromString` and `warnings` will be always overridden.

#### components

##### `boolean`

Enable auto detection of Components. A preload file will be created for each `Component.js` file.

```js
components: true
```

##### `string` / `array` of `string`

Namespace path(s) to Component(s).

```js
components: 'my/app',
components: [ 'my/app', 'my/component']
```

##### `object`

Map with namespace path to Component as key and object as value.

```js
components: {
  'my/app': {
    src: [
      'my/app/**',
      'my/app/!ignore.js'
    ]
  }
}
```

##### src
Type: `string` / `array` of `string`  
Default: component namespace path + `/**` (e.g. `my/app/**`)

Glob pattern(s) for files that should be included into the preload.  
Patterns are based on all available resources (see [resources](#resources)).

### libraries

See [components](#components). Auto mode is looking for `library.js` files.

### Usage Examples

#### Component

Creates `dist/Component-preload.js`.

```js
grunt.initConfig({

  openui5_preload: {

    component: {
      options: {
        resources: {
          cwd: 'webapp',
          prefix: 'my/app'
        },
        dest: 'dist'
      },
      components: 'my/app'
    }

  }

});
```

#### Library

Creates `dist/my/ui/lib/library-preload.json`.

```js
grunt.initConfig({

  openui5_preload: {
    library: {
      options: {
        resources: 'src',
        dest: 'dist'
      },
      libraries: 'my/ui/lib'
    }
  }

});
```

## openui5_connect

### Overview

Provides middleware for the [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) task to run a web server.  
This task will configure the `connect` task target with the same name and invoke it with the provided arguments.  
As this task creates it's own middleware, the `connect` task's `base` option will not be respected. If you want to modify the middleware, provide a function callback as `middleware` option (see [here](https://github.com/gruntjs/grunt-contrib-connect#middleware)). The function will be called after the middleware has been created.

### Options

> Note: This task provides options on top of the `connect` task. For general options, see [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect#connect-task).

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

#### proxyOptions

Type: `object`

Options for [connect-openui5 proxy](https://github.com/SAP/connect-openui5#proxyoptions).

#### lessOptions

Type: `object`

Options for [connect-openui5 less](https://github.com/SAP/connect-openui5#lessoptions).


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

#### Custom middleware

This example will add custom middleware before (unshift) and after (push) the middlewares created by this task.

```js
connect: {
  server: {
    options: {
      port: 8000,
      middleware: function(connect, options, middlewares) {
        middlewares.unshift(function(req, res, next) {
          // before openui5 middleware
        });
        middlewares.push(function(req, res, next) {
          // after openui5 middleware
        });
        return middlewares;
      }
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

[Apache License 2.0](http: //www.apache.org/licenses/LICENSE-2.0) © 2016 [SAP SE](http://www.sap.com)
