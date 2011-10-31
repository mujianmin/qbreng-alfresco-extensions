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

function oc(a) {
  var o = {};
	for(var i=0;i<a.length;i++) 
	{
		o[a[i].itemName]='';
	}
 return o;
}

function getDeniedWorkflowNames() {
   
   var deniedWfNames = [];
   var myconn = remote.connect("alfresco");
   //var myres = myconn.get("/usergroup/getUserGroup");
   //var myResCurUserName=myconn.get("/currentuser/getCurrentUser");
   //var myusername = eval('(' + myResCurUserName+ ')').username;
   
   var myres = myconn.get("/api/people/"+ person.properties.userName +"?groups=true");
   //var myres = myconn.get("/api/people/codexInitiator2?groups=true");
   
   if (myres.status == 200) {
      //var groups = eval('(' + myres + ')').data;
	   var groups = eval('(' + myres + ')').groups;
      
      var grantwf = config.scoped["Workflow"]["grant-workflows"].childrenMap["workflow"];
      var i = 0, j = 0, grantwfSize = grantwf.size();
      if (grantwf) {
    	  for (i = 0; i < grantwfSize; i++) {
		    if (grantwf.get(i).attributes["grant-type"] == "group") {
		    	if (grantwf.get(i).attributes["grant-name"] in oc(groups)) {
		    	   // L'utente può eseguire il wf perchè il gruppo cui appartiene ha i privilegi
		    	   //break;
		    		continue;
		    	}
		    } else if (grantwf.get(i).attributes["grant-type"] == "user") {
		    	if (grantwf.get(i).attributes["grant-name"] == user.name) {
		    	   // L'utente può eseguire il wf perchè user abilitato e utente coincidono
		    	   //break;
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
