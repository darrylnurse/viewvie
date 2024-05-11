# Viewvie! - Shazam, but for movies!

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![OpenCV](https://img.shields.io/badge/opencv-%23white.svg?style=for-the-badge&logo=opencv&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)


Viewvie is able to ascertain the name of the uploaded video, by matching its frame embeddings to what is stored in its database. The metadata of the most prominent matches are returned to the user, telling them the name of the video.

Unfortunately, for now we face optimization issues, and have limited our testing (and use) to short clips of around 2-5 seconds. We recommend you stay within this range as well when [trying it locally on your system](#setup). 

This project is also very early in development. =)

# Demo

Here we have two videos, the first which was upserted to our Vector Database with metadata containing its title, and the second which was not upserted.

![okkotsu-yutas-rage](https://github.com/darrylnurse/viewvie/assets/126132293/fe455c36-1816-44b9-b99b-247d6507c4eb)

![todos-resolve](https://github.com/darrylnurse/viewvie/assets/126132293/fca98434-2d56-4275-960f-ac6db84d0ca4)

On the front-end, querying both videos yields the following results respectively: 

![Screenshot 2024-05-11 160111](https://github.com/darrylnurse/viewvie/assets/126132293/3668ba9d-ac4f-44ba-bbef-9b6bdd9d4911)

![Screenshot 2024-05-11 161612](https://github.com/darrylnurse/viewvie/assets/126132293/d3fe62d2-f10c-4b7e-9dca-43c075d010f5)

For the first video, the application correctly predicted the name of the video, as it was present in the dataset. For our second video, it correctly ascertained that there was no match for the video, as it was not in the database. Feel free to try your own inputs for the querying, but only the ones in the test-input directory, or any frames (you can upload images) or snippets from the same videos will yield any results.

# Setup

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
