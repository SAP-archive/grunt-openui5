jQuery.sap.registerPreloadedModules({
	"version": "2.0",
	"name": "mycomp/Component-preload.js",
	"modules": {
		"mycomp/Component.js": function(){"use strict";jQuery.sap.declare("mycomp.Component"),sap.ui.core.UIComponent.extend("mycomp.Component",{metadata:{}});},
		"mycomp/utils/Formatter.js": function(){sap.ui.define(["jquery.sap.global"],function(){"use strict";var e={};return e},!0);},
		"mycomp/view/S2.controller.js": function(){sap.ui.controller("mycomp.view.S2",{onInit:function(){}});},
		"mycomp/view/S3.controller.js": function(){sap.ui.controller("mycomp.view.S3",{onInit:function(){}});},
		"mycomp/fragments/ActionSheetFragment.fragment.xml": "<core:FragmentDefinition xmlns=\"sap.m\" xmlns:core=\"sap.ui.core\"><ActionSheet title=\"Choose Your Action\" showCancelButton=\"true\" placement=\"Top\"><buttons><Button text=\"{i18n>MARK_AS_FAVORITE}\" icon=\"sap-icon://favorite\" press=\"onPress\" /></buttons></ActionSheet></core:FragmentDefinition>",
		"mycomp/view/S2.view.xml": "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><mvc:View controllerName=\"mycomp.view.S2\" xmlns:mvc=\"sap.ui.core.mvc\" xmlns=\"sap.m\"><Page id=\"page1\" enableScrolling=\"false\"></Page></mvc:View>",
		"mycomp/view/S3.view.xml": "<?xml version=\"1.0\" encoding=\"UTF-8\" ?><mvc:View controllerName=\"myapp.view.S3\" xmlns:mvc=\"sap.ui.core.mvc\" xmlns=\"sap.m\"><Page id=\"page2\" enableScrolling=\"false\"></Page></mvc:View>"
	}
});