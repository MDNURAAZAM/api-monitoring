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
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");

// module scaffolding
const routes = {
  sample: sampleHandler,
  user: userHandler,
  token: tokenHandler,
};

// export module
module.exports = routes;
