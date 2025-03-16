/*
 * Title: Route
 * Description: Application Routes
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");

// module scaffolding
const routes = {
  sample: sampleHandler,
  user: userHandler,
};

// export module
module.exports = routes;
