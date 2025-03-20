/*
 * Title: Route
 * Description: Application Routes
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

// dependencies
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { checkHandler } = require("./handlers/routeHandlers/checkHandler");

// module scaffolding
const routes = {
  user: userHandler,
  token: tokenHandler,
  check: checkHandler,
};

// export module
module.exports = routes;
