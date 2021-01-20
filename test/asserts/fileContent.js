const assert = require("assert");
const grunt = require("grunt");

exports.equal = function(oOptions) {
	const oReadOptions = {
		encoding: "utf8"
	};

	const sActualFileContent = grunt.file.read(oOptions.sActualFileSource, oReadOptions)
		.replace(/\r\n/gm, "\n") // replace \r\n with \n to be consistent everywhere
		.replace(/\\r\\n/gm, "\\n") // replace \\r\\n with \\n to be consistent everywhere
		.replace(/\n$/, ""); // remove the last LF;
	const sExpectedFileContent = grunt.file.read(oOptions.sExpectedFileSource, oReadOptions)
		.replace(/\r\n/gm, "\n") // replace \r\n with \n to be consistent everywhere
		.replace(/\\r\\n/gm, "\\n") // replace \\r\\n with \\n to be consistent everywhere
		.replace(/\n$/, ""); // remove the last LF

	assert.equal(sActualFileContent, sExpectedFileContent, oOptions.sMessage);
};
