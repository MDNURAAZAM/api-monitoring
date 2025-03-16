/*
 * Title: Not Found Handler
 * Description: function to handle non existent routes
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

// module scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
  callback(404, {
    message: "Your requested URL was not found!",
  });
};

// export module
module.exports = handler;
