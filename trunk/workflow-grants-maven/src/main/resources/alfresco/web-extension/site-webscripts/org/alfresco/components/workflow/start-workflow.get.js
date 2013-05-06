/*
 * Alfresco Impulse IT
 * Copyright (C) 2013 www.impulseit.com
 * Esta aplicacion esta bajo una licencia Attribution-NoDerivs 3.0 Unported
 * La licencia permite  redistribucion,  comercial  y  no comercial, con la
 * condicion que el producto no  sea alterado, sea  manejado como  un todo,
 * sin  separar sus partes, y los creditos  por autoria  sean preservados a
 * nombre  de  Impulse IT.  Para ver una copia  de  esta  licencia,  visite
 * http://creativecommons.org/licenses/by-nd/3.0/legalcode.
 *
 * Workflow Grants/Alfresco EE 4.1, CE 4.2
 * Basado en https://code.google.com/p/qbreng-alfresco-extensions/wiki/WorkflowGrants
 *
 */

function getHiddenTaskTypes() {
	var hiddenTaskTypes = [],
		hiddenTasks = config.scoped["Workflow"]["hidden-tasks"].childrenMap["task"];
	if (hiddenTasks) {
		for (var hi = 0, hil = hiddenTasks.size(); hi < hil; hi++) {
			hiddenTaskTypes.push(hiddenTasks.get(hi)
				.attributes["type"]);
		}
	}
	return hiddenTaskTypes;
}

/**
 * Utility function
 * @param {Array} a
 */

function arrayToObject(a) {
	var o = {};
	for (var i = 0; i < a.length; i++) {
		o[a[i].itemName] = '';
	}
	return o;
}

/**
 * Get denied workflow names
 */

function getDeniedWorkflowNames() {
	logger.log("getDeniedWorkflowNames");
	var deniedWfNames = [],
		connector = remote.connect("alfresco"),
		result = connector.get("/api/people/" + user.name + "?groups=true");

	if (result.status == 200) {
		var groups = eval('(' + result + ')')
			.groups,
			grantwf = config.scoped["Workflow"]["grant-workflows"].childrenMap["workflow"];
		if (grantwf) {
			for (var i = 0, il = grantwf.size(); i < il; i++) {
				if (grantwf.get(i)
					.attributes["grant-type"] == "group") {
					if (grantwf.get(i)
						.attributes["grant-name"] in arrayToObject(groups)) {
						// The user can start the workflow because he belongs to the group allowed
						continue;
					}
				} else if (grantwf.get(i)
					.attributes["grant-type"] == "user") {
					if (grantwf.get(i)
						.attributes["grant-name"] == user.name) {
						// The user can start the workflow because he is the allowed
						continue;
					}
				}
				deniedWfNames.push(grantwf.get(i)
					.attributes["name"]);
			}
		}
		return deniedWfNames;
	} else {
		logger.log("Error getting groups");
	}
	return [];
}


function getHiddenWorkflowNames() {
	var hiddenWorkflowNames = [],
		hiddenWorkflows = config.scoped["Workflow"]["hidden-workflows"].childrenMap["workflow"];
	if (hiddenWorkflows) {
		for (var hi = 0, hil = hiddenWorkflows.size(); hi < hil; hi++) {
			hiddenWorkflowNames.push(hiddenWorkflows.get(hi)
				.attributes["name"]);
		}
	}
	// Dennied WF
	var deniedWorkflowNames = getDeniedWorkflowNames();
	for each(var el in deniedWorkflowNames) {
		hiddenWorkflowNames.push(el)
	};

	return hiddenWorkflowNames;
}

function sortByTitle(workflow1, workflow2) {
	var title1 = (workflow1.title || workflow1.name)
		.toUpperCase(),
		title2 = (workflow2.title || workflow2.name)
			.toUpperCase();
	return (title1 > title2) ? 1 : (title1 < title2) ? -1 : 0;
}

function getWorkflowDefinitions() {
	var hiddenWorkflowNames = getHiddenWorkflowNames(),
		connector = remote.connect("alfresco"),
		result = connector.get("/api/workflow-definitions?exclude=" + hiddenWorkflowNames.join(","));
	if (result.status == 200) {
		var workflows = eval('(' + result + ')')
			.data;
		workflows.sort(sortByTitle);
		return workflows;
	}
	return [];
}

function getMaxItems() {
	var myConfig = new XML(config.script),
		maxItems = myConfig["max-items"];
	if (maxItems) {
		maxItems = myConfig["max-items"].toString();
	}
	return maxItems && maxItems.length > 0 ? maxItems : null;
}

function getSiteUrl(relativeURL, siteId) {
	var portlet = (context.attributes.portletHost != null) ? context.attributes.portletHost : false;
	var portlet_url = (context.attributes.portletUrl != null) ? context.attributes.portletUrl : "";
	var site_url = relativeURL;

	if (!siteId) {
		siteId = (page.url.templateArgs.site != null) ? page.url.templateArgs.site : ((args.site != null) ? args.site : "");
	}

	if (siteId.length > 0) {
		site_url = "site/" + siteId + "/" + site_url;
	}

	if (site_url.indexOf("/") == 0) {
		site_url = site_url.substring(1);
	}
	if (site_url.indexOf("page/") != 0) {
		site_url = "page/" + site_url;
	}
	site_url = "/" + site_url;

	if (portlet) {
		site_url = portlet_url.replace(/%24%24scriptUrl%24%24/g, encodeURIComponent(site_url.replace(/&amp;/g, "&")));
	} else {
		site_url = url.context + site_url;
	}
	return site_url;
}

model.workflowDefinitions = getWorkflowDefinitions();

function main() {
	// Widget instantiation metadata...
	var startWorkflow = {
		id: "StartWorkflow",
		name: "Alfresco.component.StartWorkflow",
		options: {
			failureMessage: "message.failure",
			submitButtonMessageKey: "button.startWorkflow",
			defaultUrl: getSiteUrl("my-tasks"),
			selectedItems: (page.url.args.selectedItems != null) ? page.url.args.selectedItems : "",
			destination: (page.url.args.destination != null) ? page.url.args.destination : "",
			workflowDefinitions: model.workflowDefinitions
		}
	};
	model.widgets = [startWorkflow];
}

main();
