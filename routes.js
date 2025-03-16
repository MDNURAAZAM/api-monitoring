/*
 * Title: Route
 * Description: Application Routes
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

// dependencies
const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");

// module scaffolding
const routes = {
  sample: sampleHandler,
};

// export module
module.exports = routes;
