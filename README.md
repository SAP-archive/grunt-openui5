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

## "openui5_theme" task

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

## "openui5_library_preload" task

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

## "openui5_connect"

### Options

#### appresources

Type: `array` of `string`

You can provide multiple filepaths. All files located directly in this directory will be available at the root path of your server.
eg: there are two files in the folder
myAppFiles/foo.html
my/other/appfiles/bar.html

and appresrouces is
appresources : [ "myAppFiles", "my/other/appfiles" ]

they will be served under
http://myHost/foo.html
http://myHost/bar.html


#### resources

Type: `array` of `string`

You can provide multiple filepaths. All files located directly in this directory will be available at the root path of your server.
eg: there are two files in the folder
my/firstUi5Library/foo.js
my/secondUi5Library/bar.js

and appresrouces is
appresources : [ "my/firstUi5Library/", "my/secondUi5Library" ]

they will be served under
http://myHost/resources/foo.html
http://myHost/resources/bar.html

#### testresources

Type: `array` of `string`

You can provide multiple filepaths. All files located directly in this directory will be available at the root path of your server.
eg: there are two files in the folder
my/firstUi5Library/tests/foo.js
my/secondUi5Library/tests/bar.js

and appresrouces is
appresources : [ "my/firstUi5Library/tests", "my/secondUi5Library/tests" ]

they will be served under
http://myHost/test-resources/foo.html
http://myHost/test-resources/bar.html

#### contextpath

Type: `string`
Default value: ``
The contextpath has to be prepended on any url to require a resource/testresource or an appresource eg:
if the contextpath is "foo" and an appresource is called bar.html the resource will be located under
http://yourHost/foo/bar.html

#### proxypath

Type: `string`
Default value: ``

The proxypath is used to proxy requests to generic hosts. If the proxypath is empty, no proxy server will be created.
If you provide it you can proxy an request to any url.

eg:
you want to send a request to http://example.com/bar
and the proxypath is 'foo'

you can call http://yourHost/foo/http/example.com/bar

to do the request on the same domain.

For the exact pattern docu see the [proxy middleware](https://github.com/SAP/connect-openui5#Proxy).

### Usage Examples

```js
openui5_connect : {
	connect: {
		options: {
			keepalive: false,
			appresources: [
				'test/connect/fixtures',
				'test/connect/fixtures/app'
			],
			resources: [
				'test/connect/fixtures/someLib/resources',
				'test/connect/fixtures/anotherLib/res'
			],
			testresources: [
				'test/connect/fixtures/someLib/test-resources',
				'test/connect/fixtures/anotherLib/testres'
			],
			contextpath: 'mycontext'
			proxypath : 'proxy',
			port: 8080
		}
	}
},
```

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md).
