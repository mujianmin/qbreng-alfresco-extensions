# My Completed Tasks extension #

Author: Francesco Valente

With this simple extension you can view your completed tasks by selecting the appropriated filter in the "My tasks" dashlet.
See screenshots below:

![http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/My%20completed%20tasks/docs/my-tasks-screenshot.png](http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/My%20completed%20tasks/docs/my-tasks-screenshot.png)

![http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/My%20completed%20tasks/docs/filter-screenshot.png](http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/My%20completed%20tasks/docs/filter-screenshot.png)


# Installation #

To install the extension, simply drop the `my-completed-tasks.jar` file into the tomcat/shared/lib folder within your Alfresco installation, and restart the application server to ensure it picks up the changes. You might need to create this folder if it does not already exist.


# Building from source #

Check out the project from svn:
```
svn checkout http://qbreng-alfresco-extensions.googlecode.com/svn/trunk/My%20completed%20tasks
```
Change into the new directory
```
cd "My completed tasks"
```
An Ant build script is provided to build a JAR file containing the custom files, which can then be installed into the tomcat/shared/lib folder of your Alfresco installation.
To build the JAR file, run the following command from the base project directory.
```
ant clean dist-jar
```
The command should build a JAR file named `my-completed-tasks.jar` in the dist directory within your project, which you can then copy into the tomcat/shared/lib folder of your Alfresco installation.