/*
 * Title: Utilities
 * Description: Important utility functions
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

//dependencies
const crypto = require("crypto");
const environment = require("./environments");

//module scaffolding
const utilities = {};

//parse json strings to objects
utilities.parseJSON = (jsonString) => {
  let output;
  try {
    output = JSON.parse(jsonString);
  } catch (error) {
    output = {};
  }

  return output;
};

//has string
utilities.hash = (str) => {
  if (typeof str === "string" && str?.length > 0) {
    const hash = crypto
      .createHmac("sha256", environment.secretKey)
      .update(str)
      .digest("hex");
    return hash;
  }
  return false;
};

module.exports = utilities;
