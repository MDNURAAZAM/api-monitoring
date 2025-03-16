/*
 * Title: Sample Handler
 * Description: function to handle sample route
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

// module scaffolding
const handler = {};

handler.sampleHandler = (requestProperties, callback) => {
  callback(200, {
    message: "This is a sample url",
  });
};

// export module
module.exports = handler;
