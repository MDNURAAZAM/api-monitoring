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

//app object - module scaffolding
const app = {};

// Configuration
app.config = {
  port: 3000,
};

// Create server
app.createServer = () => {
  const server = http.createServer(app.handleRequest);
  server.listen(app.config.port, () => {
    console.log(`Server is running on port ${app.config.port}`);
  });
};

// Handle Request Response
app.handleRequest = handleReqRes;

// Start the server
app.createServer();
