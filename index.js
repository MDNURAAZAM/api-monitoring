/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

// Dependencies
const http = require("http");
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const lib = require("./lib/data");

lib.read("test", "sample01", (err, data) => {
  console.log(err, data);
});

//app object - module scaffolding
const app = {};

// Configuration
app.config = {};

// Create server
app.createServer = () => {
  const server = http.createServer(app.handleRequest);
  server.listen(environment.port, () => {
    console.log(`Server is running on port ${environment.port}`);
  });
};

// Handle Request Response
app.handleRequest = handleReqRes;

// Start the server
app.createServer();
