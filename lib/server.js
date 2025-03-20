/*
 * Title: Server initialization file
 * Description: functions for sever initialization
 * Author: MD Nura Azam
 * Date: 20/03/2025
 *
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("../helpers/handleReqRes");
const environment = require("../helpers/environments");

//server object - module scaffolding
const server = {};

// Handle Request Response
server.handleRequest = handleReqRes;

// Create server
server.createServer = () => {
  const createServerVariable = http.createServer(server.handleRequest);
  createServerVariable.listen(environment.port, () => {
    console.log(`Server is running on port ${environment.port}`);
  });
};

// Start the server
server.init = () => {
  server.createServer();
};

//export
module.exports = server;
