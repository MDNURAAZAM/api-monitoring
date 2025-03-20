/*
 * Title: Project Initial file
 * Description: Initial file to start the node server and workers
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

// Dependencies
const server = require("./lib/server");
const wroker = require("./lib/worker");

//app object - module scaffolding
const app = {};

app.init = () => {
  //start the server
  server.init();

  //start the worker
  wroker.init();
};

//start the app
app.init();

//export
module.exports = app;
