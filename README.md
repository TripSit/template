# TripSit Service Template

This is a template for future projects and contains the tools we use across all projects.

# How to use this template

1. Click the "Use this template" button on the github page.
2. Name your new project and click "Create repository from template"
3. Clone your new repository to your local machine. Make sure you have Docker installed.
4. (Recommended) Install the eslint and dotenv plugins. 
5. Run `npm install` to install all dependencies.
6. Run `npm run service` to start the service in development mode.
7. Run `npm run logs` to check the logs in the container.
8. Develop your code, and as you safe, the code will be compiled and the service will be reloaded.
9. Run `npm run test` to run the tests.
10. Run `npm run lint` to run the linter.

# Explanation of files

This setup includes, alpha order so you can go down the list:

## .devcontainer
Includes the setup for codespace development. We strive to make all projects codespace compatible, which makes it easier for people to get started and contribute.

## .github actions:
A few standard github actions that we use across all projects. These are:

* Dependabot
* CodeQL
* Linting
* Testing
* SonarQube

> .github/dependabot.yml

This is the dependabot config that we use across all projects. It is set to scan for updates to all dependancies and create pull requests for them.

> .github/workflows/EveryFridayScan.yml

Performs a once-a-week analysis of the project using CodeQL. 

> .github/workflows/PullRequestOpenAll.yml

This will run on every pull request and do standard linting, testing and CodeQL scanning.

> .github/workflows/PushToMain.yml

This will run on every push to main and do standard linting, testing, CodeQL scanning, with an addition of SonarQube test coverage analysis.

## .vscode
Includes the setup for local development. This includes auto-eslinting and validation on save. This makes it harder to commit code that doesn't pass linting.
This also includes spelling definitions, so "tripsit" isnt seen as a misspelled word by Code Spell Checker

## ./docker
This folder structure mimics Live's docker setup. It includes the following:

> ./docker/appdata

This is where all the data for the service is stored. This includes the database, logs, and other important data. This is mounted into the container at runtime.

These folders use 'acl' to set the permissions so that only root users and the container can access them. This is to prevent the user from accidentally deleting important data, and also to stop unauthorized users from being able to access container data. See [Smart Home Beginner](https://www.smarthomebeginner.com/docker-media-server-2022/#2_Docker_Root_Folder_Permissions)

```
sudo apt install acl
sudo chmod 775 /home/moonbear/UAT/docker
sudo setfacl -Rdm g:docker:rwx /home/moonbear/UAT/docker
sudo setfacl -Rm g:docker:rwx /home/moonbear/UAT/docker
```

> ./docker/service

This is where the config files for the service are stored and are editable by the user. This is mounted into the container at runtime.

## ./src

This is where the source code for the service is stored. This includes the following:

> ./src/global/@types

Holds the global typescript types, including defining the .env file.

> ./src/global/utils/env.config

This is where the .env file is loaded into the process. This is done in a way that allows for type checking of the .env file, allows lets us set default values for .env values, and can use logic to set .env values. For example, you can set a hardcoded value in development but require an .env value in Live.

> ./src/global/utils/env.validation

On program startup this will run to validate the .env file. This will check that all required values are set, and that all values are of the correct type. If a required value is not set, it should tell the developer and exit the program.

> ./src/global/utils/log

This is a logging function using winston that standardizes logs across all services. **Use this log function, don't use console.log.**

> ./src/jest

We use Jest testing, but I'm not very happy with it, and we may be moving to something better.

> ./src/start.ts

Where the magic happens! This is where the service is started. This is where you should import your service and start it.

You'll notice that it uses source-map-support to allow for debugging of the typescript code. This is very important for debugging when you run the javascript code.


## ./

> .dockerignore / docker-compose.yml / Dockerfile

Each project should be docker-compose-able. This allows for easy local development and deployment. You'll notice that the docker-compose uses variables to set some values, you can mostly ignore these, they just set default values that should not impact anything. There are a series of labels being set on the container, these are used by the server to identify the service and set up the reverse proxy. You can mostly ignore these unless you're a sysadmin.

The docker ignore file is used to prevent files from being copied into the docker container. This is used to prevent the copying of the .git folder, node_modules, and other files that are not needed in the container.

### Dockerfile / Multi-stage builds

You can skip this if you don't care how the Dockerfile works.

When you compile a docker project you create an image. This image is what is used to run the service.

One of the benefits of running services in containers is that it's completely barebones and only includes what is necessary to run that specific service. Anything else, even 'vi', is bloatware.

With that in mind, each project should also strive to have the smallest image possible, and should use multi-stage builds to achieve this. The Dockerfile here is a great example of a multi-stage build. One of the benefits of multi-stage builds is that you can have different stages for development and production, which is controlled by the 'target' parameter in the docker-compose file.

The development stage will copy every file in the project (except those in the .dockerignore) and compile the typescript code with tsc-watch+nodemon (see below). This is to allow for auto-reloading of the service when changes are made in development. This is to make development faster, but it also makes the image much larger.

The production stage will only copy in the compiled JS files (/build) and run them directly with PM2. That is the small small difference in how production runs the code, but what's more important is that the production image only copies the necessary files into the image. This makes the image much smaller, which is important for Live. **Make sure you test the production build, because sometimes the right files are not included in the final build.**

> .drone.yml

This is the drone CI config. This is used to deploy the service to the server. It is set to deploy on every push to main. It will tell the server to pull from github and rebuild the container.

> .env / .env.example

This is an example .env file. This is used to show the developer what values are required and what values are optional. This is also used to set default values for optional values.

> .eslintrc/.eslintignore

We use eslint and standardize the linting file across all projects. The ignore file does what you can guess =P

> .gitignore

This is the git ignore file. It is used to prevent files from being committed to git.

> .nvmrc

This is the node version manager file. It is used to set the node version for the project. This is used by the docker container to set the node version.

> LICENSE

Honestly I don't know what this is for. I just picked the default one. I'm not doing this for profit and I hope people use my code to learn and make the world a better place, so as long as you don't sue me, I'm happy.

> nodemon.json

Nodemon is used for auto-reloading the service when changes are made. This is used for local development. You'll notice this config file is only set to run on .js files, while the project is all in Typescript. We use tc-watch to individually-compile the typescript file when you save changes, and then nodemon sees that the JS files were updated and reloads the service. 

This allows us to run the Live JS code in a local development, while still utilizing the benefits of Typescript. You may think that this "double-compile" would be slow, but it's actually very fast. In production tests of tripbot it took restart times on code changes from 8 seconds to 2 seconds. This is because JS code is just much faster than TS, even with the double-compile.

> package.json

Besides doing what you'd expect, there are a few scripts that will help make your life easier. I highly recommend opening the "NPM Scripts" section in VSCode so you can access these scripts easily.

* service - This will start the service in a docker container
* logs - This will show the logs of the service in the docker container
* test - This will run the tests in the container
* lint - This will run the linter in the container

You notice that these are all run in the container. This is because we want to make sure that the code is tested and linted in the same environment that it will be running in. This is to prevent any issues with the code running in the container that don't show up in the developer's environment.

If you want to run these scripts locally, you can use the Local commands, which will do the same thing but, you guessed it, locally. **This is not really recommended unless you cannot run docker on your machine, or you are inside a codespace/devcontainer already.**


> sonar-project.properties

We use SonarQube (https://sonar.tripsit.me) to lint our projects and check for code smells. This is a great tool for improving code quality and catching bugs before they happen. This file is used to configure the sonar scanner.

> tsconfig.json

This is the typescript config file. It is used to set the typescript compiler options. This is used by the docker container to compile the typescript code. We use as strict type-checking as we possibly can to enforce good code.
