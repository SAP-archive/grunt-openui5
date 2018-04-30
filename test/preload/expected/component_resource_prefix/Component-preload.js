sap.ui.require.preload({
	"my/app/Component.js": "/* © */\n\"use strict\";\n/**\n* This is a copyright comment\n*/\n/* (c) */\n/* released under */\n/* license */function myFunction(n,o){return n+o}console.log(\"myJS\");",
	"my/app/view/my.view.xml": "<my>XML</my>\n",
	"my/app/view/myHtmlPre.view.xml": "<my>XML</my>\n<!-- A comment in XML is the same as in HTML -->\n<html:pre>   </html:pre>"
}, "my/app/Component-preload");