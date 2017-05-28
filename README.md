[![Build Status](https://travis-ci.org/clcuevas/pocket_outreach_backend.svg?branch=master)](https://travis-ci.org/clcuevas/pocket_outreach_backend)
[![Coverage Status](https://coveralls.io/repos/github/clcuevas/pocket_outreach_backend/badge.svg)](https://coveralls.io/github/clcuevas/pocket_outreach_backend)

# Pocket Outreach

This is the REST API for Pocket Outreach, a web app designed to connect people in need with resources in their area.

The areas we currently cover are:

 - Seattle

## Documentation

Complete documentation for consuming the REST API is [available here](https://rawgit.com/clcuevas/pocket_outreach_backend/master/doc/index.html#api-food_banks-get)

Documentation on the methods used in this API are [available here](https://rawgit.com/clcuevas/pocket_outreach_backend/master/out/index.html)
 
 ## Prerequisites
 
 You will need the following correctly installed to run the app
 
- [Node.js 6.10.0+](https://nodejs.org/en/download/) (with npm)
  - _it will probably work in earlier versions of node, but I haven't tested it_
- [Git](https://git-scm.com/)

You will also need API keys from these resources:

- [Socrata](https://dev.socrata.com/)
- [Google](https://developers.google.com/maps/documentation/geocoding/get-api-key)

## Installation

- `git clone <this_repository_url>`
- `cd pocket_outreach_backend`
- `npm install`

## Running

The API port and other configuration settings are set in the config files located in `config/default.json` and `config/production.json`. The default port is `3000`, but you can set it to what suits your needs. We use the `config` npm module for storing configuration settings. Check out the [config module on npm ](https://www.npmjs.com/package/config) for documentation on setting up your configuration.

- production
  - `npm start`
- dev mode (with hot reloading)
  - `npm run dev`
- debug mode (for IDEs with debugging capabilities)
   - `npm run debug`
- test
  - ` npm test`
- create documentation from [apiDoc](http://apidocjs.com/) and [jsdoc](http://usejsdoc.org/index.html) comments
  - `npm run docs`
- lint files
  - `npm run lint`  
