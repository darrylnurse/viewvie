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
```pip install ...```

```pip install ...```

```pip install ...```
<br/><br/>
After these packages have installed, you can type ```deactivate``` in the CLI to deactivate the virtual environment.
<br/><br/>
Now, we can safely run ```npm run start-all``` from the 'viewvie' directory to start the application. : )
<br/><br/>
If you need to, run ```npm run clear-media``` from the 'backend' directory to clear all uploads and output (it can get overwhelming).
<br/><br/>
Of course, project is missing .env file with Pinecone API key. You can set this up by adding a ```.env``` file to the 'backend' directory, and adding ```PINECONE_API_KEY='<actual-api-key-not-this-this-is-not-an-api-key>'``` to it. Contact me for details on the Pinecone API key. =)
