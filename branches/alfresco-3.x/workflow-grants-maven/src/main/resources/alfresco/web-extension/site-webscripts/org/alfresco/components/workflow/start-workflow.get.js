function getHiddenTaskTypes()
{
   var hiddenTaskTypes = [],
      hiddenTasks = config.scoped["Workflow"]["hidden-tasks"].childrenMap["task"];
   if (hiddenTasks)
   {
      for (var hi = 0, hil = hiddenTasks.size(); hi < hil; hi++)
      {
         hiddenTaskTypes.push(hiddenTasks.get(hi).attributes["type"]);
      }
   }
   return hiddenTaskTypes;
}

/**
 * Utility function
 * @param {Array} a
 */
function oc(a) 
{
	var o = {};
	for(var i=0;i<a.length;i++) 
	{
		o[a[i].itemName]='';
	}
 	return o;
}

/**
 * Get denied workflow names
 */
function getDeniedWorkflowNames() 
{
    var deniedWfNames = [],
    	myconn = remote.connect("alfresco"),
		myres = myconn.get("/api/people/"+ user.name +"?groups=true");
   
   	if (myres.status == 200) 
	{
   		var groups = eval('(' + myres + ')').groups,
      		grantwf = config.scoped["Workflow"]["grant-workflows"].childrenMap["workflow"];
      	if (grantwf) 
		{
    		for (var i = 0, il = grantwf.size(); i < il; i++) 
			{
		    	if (grantwf.get(i).attributes["grant-type"] == "group") 
				{
		    		if (grantwf.get(i).attributes["grant-name"] in oc(groups)) 
					{
		    	   		// The user can start the workflow because he belongs to the group allowed
		    			continue;
		    		}
		    	} else if (grantwf.get(i).attributes["grant-type"] == "user") 
				{
		    		if (grantwf.get(i).attributes["grant-name"] == user.name) 
					{
		    	   		// The user can start the workflow because he is the allowed
		    			continue;
		    		}
		    	}
	    	deniedWfNames.push(grantwf.get(i).attributes["name"]);
 			}
     	}
     	return deniedWfNames;
   	}
   	return [];
}



function getHiddenWorkflowNames()
{
   var deniedWorkflowNames = getDeniedWorkflowNames();
   var hiddenWorkflowNames = [],
      hiddenWorkflows = config.scoped["Workflow"]["hidden-workflows"].childrenMap["workflow"];
   if (hiddenWorkflows)
   {
      for (var hi = 0, hil = hiddenWorkflows.size(); hi < hil; hi++)
      {
         hiddenWorkflowNames.push(hiddenWorkflows.get(hi).attributes["name"]);
      }
   }
   for each (el in deniedWorkflowNames) {hiddenWorkflowNames.push(el)};
   return hiddenWorkflowNames;
}

function sortByTitle(workflow1, workflow2)
{
   return (workflow1.title > workflow2.title) ? 1 : (workflow1.title < workflow2.title) ? -1 : 0;
}

function getWorkflowDefinitions()
{
   var hiddenWorkflowNames = getHiddenWorkflowNames(),
      connector = remote.connect("alfresco"),
      result = connector.get("/api/workflow-definitions?exclude=" + hiddenWorkflowNames.join(","));
   if (result.status == 200)
   {
      var workflows = eval('(' + result + ')').data;
      workflows.sort(sortByTitle);
      return workflows;
   }
   return [];
}

function getMaxItems()
{
   var myConfig = new XML(config.script),
      maxItems = myConfig["max-items"];
   if (maxItems)
   {
      maxItems = myConfig["max-items"].toString();
   }
   return maxItems && maxItems.length > 0 ? maxItems : null;
}

model.workflowDefinitions = getWorkflowDefinitions();