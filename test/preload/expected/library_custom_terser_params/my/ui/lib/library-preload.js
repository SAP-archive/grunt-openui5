sap.ui.require.preload({
	"my/ui/lib/library.js": "jQuery.sap.require(\"sap.ui.core.library\"),jQuery.sap.declare(\"my.ui.lib.library\"),sap.ui.getCore().initLibrary({name:\"my.ui.lib\",version:\"0.0.0\",dependencies:[\"sap.ui.core\"]});",
	"my/ui/lib/myJS.js": "/* © */\n\"use strict\";\n/**\n* This is a copyright comment\n*/\n/* (c) */\n/* released under */\n/* license */function myFunction(longVariableName,longerVariableName){return longVariableName+longerVariableName+\"\\u518d\\u6309\\u4e00\\u6b21\\u9000\\u51fa\\u4f19\\u62fc\"}console.log(\"myJS\");",
	"my/ui/lib/my.view.xml": "<my>XML</my>\n",
	"my/ui/lib/myHtmlPre.view.xml": "<my>XML</my>\n<!-- A comment in XML is the same as in HTML -->\n<html:pre>   </html:pre>",
	"my/ui/lib/foo.properties": "FOO=BAR\n"
}, "my/ui/lib/library-preload");