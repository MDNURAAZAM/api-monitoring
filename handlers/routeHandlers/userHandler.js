/*
 * Title: User Handler
 * Description: function to handle user routes
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  callback(200, {
    message: "This is a user url",
  });
};

// export module
module.exports = handler;
