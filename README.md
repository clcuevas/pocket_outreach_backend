[![Build Status](https://travis-ci.org/clcuevas/pocket_outreach_backend.svg?branch=master)](https://travis-ci.org/clcuevas/pocket_outreach_backend)
[![Coverage Status](https://coveralls.io/repos/github/clcuevas/pocket_outreach_backend/badge.svg)](https://coveralls.io/github/clcuevas/pocket_outreach_backend)

# Pocket Outreach

This is the REST API for Pocket Outreach, a web app designed to connect people in need with resources in their area. 

The API endpoints and complete documentation are available from [data.pocketoutreach.org](https://data.pocketoutreach.org/)

Currently there are endpoints that will:

- Get the closest food bank
- Get the closest location serving free hot meals

The areas we currently cover are:

 - Seattle
 - Central East NC
 
We are working to expand the locations we serve and expand the types of services we can help people connect with. If you want to help, please send a pull request. We would really appreciate it!

## Documentation

Complete documentation for consuming the REST API is [available here](https://rawgit.com/clcuevas/pocket_outreach_backend/master/doc/index.html#api-food_banks-get) 

For developers interested in contributing, documentation on the methods used in this API are [available here](https://rawgit.com/clcuevas/pocket_outreach_backend/master/out/index.html)
 
 ## Prerequisites
 
 You will need the following correctly installed to run the app
 
- [Node.js 6.10.0+](https://nodejs.org/en/download/) (with npm)
  - I've only run it with Node 6.10.0+, but it's tested from Node 4+ with Travis CI, so if you need to use an earlier version it will probably work
- [MongoDB 3.4+](https://docs.mongodb.com/manual/installation/) 
  - Earlier versions will cause errors
- [Git](https://git-scm.com/)

You will also need API keys from these resources:

- [Socrata](https://dev.socrata.com/)
- [Google](https://developers.google.com/maps/documentation/geocoding/get-api-key)

## Installation

- `git clone <this_repository_url>`
- `cd pocket_outreach_backend`
- `npm install`
- Create a `.env` file and copy all the keys listed in the `.env.example` and set them with your values.

The API port, CORS, and other configuration settings are set in the config files located in `config/default.json` and `config/production.json`. The default port is `3000`, but you can set it to suit your needs. We use the `config` npm module for storing configuration settings. Check out the [config module on npm ](https://www.npmjs.com/package/config) for documentation on setting up your configuration file.

## Running the App

To run the app locally you will need to start both the server and MongoDB. You can run the server in production or development and MongoDB can be run from the local copy or your global installation. To start the app in development mode with the local mongod module, open a terminal window and run `npm run mongod`, then open a second terminal window and run `npm run dev`. If you didn't edit the config settings, the app should be running with endpoints available from `http://localhost:3000` and CORS enabled for `http://localhost:4200` 

The rest of the commands are listed below.

## Commands

- Start server in production
  - `npm start`
- Start server in development mode (hot reloading, verbose errors in console)
  - `npm run dev`
- Start server in debug mode (for debugging in WebStorm)
   - `npm run debug`
- Start MongoDB
  - `npm run mongod`
- Run tests
  - ` npm test`
- Create documentation from [apiDoc](http://apidocjs.com/) and [jsdoc](http://usejsdoc.org/index.html) comments
  - `npm run docs`
- Lint files
  - `npm run lint`  
