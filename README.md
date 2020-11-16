# upload_daily_worklogs
This script downloads daily worklogs from Jira Tempo. Finally this script will create new .bat file named as you set it in input.csv file. The second global step will be to run this .bar file, which runs secondScript.js file as an example.


First, you need to edit input.csv file and set up your credentials to Jira, a path for the downloading .csv file and a path for the output .bat file.


Then you need to install node.js on your computer globally from this link: https://nodejs.org/


Then you need to go to project folder in your terminal and run command "npm i" (this lets you download all project dependencies). 


And finally you need to run command "node upload". This allows to create a new .bat file which can run the next script.


By the way, for this script you need to have chromedriver.exe file to manage your chrome browser. Just for now, it is in the project folder.


But for the future it will be better to put it into a special folder on your computer. In this case it is necessary to add the path to this file to the environment variables path. To do that you can follow steps like in this article: https://stepik.org/lesson/25969/step/8
