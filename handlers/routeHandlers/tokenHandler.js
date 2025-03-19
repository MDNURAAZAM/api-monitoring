/*
 * Title: token handler
 * Description: functions to handle token routes
 * Author: MD Nura Azam
 * Date: 19/03/2025
 *
 */

//dependencies
const {
  hash,
  parseJSON,
  createRandomString,
} = require("../../helpers/utilities");
const data = require("./../../lib/data");

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
    handler._token[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._token = {};

//post request handler
handler._token.post = (requestProperties, callback) => {
  const { body } = requestProperties || {};

  const phone =
    typeof body?.phone === "string" && body?.phone?.trim().length === 11
      ? body.phone
      : false;

  const password =
    typeof body?.password === "string" && body?.password?.trim().length > 0
      ? body.password
      : false;

  if (phone && password) {
    //check if the requested user exists already
    data.read("users", phone, (err1, usersData) => {
      if (!err1 && usersData) {
        //user exists in db
        //check if used is valid
        const isValidUser =
          hash(password) === parseJSON(usersData).password &&
          phone === parseJSON(usersData).phone;

        if (isValidUser) {
          const tokenId = createRandomString(20);
          const expires = Date.now() + 60 * 60 * 1000;

          const tokenObject = {
            phone,
            expires,
            id: tokenId,
          };

          //store the token
          data.create("tokens", tokenId, tokenObject, (err2) => {
            if (!err2) {
              callback(200, tokenObject);
            } else {
              callback(500, {
                error: "There is a problem in the server side",
              });
            }
          });
        } else {
          callback(400, {
            error: "You have a problem in your request",
          });
        }
      } else {
        callback(400, {
          error: "You have a problem in your request",
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
handler._token.get = (requestProperties, callback) => {
  const { id: requestedTokenId } = requestProperties?.queryStringObject;

  const tokenId =
    typeof requestedTokenId === "string" &&
    requestedTokenId.trim().length === 20
      ? requestedTokenId
      : false;
  if (tokenId) {
    //lookup the token
    data.read("tokens", tokenId, (err1, tokenData) => {
      if (!err1 && tokenData) {
        const token = { ...parseJSON(tokenData) };

        callback(200, token);
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
handler._token.put = (requestProperties, callback) => {
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
  if (phone) {
    if (firstName || lastName || password) {
      //lookup for the user
      data.read("users", phone, (err1, user) => {
        if (!err1) {
          const userData = { ...parseJSON(user) };

          if (firstName) {
            userData.firstName = firstName;
          }

          if (lastName) {
            userData.lastName = lastName;
          }

          if (password) {
            userData.password = hash(password);
          }

          //update in the db
          data.update("users", phone, userData, (err2) => {
            if (!err2) {
              callback(200, {
                message: "User was updated succesfully",
              });
            } else {
              callback(500, { error: "There was an error in the server side" });
            }
          });
        } else {
          callback(400, {
            error: "Invalid user. Please try again",
          });
        }
      });
    }
  } else {
    callback(400, {
      error: "Invalid user. Please try again",
    });
  }
};

//delete request handler
handler._token.delete = (requestProperties, callback) => {
  const phone =
    typeof requestProperties?.queryStringObject?.phone === "string" &&
    requestProperties?.queryStringObject?.phone?.length === 11
      ? requestProperties?.queryStringObject?.phone
      : false;

  console.log(phone);
  if (phone) {
    data.read("users", phone, (err1) => {
      if (!err1) {
        data.delete("users", phone, (err2) => {
          if (!err2) {
            callback(200, {
              message: "User was deleted succesfully",
            });
          } else {
            callback(500, {
              error: "There was an error in the server side",
            });
          }
        });
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

// export module
module.exports = handler;
