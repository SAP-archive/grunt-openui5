module.exports = {
	"env": {
		"node": true,
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 8
	},
	"extends": ["eslint:recommended", "google"],
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double",
			{"allowTemplateLiterals": true}
		],
		"semi": [
			"error",
			"always"
		],
		"no-negated-condition": "off",
		"require-jsdoc": "off",
		"no-mixed-requires": "off",
		"max-len": [
			"error",
			{
				"code": 120,
				"ignoreUrls": true,
				"ignoreRegExpLiterals": true
			}
		],
		"no-implicit-coercion": [
			2,
			{"allow": ["!!"]}
		],
		"comma-dangle": "off",
		"no-tabs": "off",


		// Grunt tasks are making use of "this"
		"no-invalid-this": "off"
	},
	"root": true
};
