sap.ui.require.preload({
	"my/app/Component.js": "/* © */\n'use strict';\n\n/**\n* This is a copyright comment\n*/\n\n/* (c) */\n\n/* released under */\n/* normal comment */\n/* license */\n\n\nconsole.log('myJS');\n\n/**\n * This is a little comment\n */\nfunction myFunction(longVariableName, longerVariableName) {\n\treturn longVariableName + longerVariableName;\n}\n",
	"my/app/view/my.view.xml": "<my>XML</my>\n<!-- A comment in XML is the same as in HTML -->",
	"my/app/view/myHtmlPre.view.xml": "<my>XML</my>\n<!-- A comment in XML is the same as in HTML -->\n<html:pre>   </html:pre>"
}, "my/app/Component-preload");
