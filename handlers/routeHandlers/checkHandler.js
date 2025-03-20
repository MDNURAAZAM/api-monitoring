/*
 * Title: Check Handler
 * Description: functions to handle check routes
 * Author: MD Nura Azam
 * Date: 20/03/2025
 *
 */

//dependencies
const {
  hash,
  parseJSON,
  createRandomString,
} = require("../../helpers/utilities");
const { maxChecks } = require("../../helpers/environments");
const data = require("./../../lib/data");
const tokenHandler = require("./tokenHandler");

// module scaffolding
const handler = {};

handler.checkHandler = (requestProperties, callback) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) >= 0) {
    handler._check[requestProperties.method](requestProperties, callback);
  } else {
    callback(405);
  }
};

handler._check = {};

//post request handler
handler._check.post = (requestProperties, callback) => {
  const { body } = requestProperties || {};
  //validate inputs
  const protocol =
    typeof body.protocol === "string" &&
    ["http", "https"].indexOf(body?.protocol?.trim()) >= 0
      ? body.protocol
      : false;

  const url =
    typeof body?.url === "string" && body?.url?.trim().length > 0
      ? body?.url
      : false;

  const method =
    typeof body?.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(
      body?.method?.toUpperCase().trim()
    ) >= 0
      ? body.method.toUpperCase()
      : false;

  const successCodes =
    typeof body?.successCodes === "object" &&
    body?.successCodes instanceof Array
      ? body.successCodes
      : false;

  const timeoutSeconds =
    typeof body.timeoutSeconds === "number" &&
    body.timeoutSeconds % 1 == 0 &&
    body.timeoutSeconds >= 1 &&
    body.timeoutSeconds <= 5
      ? body.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    //validate the token
    const token =
      typeof requestProperties.headersObject.token === "string" &&
      requestProperties.headersObject.token.trim().length === 20
        ? requestProperties.headersObject.token.trim()
        : false;
    if (token) {
      data.read("tokens", token, (err1, tokenData) => {
        if (!err1 && tokenData) {
          const userPhone = parseJSON(tokenData).phone;

          //verify the user
          data.read("users", userPhone, (err2, userData) => {
            if (!err2 && userData) {
              tokenHandler._token.verify(token, userPhone, (isValid) => {
                if (isValid) {
                  const userObject = { ...parseJSON(userData) };
                  const userChecks =
                    typeof userObject?.checks === "object" &&
                    userObject.checks instanceof Array
                      ? userObject.checks
                      : [];
                  if (userChecks?.length < maxChecks) {
                    const checkId = createRandomString(20);
                    const checkObject = {
                      id: checkId,
                      userPhone,
                      protocol,
                      url,
                      method,
                      successCodes,
                      timeoutSeconds,
                    };

                    //store the object in db
                    data.create("checks", checkId, checkObject, (err3) => {
                      if (!err3) {
                        //add checkId to user's object
                        userObject.checks =
                          userChecks?.length > 0
                            ? [...userChecks, checkId]
                            : [checkId];
                        //update user data
                        data.update("users", userPhone, userObject, (err4) => {
                          if (!err4) {
                            callback(200, checkObject);
                          } else {
                            callback(500, {
                              error: "There is a problem in the server side",
                            });
                          }
                        });
                      } else {
                        callback(500, {
                          error: "There is a problem in the server side",
                        });
                      }
                    });
                  } else {
                    callback(401, {
                      error: "Users already reached maximum checks limit",
                    });
                  }
                } else {
                  callback(403, {
                    error: "Auhtentication failure! ",
                  });
                }
              });
            } else {
              callback(404, {
                error: "User not found ",
              });
            }
          });
        } else {
          callback(403, {
            error: "Auhtentication failure! ",
          });
        }
      });
    } else {
      callback(403, {
        error: "Auhtentication failure! ",
      });
    }
  } else {
    callback(400, {
      error: "You have a problem in your request ",
    });
  }
};

//get request handler
handler._check.get = (requestProperties, callback) => {
  const { id } = requestProperties?.queryStringObject;

  const checkId =
    typeof id === "string" && id.trim().length === 20 ? id : false;
  if (checkId) {
    data.read("checks", checkId, (err1, checkData) => {
      if (!err1 && checkData) {
        //validate the token
        const token =
          typeof requestProperties.headersObject.token === "string" &&
          requestProperties.headersObject.token.trim().length === 20
            ? requestProperties.headersObject.token.trim()
            : false;
        const phone = parseJSON(checkData).userPhone;
        tokenHandler._token.verify(token, phone, (isValid) => {
          if (isValid) {
            callback(200, parseJSON(checkData));
          } else {
            callback(403, {
              error: "Authentication failure!",
            });
          }
        });
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

//put request handler
handler._check.put = (requestProperties, callback) => {
  const { body } = requestProperties || {};
  //validate inputs
  const id =
    typeof body.id === "string" && body.id.trim().length == 20
      ? body.id
      : false;

  const protocol =
    typeof body.protocol === "string" &&
    ["http", "https"].indexOf(body?.protocol?.trim()) >= 0
      ? body.protocol
      : false;

  const url =
    typeof body?.url === "string" && body?.url?.trim().length > 0
      ? body?.url
      : false;

  const method =
    typeof body?.method === "string" &&
    ["GET", "POST", "PUT", "DELETE"].indexOf(
      body?.method?.toUpperCase().trim()
    ) >= 0
      ? body.method.toUpperCase()
      : false;

  const successCodes =
    typeof body?.successCodes === "object" &&
    body?.successCodes instanceof Array
      ? body.successCodes
      : false;

  const timeoutSeconds =
    typeof body.timeoutSeconds === "number" &&
    body.timeoutSeconds % 1 == 0 &&
    body.timeoutSeconds >= 1 &&
    body.timeoutSeconds <= 5
      ? body.timeoutSeconds
      : false;

  if (id) {
    data.read("checks", id, (err1, checkData) => {
      if (!err1 && checkData) {
        const checkObject = parseJSON(checkData);
        //validate the token
        const token =
          typeof requestProperties.headersObject.token === "string" &&
          requestProperties.headersObject.token.trim().length === 20
            ? requestProperties.headersObject.token.trim()
            : false;
        tokenHandler._token.verify(
          token,
          checkObject.userPhone,
          (isTokenValid) => {
            if (isTokenValid) {
              if (protocol || url || method || successCodes || timeoutSeconds) {
                if (protocol) {
                  checkObject.protocol = protocol;
                }

                if (url) {
                  checkObject.url = url;
                }

                if (method) {
                  checkObject.method = method;
                }

                if (successCodes) {
                  checkObject.successCodes = successCodes;
                }

                if (timeoutSeconds) {
                  checkObject.timeoutSeconds = timeoutSeconds;
                }
                //store the check object
                data.update("checks", id, checkObject, (err2) => {
                  if (!err2) {
                    callback(200);
                  } else {
                    callback(500, {
                      error: "There was a problem in the server side",
                    });
                  }
                });
              } else {
                callback(400, {
                  error: "You must provide at least one field to update",
                });
              }
            } else {
              callback(403, { error: "Authentication failure!" });
            }
          }
        );
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

//delete request handler
handler._check.delete = (requestProperties, callback) => {};

// export module
module.exports = handler;
