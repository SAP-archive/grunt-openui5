jQuery.sap.require("sap.ui.core.library");
jQuery.sap.declare("my.ui.lib.library");

sap.ui.getCore().initLibrary({
	name : "my.ui.lib",
	version: "0.0.0",
	dependencies : ["sap.ui.core"]
});
