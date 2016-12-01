# 0.11.0 (2016-12-01)

### Breaking changes
- Drop Node.js v0.10 support [`e99df21`](https://github.com/SAP/grunt-openui5/commit/e99df2129ec40960af70589a893af6732ba05295)
- openui5_preload task
  - Create library-preload.js files instead of .json [#47](https://github.com/SAP/grunt-openui5/pull/47) [`cb9bcae`](https://github.com/SAP/grunt-openui5/commit/cb9bcaef6cf8c8cef39f109f1cbb9bae21356e0a)

### Features
- openui5_preload task
  - Introduce [`compatVersion` option](https://github.com/SAP/grunt-openui5#compatversion) [#47](https://github.com/SAP/grunt-openui5/pull/47) [`cb9bcae`](https://github.com/SAP/grunt-openui5/commit/cb9bcaef6cf8c8cef39f109f1cbb9bae21356e0a)

### Others
- Update npm dependencies / replace "url-join" with "urljoin" [#49](https://github.com/SAP/grunt-openui5/pull/49) [`b820a68`](https://github.com/SAP/grunt-openui5/commit/b820a6830cb7505374a10e86816263860f9a52c5)
- Travis CI: Add node v7 / drop v0.10 [`f691e1a`](https://github.com/SAP/grunt-openui5/commit/f691e1a314d9b4d1ff6e540012562639e749276f)

### All changes
[`0.10.0...0.11.0`](https://github.com/SAP/grunt-openui5/compare/0.10.0...0.11.0)

# 0.10.0 (2016-09-09)

### Features
- openui5_preload task
  - Compression options for UglifyJS [#41](https://github.com/SAP/grunt-openui5/pull/41) [`b2e6c0e`](https://github.com/SAP/grunt-openui5/commit/b2e6c0e87f94d1fc46b8fafa69bd40e8d2ffe88f)

### Fixes
- openui5_preload task
  - Fail gracefully when minification fails [#42](https://github.com/SAP/grunt-openui5/pull/42) [`52b6c78`](https://github.com/SAP/grunt-openui5/commit/52b6c78d21eec1d90987838d3e7726d19baa8fca)

### Others
- Documentation: openui5_theme default example [#33](https://github.com/SAP/grunt-openui5/pull/33) [`8ef82a5`](https://github.com/SAP/grunt-openui5/commit/8ef82a510aed7159c81433d1896fbe7073535426)

### All changes
[`0.9.0...0.10.0`](https://github.com/SAP/grunt-openui5/compare/0.9.0...0.10.0)


# 0.9.0 (2016-04-25)

### Breaking changes
- openui5_connect / openui5_theme tasks
  - Set default of parser option `relativeUrls` to `true` [`4d5fca2 ` via less-openui5@0.2.0](https://github.com/SAP/connect-openui5/commit/4d5fca25954049eec4af53c8bd12c54d6ad020aa) (see [`7cc2781 `](https://github.com/SAP/grunt-openui5/commit/7cc2781bfb63c95deef2a63a426d791f02a8770b))

### Features
- openui5_connect task
  - support `lessOptions` [`a8c1280`](https://github.com/SAP/grunt-openui5/commit/a8c1280f09a0dc20fd4987600572a8f34e5d9dc4)

### Fixes
- openui5_preload task
  - Always exclude corresponding preload files [`a9ebf40`](https://github.com/SAP/grunt-openui5/commit/a9ebf407bd4700136b0d7277cdac53d2c6366bb7)

### Others
- Support Grunt 1.0 [`046e8ca`](https://github.com/SAP/grunt-openui5/commit/046e8ca5c2ab0954c679712a2b3259c8e2a918dc)
- Update dependencies [`7cc2781`](https://github.com/SAP/grunt-openui5/commit/7cc2781bfb63c95deef2a63a426d791f02a8770b)

### All changes
[`0.8.1...0.9.0`](https://github.com/SAP/grunt-openui5/compare/0.8.1...0.9.0)


# 0.8.1 (2016-01-20)

### Others
- Update dependencies [`4524b2f`](https://github.com/SAP/grunt-openui5/commit/4524b2ffd4b58b5bde777ed4268f013db30ef610) [`70e2c92`](https://github.com/SAP/grunt-openui5/commit/70e2c9286ec26a5a02f7204747abc89f6cf8020a)

### All changes
[`0.8.0...0.8.1`](https://github.com/SAP/grunt-openui5/compare/0.8.0...0.8.1)


# 0.8.0 (2015-08-17)

### Fixes
- openui5_connect task
  - support [connect](https://github.com/gruntjs/grunt-contrib-connect) v3 [`b3c9da9`](https://github.com/SAP/grunt-openui5/commit/b3c9da93cd9984ba6bbc391bbdc7745379fa0019)

### Others
- bump dependencies [`b3c9da9`](https://github.com/SAP/grunt-openui5/commit/b3c9da93cd9984ba6bbc391bbdc7745379fa0019)

### All changes
[`0.7.0...0.8.0`](https://github.com/SAP/grunt-openui5/compare/0.7.0...0.8.0)


# 0.7.0 (2015-03-16)

### Features
- openui5_connect task
  - allow custom middleware (via [connect](https://github.com/gruntjs/grunt-contrib-connect) task [`middleware` function](https://github.com/gruntjs/grunt-contrib-connect#middleware)) [`1cab971`](https://github.com/SAP/grunt-openui5/commit/1cab9712343fe5e0c70fc98ba14e8425718d466e)
- openui5_preload task
  - improved error logging / log file compression [`aa16e59`](https://github.com/SAP/grunt-openui5/commit/aa16e59dbb4df9676f89ae8a95234aa289cd9c3d)

### Others
- openui5_connect task
  - change deprecated usage of server-static "hidden" [`d3911ab`](https://github.com/SAP/grunt-openui5/commit/d3911ab3ce0b3eca8f68a06b0593131b4eb1a7b9)
- bump dependencies [`f949f90`](https://github.com/SAP/grunt-openui5/commit/f949f90eb81190fb39b5102a40ba7c3c60e97621)

### All changes
[`0.6.0...0.7.0`](https://github.com/SAP/grunt-openui5/compare/0.6.0...0.7.0)


# 0.6.0 (2015-01-12)

### Features
- openui5_connect task
  - add proxyOptions [`f823c65`](https://github.com/SAP/grunt-openui5/commit/f823c655e72ce940a2b6abc4ee03aaa247a55bed)

### Fixes
- openui5_preload task
  - error message when no module file could be found [`f6f18ae`](https://github.com/SAP/grunt-openui5/commit/f6f18ae9043846e367ab98f01494b00844e346ca)

### All changes
[`0.5.0...0.6.0`](https://github.com/SAP/grunt-openui5/compare/0.5.0...0.6.0)


# 0.5.0 (2014-12-08)

### Breaking changes
- openui5_library_preload task
  - removed, use openui5_preload task instead [`9e8e556`](https://github.com/SAP/grunt-openui5/commit/9e8e55666a548262532b2a84799d68745e796935)

### Features
- openui5_preload task
  - new task to create preload files for components / libraries [`816507d`](https://github.com/SAP/grunt-openui5/commit/816507d045a11bf9dbb0370d69151ad5f341b6ae)

### All changes
[`0.4.0...0.5.0`](https://github.com/SAP/grunt-openui5/compare/0.4.0...0.5.0)


# 0.4.0 (2014-11-21)

### Breaking changes
- openui5_connect task
  - task does only contain `openui5_connect` specific options. All other `connect` options have to be configured in the [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect) task [`91c6261`](https://github.com/SAP/grunt-openui5/commit/91c62612cd4c4c4357602daa4ae35e6ab04abc4f)

### Features
- openui5_connect task
  - added `proxypath` option to enable a generic proxy [`91c6261`](https://github.com/SAP/grunt-openui5/commit/91c62612cd4c4c4357602daa4ae35e6ab04abc4f) [`1b78fb2`](https://github.com/SAP/grunt-openui5/commit/1b78fb2656549cd64511f638441bcf53df608a87)
  - `livereload` option (from [grunt-contrib-connect](https://github.com/gruntjs/grunt-contrib-connect#livereload) task) will include an additional LiveReload plugin to enable live-reloading of CSS with source LESS files [`20225e8`](https://github.com/SAP/grunt-openui5/commit/20225e8d6b381e882cd8c885db84b3b7b0eae9af)

### All changes
[`0.3.0...0.4.0`](https://github.com/SAP/grunt-openui5/compare/0.3.0...0.4.0)


# 0.3.0 (2014-11-12)

### Features
- openui5_connect task
  - added JS, XML & JSON compression [`011d4af`](https://github.com/SAP/grunt-openui5/commit/011d4afa913d29e9b17702935a7cbdd0bc871a49) [`3905400`](https://github.com/SAP/grunt-openui5/commit/39054000c1bdc12dd445df4c0f1185bfa288f5d1) (thanks to [@olirogers](https://github.com/olirogers))

### All changes
[`0.2.1...0.3.0`](https://github.com/SAP/grunt-openui5/compare/0.2.1...0.3.0)
