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