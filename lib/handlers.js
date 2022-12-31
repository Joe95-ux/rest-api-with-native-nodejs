/*
 * Request handlers
 *
 */

// Dependencies
const _data = require("./data");
const helpers = require("./helpers");
const config = require("./config");

//Define handlers

let handlers = {};

// HTML Handlers

// Index Handler

handlers.index = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Uptime Monitoring - Made Simple',
      'head.description' : 'We offer free, simple uptime monitoring for HTTP/HTTPS sites all kinds. When your site goes down, we\'ll send you a text to let you know',
      'body.class' : 'index'
    };
    // Read in a template as a string
    helpers.getTemplate('index',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

// Create Account
handlers.accountCreate = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Create an Account',
      'head.description' : 'Signup is easy and only takes a few seconds.',
      'body.class' : 'accountCreate'
    };
    // Read in a template as a string
    helpers.getTemplate('accountCreate',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

// Create New Session
handlers.sessionCreate = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Login to your account.',
      'head.description' : 'Please enter your phone number and password to access your account.',
      'body.class' : 'sessionCreate'
    };
    // Read in a template as a string
    helpers.getTemplate('sessionCreate',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

// Edit Your Account
handlers.accountEdit = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Account Settings',
      'body.class' : 'accountEdit'
    };
    // Read in a template as a string
    helpers.getTemplate('accountEdit',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

// Session has been deleted
handlers.sessionDeleted = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Prepare data for interpolation
    var templateData = {
      'head.title' : 'Logged Out',
      'head.description' : 'You have been logged out of your account.',
      'body.class' : 'sessionDeleted'
    };
    // Read in a template as a string
    helpers.getTemplate('sessionDeleted',templateData,function(err,str){
      if(!err && str){
        // Add the universal header and footer
        helpers.addUniversalTemplates(str,templateData,function(err,str){
          if(!err && str){
            // Return that page as HTML
            callback(200,str,'html');
          } else {
            callback(500,undefined,'html');
          }
        });
      } else {
        callback(500,undefined,'html');
      }
    });
  } else {
    callback(405,undefined,'html');
  }
};

// Favicon
handlers.favicon = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Read in the favicon's data
    helpers.getStaticAsset('favicon.ico',function(err,data){
      if(!err && data){
        // Callback the data
        callback(200,data,'favicon');
      } else {
        callback(500);
      }
    });
  } else {
    callback(405);
  }
};

// Public assets
handlers.public = function(data,callback){
  // Reject any request that isn't a GET
  if(data.method == 'get'){
    // Get the filename being requested
    var trimmedAssetName = data.trimmedPath.replace('public/','').trim();
    if(trimmedAssetName.length > 0){
      // Read in the asset's data
      helpers.getStaticAsset(trimmedAssetName,function(err,data){
        if(!err && data){

          // Determine the content type (default to plain text)
          var contentType = 'plain';

          if(trimmedAssetName.indexOf('.css') > -1){
            contentType = 'css';
          }

          if(trimmedAssetName.indexOf('.png') > -1){
            contentType = 'png';
          }

          if(trimmedAssetName.indexOf('.jpg') > -1){
            contentType = 'jpg';
          }

          if(trimmedAssetName.indexOf('.ico') > -1){
            contentType = 'favicon';
          }

          // Callback the data
          callback(200,data,contentType);
        } else {
          callback(404);
        }
      });
    } else {
      callback(404);
    }

  } else {
    callback(405);
  }
};



// JSON API Handlers

// Users
handlers.users = function (data, callback) {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._users[data.method](data, callback);
  } else {
    callback(405);
  }
};

//container for users submethods
handlers._users = {};

//Users - post
//Required data: firstName, lastName, phone, password, tosAgreement
//Optional data: none
handlers._users.post = function (data, callback) {
  //check that all required fields are filled out
  let firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  let lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  let phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  let password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  let tosAgreement =
    typeof data.payload.tosAgreement == "boolean" &&
    data.payload.tosAgreement === true
      ? true
      : false;

  if (firstName && lastName && phone && password && tosAgreement) {
    //make sure that the user doesnt already exist
    _data.read("users", phone, function (err, data) {
      if (err) {
        //hash the password
        const hashedPassword = helpers.hash(password);

        if (hashedPassword) {
          //Create the user object
          const userObject = {
            firstName: firstName,
            lastName: lastName,
            phone: phone,
            hashedPassword: hashedPassword,
            tosAgreement: tosAgreement,
          };
          //store the user
          _data.create("users", phone, userObject, function (err) {
            if (!err) {
              callback(200);
            } else {
              console.log(err);
              callback(500, { Error: "Could not create the new user" });
            }
          });
        } else {
          callback(500, { Error: "Could not hash user's password" });
        }
      } else {
        callback(400, {
          Error: "A user with that phone number already exists",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required fields" });
  }
};

// Users - get
// Reguired data: phone
// Optional data : none
// make sure :let an authenticated user access their object.
// Dont let them access anyone else's.
handlers._users.get = function (data, callback) {
  //check that the phone number is valid
  let phone =
    typeof data.queryStringObject.get("phone") == "string" &&
    data.queryStringObject.get("phone").trim().length == 10
      ? data.queryStringObject.get("phone").trim()
      : false;
  if (phone) {
    //Get the token from the headers
    let token =
      typeof data.headers.token == "string" ? data.headers.token : false;
    //verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        //lookup the user
        _data.read("users", phone, function (err, data) {
          if (!err && data) {
            //Remove the hashed password from the user object before returning it to the required user
            delete data.hashedPassword;
            callback(200, data);
          } else {
            callback(404);
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header or token is invalid",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Users - put
//Required data: phone
//Optional data: firstName, lastName, password (at least one must be specified)
// make sure: authenticated user should update only their own object and no one else's
handlers._users.put = function (data, callback) {
  //check for the required field
  let phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;

  //check for the optional fields
  let firstName =
    typeof data.payload.firstName == "string" &&
    data.payload.firstName.trim().length > 0
      ? data.payload.firstName.trim()
      : false;
  let lastName =
    typeof data.payload.lastName == "string" &&
    data.payload.lastName.trim().length > 0
      ? data.payload.lastName.trim()
      : false;
  let password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;

  //Error if phone is invalid
  if (phone) {
    // Error if nothing is sent to update
    if (firstName || lastName || password) {
      //Get the token from the headers
      let token =
        typeof data.headers.token == "string" ? data.headers.token : false;

      //verify that the given token is valid for the phone number
      handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
        if (tokenIsValid) {
          // Lookup the user
          _data.read("users", phone, function (err, userData) {
            if (!err && userData) {
              //update the fields necessary
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.hashedPassword = helpers.hash(password);
              }
              //store new update
              _data.update("users", phone, userData, function (err) {
                if (!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, { Error: "Could not update the user" });
                }
              });
            } else {
              callback(400, { Error: "The specified user does not exist" });
            }
          });
        } else {
          callback(403, {
            Error: "Missing required token in header or token is invalid",
          });
        }
      });
    } else {
      callback(400, { Error: "Missing fields to update" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Users - delete
// Required field: phone
// Only let authenticated user delete their own object and no one else's
// Cleanup(delete) any data files associated with this user
handlers._users.delete = function (data, callback) {
  //check that the phone number is valid
  let phone =
    typeof data.queryStringObject.get("phone") == "string" &&
    data.queryStringObject.get("phone").trim().length == 10
      ? data.queryStringObject.get("phone").trim()
      : false;
  if (phone) {
    //Get the token from the headers
    let token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    //verify that the given token is valid for the phone number
    handlers._tokens.verifyToken(token, phone, function (tokenIsValid) {
      if (tokenIsValid) {
        //lookup the user
        _data.read("users", phone, function (err, userData) {
          if (!err && userData) {
            _data.delete("users", phone, function (err) {
              if (!err) {
                // Delete each of the checks associated with the user
                let userChecks = typeof userData.checks == "object" && userData.checks instanceof Array ? userData.checks : [];
                let checksToDelete = userChecks.length;
                if(checksToDelete > 0){
                  let checkDeleted = 0;
                  let deletionErrors = false;
                  // Loop through the checks
                  userChecks.forEach(checkId => {
                    // Delete the check
                    _data.delete('checks',checkId,function(err){
                      if(err){
                        deletionErrors = true;
                      }
                      checkDeleted++;
                      if(checkDeleted == checksToDelete){
                        if(!deletionErrors){
                          callback(200);
                        }else{
                          callback(500, {"Error" : "Errors encountered while attempting to delete all of the user's checks. All checks may not have been deleted from the system successfully."});
                        }

                      }
                    });
                    
                  });


                }else{
                  callback(200);
                }

              } else {
                callback(500, { Error: "Could not delete specified user" });
              }
            });
          } else {
            callback(400, { Error: "Could not find the specified user" });
          }
        });
      } else {
        callback(403, {
          Error: "Missing required token in header or token is invalid",
        });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};
// Tokens
handlers.tokens = function (data, callback) {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._tokens[data.method](data, callback);
  } else {
    callback(405);
  }
};

//container for all the tokens methods
handlers._tokens = {};

//Tokens - post
handlers._tokens.post = function (data, callback) {
  let phone =
    typeof data.payload.phone == "string" &&
    data.payload.phone.trim().length === 10
      ? data.payload.phone.trim()
      : false;
  let password =
    typeof data.payload.password == "string" &&
    data.payload.password.trim().length > 0
      ? data.payload.password.trim()
      : false;
  if (phone && password) {
    // look up the user that matches that phone number
    _data.read("users", phone, function (err, userData) {
      if (!err && userData) {
        //Hash the sent password and compare it to one stored in user object
        const hashedPassword = helpers.hash(password);
        if (hashedPassword === userData.hashedPassword) {
          //if valid, create a new token with a random name. set expiration date 1 hr in the future
          const tokenId = helpers.createRandomString(20);
          const expires = Date.now() + 1000 * 60 * 60;
          const tokenObject = {
            phone: phone,
            tokenId: tokenId,
            expires: expires,
          };

          //store the token
          _data.create("tokens", tokenId, tokenObject, function (err) {
            if (!err) {
              callback(200, tokenObject);
            } else {
              callback(500, { Error: "Could not create the new token" });
            }
          });
        } else {
          callback(400, {
            Error: "password did not match the specified user's password",
          });
        }
      } else {
        callback(400, { Error: "Could not find the specified user" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field(s)" });
  }
};

//Tokens - get
// required data: id
//optional data: none
handlers._tokens.get = function (data, callback) {
  //check that the tokenId is valid
  let tokenId =
    typeof data.queryStringObject.get("tokenId") == "string" &&
    data.queryStringObject.get("tokenId").trim().length == 20
      ? data.queryStringObject.get("tokenId").trim()
      : false;
  if (tokenId) {
    //lookup the user token
    _data.read("tokens", tokenId, function (err, tokenData) {
      if (!err && tokenData) {
        callback(200, tokenData);
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//Tokens - put
// Required data : tokenId, extend
// Optional data : none
//id refers to tokenId
handlers._tokens.put = function (data, callback) {
  let id =
    typeof data.payload.tokenId == "string" &&
    data.payload.tokenId.trim().length == 20
      ? data.payload.tokenId.trim()
      : false;
  let extend =
    typeof data.payload.extend == "boolean" && data.payload.extend === true
      ? true
      : false;
  if (id && extend) {
    //lookup the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        //check to make sure the token isnt already expired
        if (tokenData.expires > Date.now()) {
          // set the expiration an hour from now
          tokenData.expires = Date.now() + 1000 * 60 * 60;

          //store the new updates
          _data.update("tokens", id, tokenData, function (err) {
            if (!err) {
              callback(200);
            } else {
              callback(500, {
                Error: "Could not update the token's expiration",
              });
            }
          });
        } else {
          callback(400, {
            Error: "The token has already expired and cannot be extended",
          });
        }
      } else {
        callback(400, { Error: "Specified token does not exist " });
      }
    });
  } else {
    callback(400, {
      Error: "Missing required field(s) or field(s) are invalid",
    });
  }
};

//Tokens - delete
//Required data : tokenId
// Optional data : none
handlers._tokens.delete = function (data, callback) {
  //check that the tokenId is valid
  let id =
    typeof data.queryStringObject.get("tokenId") == "string" &&
    data.queryStringObject.get("tokenId").trim().length == 20
      ? data.queryStringObject.get("tokenId").trim()
      : false;
  if (id) {
    //lookup the token
    _data.read("tokens", id, function (err, tokenData) {
      if (!err && tokenData) {
        _data.delete("tokens", id, function (err) {
          if (!err) {
            callback(200);
          } else {
            callback(500, { Error: "Could not delete specified token" });
          }
        });
      } else {
        callback(400, { Error: "Could not find the specified token" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// verify if a given tokendId is valid for a given user
handlers._tokens.verifyToken = function (id, phone, callback) {
  // Lookup the token
  _data.read("tokens", id, function (err, tokenData) {
    if (!err && tokenData) {
      //check that the token is for the given user and has not expired
      if (tokenData.phone === phone && tokenData.expires > Date.now()) {
        callback(true);
      } else {
        callback(false);
      }
    } else {
      callback(false);
    }
  });
};

//Checks

handlers.checks = function (data, callback) {
  let acceptableMethods = ["post", "get", "put", "delete"];
  if (acceptableMethods.indexOf(data.method) > -1) {
    handlers._checks[data.method](data, callback);
  } else {
    callback(405);
  }
};

//container for all the checks methods

handlers._checks = {};

//checks - POST
//Required data: protocol, url, method, successCodes, timeoutSeconds
//Optional data: none

handlers._checks.post = function (data, callback) {
  // validate inputs

  let protocol =
    typeof data.payload.protocol == "string" &&
    ["https", "http"].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  let url =
    typeof data.payload.url == "string" && data.payload.url.trim().length > 0
      ? data.payload.url.trim()
      : false;
  let method =
    typeof data.payload.method == "string" &&
    ["get", "post", "put", "delete"].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;

  let successCodes =
    typeof data.payload.successCodes == "object" &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;
  let timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" &&
    data.payload.timeoutSeconds % 1 === 0 &&
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  if (protocol && url && method && successCodes && timeoutSeconds) {
    //get the token from the headers
    const token =
      typeof data.headers.token == "string" ? data.headers.token : false;

    //look up the user by reading the token
    _data.read("tokens", token, function (err, tokenData) {
      if (!err && tokenData) {
        const userPhone = tokenData.phone;

        // use phone to lookup the user data
        _data.read("users", userPhone, function (err, userData) {
          if (!err && userData) {
            //userChecks will be created and added to the user object if it doesnt already exist
            let userChecks =
              typeof userData.checks == "object" &&
              userData.checks instanceof Array
                ? userData.checks
                : [];
            // verify that the user has less than the number of max checks per user
            if (userChecks.length < config.maxChecks) {
              //create a random Id for the check
              const checkId = helpers.createRandomString(20);

              //create the check object and include the user's phone
              let checkObject = {
                id: checkId,
                userPhone: userPhone,
                protocol: protocol,
                url: url,
                method: method,
                successCodes: successCodes,
                timeoutSeconds: timeoutSeconds,
              };

              //save the checkObject
              _data.create("checks", checkId, checkObject, function (err) {
                if (!err) {
                  // Add the checkid to the user's object
                  userData.checks = userChecks;
                  userData.checks.push(checkId);

                  // save the new user data
                  _data.update("users", userPhone, userData, function (err) {
                    if (!err) {
                      // Return the data about the new check
                      callback(200, checkObject);
                    } else {
                      callback(500, {
                        Error: "Could not update the user with the new check",
                      });
                    }
                  });
                } else {
                  callback(500, { Error: "Could not create the new check" });
                }
              });
            } else {
              callback(400, {
                Error:
                  "The user already has the maximum number of checks (" +
                  config.maxChecks +
                  ")",
              });
            }
          } else {
            callback(403);
          }
        });
      } else {
        callback(403);
      }
    });
  } else {
    callback(400, { Error: "Missing required inputs, or inputs are invalid" });
  }
};

// Checks - Get
// Required data : id
// Optional data : none
handlers._checks.get = function (data, callback) {
  //check that the id is valid
  let id =
    typeof data.queryStringObject.get("id") == "string" &&
    data.queryStringObject.get("id").trim().length == 20
      ? data.queryStringObject.get("id").trim()
      : false;
  if (id) {
    //Lookup the check
    _data.read("checks", id, function (err, checkData) {
      if (!err && checkData) {
        //Get the token from the headers
        let token =
          typeof data.headers.token == "string" ? data.headers.token : false;
        //verify that the given token is valid and belongs to the user who created the check
        handlers._tokens.verifyToken(
          token,
          checkData.userPhone,
          function (tokenIsValid) {
            if (tokenIsValid) {
              // Return checkdata
              callback(200, checkData);
            } else {
              callback(403);
            }
          }
        );
      } else {
        callback(404);
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// checks - put
// Required data : id
// Optional data : protocol, url, method, successCodes, timeoutSeconds(one must be sent)

handlers._checks.put = function (data, callback) {
  //check for required field
  let id =
    typeof data.payload.id == "string" && data.payload.id.trim().length == 20
      ? data.payload.id.trim()
      : false;

  // check for the optional fields
  let protocol =
    typeof data.payload.protocol == "string" &&
    ["https", "http"].indexOf(data.payload.protocol) > -1
      ? data.payload.protocol
      : false;
  let url =
    typeof data.payload.url == "string" && data.payload.url.trim().length > 0
      ? data.payload.url.trim()
      : false;
  let method =
    typeof data.payload.method == "string" &&
    ["get", "post", "put", "delete"].indexOf(data.payload.method) > -1
      ? data.payload.method
      : false;

  let successCodes =
    typeof data.payload.successCodes == "object" &&
    data.payload.successCodes instanceof Array &&
    data.payload.successCodes.length > 0
      ? data.payload.successCodes
      : false;
  let timeoutSeconds =
    typeof data.payload.timeoutSeconds == "number" &&
    data.payload.timeoutSeconds % 1 === 0 &&
    data.payload.timeoutSeconds >= 1 &&
    data.payload.timeoutSeconds <= 5
      ? data.payload.timeoutSeconds
      : false;

  //check to make sure id is valid
  if (id) {
    // check to make sure one or more optional fields is sent
    if (protocol || url || method || successCodes || timeoutSeconds) {
      //Lookup the check
      _data.read("checks", id, function (err, checkData) {
        if (!err && checkData) {
          //Get the token from the headers
          let token =
            typeof data.headers.token == "string" ? data.headers.token : false;
          //verify that the given token is valid and belongs to the user who created the check
          handlers._tokens.verifyToken(
            token,
            checkData.userPhone,
            function (tokenIsValid) {
              if (tokenIsValid) {
                // update check where necessary
                if (protocol) {
                  checkData.protocol = protocol;
                }
                if (url) {
                  checkData.url = url;
                }
                if (method) {
                  checkData.method = method;
                }
                if (successCodes) {
                  checkData.successCodes = successCodes;
                }
                if (timeoutSeconds) {
                  checkData.timeoutSeconds = timeoutSeconds;
                }

                // store the new updates
                _data.update("checks", id, checkData, function (err) {
                  if (!err) {
                    callback(200);
                  } else {
                    callback(500, { Error: "Could not update the check" });
                  }
                });
              } else {
                callback(403);
              }
            }
          );
        } else {
          callback(400, { Error: "Check ID did not exist" });
        }
      });
    } else {
      callback(400, { Error: "Missing fields to update" });
    }
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

// Checks - delete
// Required data : id
// Optional data : none

handlers._checks.delete = function (data, callback) {
  //check that the id  is valid
  let id =
    typeof data.queryStringObject.get("id") == "string" &&
    data.queryStringObject.get("id").trim().length == 20
      ? data.queryStringObject.get("id").trim()
      : false;
  if (id) {
    //lookup the check
    _data.read("checks", id, function (err, checkData) {
      if (!err && checkData) {
        //Get the token from the headers
        let token =
          typeof data.headers.token == "string" ? data.headers.token : false;

        //verify that the given token is valid for the phone number
        handlers._tokens.verifyToken(token,checkData.userPhone,function (tokenIsValid) {
            if (tokenIsValid) {
              // Delete checkdata
              _data.delete("checks", id, function (err) {
                if (!err) {
                  //lookup the user
                  _data.read("users", checkData.userPhone, function (err, userData) {
                    if (!err && userData) {
                      let userChecks = typeof userData.checks == "object" && userData.checks instanceof Array ? userData.checks : [];

                      // Remove the deleted check from their list of checks
                      let checkPosition = userChecks.indexOf(id)
                      if(checkPosition > -1){
                        userChecks.splice(checkPosition, 1);

                        //Resave the user's data
                        _data.update("users", checkData.userPhone, userData,function(err) {
                          if (!err) {
                            callback(200);
                          } else {
                            callback(500, {
                              Error: "Could not update the user",
                            });
                          }
                        });
                      }else{
                        callback(500, {"Error": "Could not find the check on the user's object, so could not remove it."})
                      }
                    } else {
                      callback(500, {
                        Error: "Could not find the user who created the check, so could not remove the check from the list of checks on the user object",
                      });
                    }
                  });
                } else {
                  callback(500, { Error: "Could not delete the check data" });
                }
              });
            } else {
              callback(403);
            }
          }
        );
      } else {
        callback(400, { Error: "The specified check ID does not exist" });
      }
    });
  } else {
    callback(400, { Error: "Missing required field" });
  }
};

//ping handler
handlers.ping = function (data, callback) {
  callback(200);
};

//not found handler

handlers.notfound = function (data, callback) {
  callback(404);
};

module.exports = handlers;
