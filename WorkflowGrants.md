# Workflow grants extension #

Author: Francesco Valente

Contributor: Luis Sanchez

One of the lacks of Alfresco Workflows is that there's no possibility to allow workflow start and execution based on specified users or groups.
This simple extension allow this kind of control throw the global config file `share-config-custom.xml`


# Configuration and building #

## Download sources ##
This extension requires a simple configuration before installing it. You should checkout the project from svn:

```
svn checkout http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/Workflow%20grants
```

**NOTE:** There's the mavenized version of this project, if you prefer it,
```
svn checkout http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/workflow-grants-maven
```

## Configuration example ##
Change into the new directory "Workflow grants/config/alfresco/web-extension" and modify the `share-config-custom.xml` to suite your needs:
```xml

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


Unknown end tag for &lt;/hidden-workflows&gt;



<!--
A list of workflow definitions that are displayed in Share start-workflow page based on grant options
- grant-type: "user" or "group"
- grant-name: group name or user name (based on grant-type) allowed
-->

<grant-workflows>

<workflow name="activiti$activitiAdhoc"
grant-type="group"
grant-name="GROUP_Reviewers" />



Unknown end tag for &lt;/grant-workflows&gt;



<!-- A list of workflow tasks that are NOT displayed in Share  -->

<hidden-tasks>

<!-- Hide all WCM related tasks -->
<task type="wcmwf:*"/>



Unknown end tag for &lt;/hidden-tasks&gt;





Unknown end tag for &lt;/config&gt;





Unknown end tag for &lt;/alfresco-config&gt;


```

In this example the group `GROUP_Reviewers` ONLY can start the `ad-hoc` workflow. Other groups will not see the ad-hoc workflow in the start-workflow page on Share.

Here a screenshot of the "Start Workflow" page for a user belonging to `Reviewers` group
![http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/Workflow%20grants/docs/start-wf-reviewers.png](http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/Workflow%20grants/docs/start-wf-reviewers.png)

And here another one for a user not belonging to `Reviewers`
![http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/Workflow%20grants/docs/start-wf-othergroups.png](http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/Workflow%20grants/docs/start-wf-othergroups.png)

## Building ##
```
cd "Workflow grants"
```

An Ant build script is provided to build a JAR file containing the custom files, which can then be installed into the `tomcat/shared/lib` folder of your Alfresco installation.

To build the JAR file, run the following command from the base project directory.

```
ant clean dist-jar
```

The command should build a JAR file named `workflow-grants.jar` in the `dist` directory within your project.


# Installation #

To install the extension, simply drop the _workflow-grants.jar_ file into the tomcat/shared/lib folder within your Alfresco installation, and restart the application server to ensure it picks up the changes. You might need to create this folder if it does not already exist.

# Alfresco versions #

The code on trunk works on alfresco 4.x. For alfresco 3.x please refer to branch `alfresco-3.x`