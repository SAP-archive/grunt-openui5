jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "my/app/Component-preload",
	"modules": {
		"my/app/Component.js": "/* © */\n\"use strict\";function myFunction(n,o){return n+o}/**\n* This is a copyright comment\n*/\n/* (c) */\n/* released under */\n/* license */\nconsole.log(\"myJS\");",
		"my/app/view/my.view.xml": "<my>XML</my>\n",
		"my/app/view/myHtmlPre.view.xml": "<my>XML</my>\n<!-- A comment in XML is the same as in HTML -->\n<html:pre>   </html:pre>"
	}
});
