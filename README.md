# Viewvie!

So glad you came!
<br/><br/>
Just a disclaimer, unfortunately, in the face of our time (and budget) constraints, we do not have support for Mac or Linux users. This is because I say so. (Unfortunately like a shortsightedly architectured house, I only have Windows.)
<br/><br/>
Let's get started.
<br/><br/>
First, fork this repo, so you can have your own personal playground.
<br/><br/>
Then, use ```git clone <forked_repo_link>``` in the terminal of your preferred IDE.
<br/><br/>
In order to get up and running, you must have NodeJs installed. You can [download the latest version here](https://nodejs.org/en/download). This installation will include the Node Package Manager (npm).
<br/><br/>
You can check if NodeJs and npm are installed correctly by running ```node -v``` and ```npm -v``` respectively. If it does not recognize either as a command, check if Node is set as a PATH environmental variable. If it is not, [set Node as a PATH environmental variable.](https://www.architectryan.com/2018/03/17/add-to-the-path-on-windows-10/)
<br/><br/>
Once Node is set up, let's get our project dependencies set up with ```npm run install-all```.
<br/><br/>
That covers our NodeJs dependencies. Time for our Python dependencies.
<br/><br/>
Now, open your terminal. You can do this by hitting ```Win  + R```, typing 'cmd' and hitting enter.
<br/><br/>
Run ```python -m venv viewvie  ``` in your CLI to initialize the virtual environment.
<br/><br/>
This will create a virtual environment file (named viewvie) in your user directory.
<br/><br/>
Use ```viewvie\Scripts\activate``` in your CLI to activate the virtual environment. If your commands (even before your C: directory) start with ```(viewvie)```, the environment has been set up correctly!
<br/><br/>
This is where we will install dependencies for our embedder module.
<br/><br/>
Install the python dependencies by running each one in your CLI:
<br/><br/>
```pip install mediapipe```

```pip install opencv-python```
<br/><br/>
After these packages have installed, you can type ```deactivate``` in the CLI to deactivate the virtual environment.
<br/><br/>
Now, we can safely run ```npm run start-all``` from the 'viewvie' directory to start the application! You will see a ```http://localhost:5173/``` in your console - click it to open the application in your browser.
<br/><br/>
Of course, project is missing .env file with Pinecone API key. You can set this up by adding a ```.env``` file to the 'backend' directory, and adding ```PINECONE_API_KEY='<actual-api-key-not-this-this-is-not-an-api-key>'``` to it. Contact me for details on the Pinecone API key. =)
<br/><br/>
For now, we have a very limited pool of movies in our database. There is functionality in the application to add more, but we want to straighten out load balancing first before we let users test this out. Temporarily, we will provide sample video clips to test the applications. They will be labeled with the actual movie name (which you wouldn't actually know). Some will match movies in our database, and some will not. They can be downloaded in the 'test-input' directory.
