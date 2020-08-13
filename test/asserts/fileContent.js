var assert = require('assert');
var grunt = require('grunt');

exports.equal = function (oOptions){
	var oReadOptions = {
		encoding : 'utf8'
	};

	var sActualFileContent = grunt.file.read(oOptions.sActualFileSource, oReadOptions)
		.replace(/\r\n/gm, '\n') // replace \r\n with \n to be consistent everywhere
		.replace(/\\r\\n/gm, '\\n') // replace \\r\\n with \\n to be consistent everywhere
		.replace(/\n$/, ''); // remove the last LF;
	var sExpectedFileContent = grunt.file.read(oOptions.sExpectedFileSource, oReadOptions)
		.replace(/\r\n/gm, '\n') // replace \r\n with \n to be consistent everywhere
		.replace(/\\r\\n/gm, '\\n') // replace \\r\\n with \\n to be consistent everywhere
		.replace(/\n$/, ''); // remove the last LF

	assert.equal(sActualFileContent, sExpectedFileContent, oOptions.sMessage);
};
