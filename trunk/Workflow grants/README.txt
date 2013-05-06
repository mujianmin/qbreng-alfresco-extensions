Workflow grants extension for Alfresco Share
======================================

Author: Francesco Valente
Contributor: Luis Sanchez

Alfresco Share extension for managing which person or group can start a specified workflow

Introduction
------------
One of the lacks of Alfresco Workflows is that there's no possibility 
to allow workflow start and execution based on specified users or groups.
This simple extension allow this kind of control throw the global config 
file share-config-custom.xml or the project share-config-custom.xml


Configuration and building
--------------------------
1) Download sources

This extension requires a simple configuration before installing it.
You should checkout the project from svn:

        svn checkout http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/Workflow%20grants


Configuration example
---------------------------
Change into the new directory "Workflow grants/config/alfresco/web-extension" 
and modify the share-config-custom.xml to suite your needs:
Eg.:
	<alfresco-config>    
		<!-- Workflow config section -->
		<config evaluator="string-compare" condition="Workflow" replace="true">
			<!-- A list of workflow definitions that are NOT displayed in Share -->
			<hidden-workflows>
				<!-- Hide all WCM related workflows -->
				<workflow name="jbpm$wcmwf:*"/>
				<workflow name="jbpm$wf:articleapproval"/>
				...
				...
			</hidden-workflows>

			<!--
			   A list of workflow definitions that are displayed in Share start-workflow page based on grant options
			   - grant-type: "user" or "group"
			   - grant-name: group name or user name (based on grant-type) allowed
			 -->
			<grant-workflows>
				<workflow 	name="activiti$activitiAdhoc" 
							grant-type="group" 
							grant-name="GROUP_Reviewers" />
			</grant-workflows>

			<!-- A list of workflow tasks that are NOT displayed in Share  -->
			<hidden-tasks>
				<!-- Hide all WCM related tasks -->
				<task type="wcmwf:*"/>
			</hidden-tasks>
		</config>
	</alfresco-config>

In this example the group GROUP_Reviewers ONLY can start the activitiAdhoc workflow.
Other groups will not see the activitiAdhoc workflow in the start-workflow page on Share. 

Important: You may use the global share-config-custom.xml located in tomcat/shared/classes/alfresco/web-extension

In this case, edit the project's share-config-custom.xml to include just the following:
	<alfresco-config/>

Building
------------
          cd "Workflow grants"

An Ant build script is provided to build a JAR file containing the custom files,
which can then be installed into the tomcat/shared/lib folder of your Alfresco installation.
To build the JAR file, run the following command from the base project directory.

          ant clean dist-jar

The command should build a JAR file named workflow-grants.jar in the dist directory within your project.


Installation
---------------
To install the extension, simply drop the workflow-grants.jar file into 
the tomcat/shared/lib folder within your Alfresco installation, and restart the application server
to ensure it picks up the changes.
You might need to create this folder if it does not already exist. 