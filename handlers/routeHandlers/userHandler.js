/*
 * Title: User Handler
 * Description: function to handle user routes
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

//dependencies
const { hash, parseJSON } = require("../../helpers/utilities");
const data = require("./../../lib/data");

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
    handler._users[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._users = {};

//post request handler
handler._users.post = (requestProperties, callback) => {
  const { body } = requestProperties || {};

  const firstName =
    typeof body?.firstName === "string" && body?.firstName?.trim().length > 0
      ? body.firstName
      : false;

  const lastName =
    typeof body?.lastName === "string" && body?.lastName?.trim().length > 0
      ? body.lastName
      : false;

  const phone =
    typeof body?.phone === "string" && body?.phone?.trim().length === 11
      ? body.phone
      : false;

  const password =
    typeof body?.password === "string" && body?.password?.trim().length > 0
      ? body.password
      : false;

  const tosAgreement =
    typeof body?.tosAgreement === "boolean" ? body.tosAgreement : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    //check if the requested user exists already
    data.read("users", phone, (err) => {
      if (err) {
        const userObject = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        //save the user in db
        data.create("users", phone, userObject, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User was created succesfully",
            });
          } else {
            callback(500, {
              error: "Could not create user",
            });
          }
        });
      } else {
        callback(500, {
          error: "There was a problem in server side",
        });
      }
    });
  } else {
    callback(400, {
      error: "You have a problem in your request",
    });
  }
};

//get request handler
handler._users.get = (requestProperties, callback) => {
  const { phone: requestedPhone } = requestProperties?.queryStringObject;

  const phone =
    typeof requestedPhone === "string" && requestedPhone.trim().length === 11
      ? requestedPhone
      : false;
  if (phone) {
    //lookup the user
    data.read("users", phone, (err1, data) => {
      if (!err1) {
        const userData = { ...parseJSON(data) };
        delete userData.password;
        callback(200, userData);
      } else {
        callback(404, {
          error: "Requested user was not found",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested user was not found",
    });
  }
};

//put request handler
handler._users.put = (requestProperties, callback) => {
  callback(200, {
    message: "put url",
  });
};
handler._users.delete = (requestProperties, callback) => {
  callback(200, {
    message: "delete url",
  });
};

// export module
module.exports = handler;
