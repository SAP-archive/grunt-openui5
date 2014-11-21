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
