sap.ui.require.preload({
	"my/ui/lib/library.js": "jQuery.sap.require(\"sap.ui.core.library\");\njQuery.sap.declare(\"my.ui.lib.library\");\n\nsap.ui.getCore().initLibrary({\n\tname : \"my.ui.lib\",\n\tversion: \"0.0.0\",\n\tdependencies : [\"sap.ui.core\"]\n});\n",
	"my/ui/lib/myJS.js": "/* © */\n'use strict';\n\n/**\n* This is a copyright comment\n*/\n\n/* (c) */\n\n/* released under */\n/* normal comment */\n/* license */\n\n\nconsole.log('myJS');\n\n/**\n * This is a little comment\n */\nfunction myFunction(longVariableName, longerVariableName) {\n\treturn longVariableName + longerVariableName;\n}\n",
	"my/ui/lib/my.view.xml": "<my>XML</my>\n<!-- A comment in XML is the same as in HTML -->",
	"my/ui/lib/myHtmlPre.view.xml": "<my>XML</my>\n<!-- A comment in XML is the same as in HTML -->\n<html:pre>   </html:pre>",
	"my/ui/lib/foo.properties": "FOO=BAR\n"
}, "my/ui/lib/library-preload");
