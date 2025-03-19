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

  const id =
    typeof body?.id === "string" && body?.id?.trim().length === 20
      ? body.id
      : false;

  const extend = !!(typeof body?.extend === "boolean" && body?.extend === true);

  if (id && extend) {
    data.read("tokens", id, (err1, token) => {
      if (!err1 && token) {
        const tokenData = { ...parseJSON(token) };
        if (tokenData?.expires > Date.now()) {
          tokenData.expires = Date.now() + 60 * 60 * 1000;

          //store the updated token
          data.update("tokens", id, tokenData, (err2) => {
            if (!err2) {
              callback(200);
            } else {
              callback(500, {
                error: "there was an error in the server side",
              });
            }
          });
        } else {
          callback(400, {
            error: "token already expired",
          });
        }
      } else {
        callback(400, {
          error: "Invalid Token. Please try again",
        });
      }
    });
  } else {
    callback(400, {
      error: "Invalid token. Please try again",
    });
  }
};

//delete request handler
handler._token.delete = (requestProperties, callback) => {
  const { id: requestedTokenId } = requestProperties?.queryStringObject;

  const tokenId =
    typeof requestedTokenId === "string" &&
    requestedTokenId.trim().length === 20
      ? requestedTokenId
      : false;
  if (tokenId) {
    // look up for the token
    data.read("tokens", tokenId, (err1) => {
      if (!err1) {
        data.delete("tokens", tokenId, (err2) => {
          if (!err2) {
            callback(200, {
              message: "Token was deleted succesfully",
            });
          } else {
            callback(500, {
              error: "There was an error in the server side",
            });
          }
        });
      } else {
        callback(404, {
          error: "Requested token was not found",
        });
      }
    });
  } else {
    callback(404, {
      error: "Requested token was not found",
    });
  }
};

handler._token.verify = (id, phone, callback) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err && tokenData) {
      //check if token is valid
      const isTokenValid =
        phone === parseJSON(tokenData).phone &&
        parseJSON(tokenData).expires > Date.now();
      if (isTokenValid) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

// export module
module.exports = handler;
