/*
 * Title: Data Library
 * Description: CRUD operations for file management
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

// dependencies
const fs = require("fs");
const path = require("path");

// module scaffolding
const lib = {};

// base directory of the data folder
lib.basedir = path.join(__dirname, "/../.data/");

//write data to file
lib.create = (dir, file, data, callback) => {
  //open file for writing
  fs.open(`${lib.basedir + dir}/${file}.json`, "wx", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //convert data to string
      const stringData = JSON.stringify(data);

      //write data to file and close it
      fs.writeFile(fileDescriptor, stringData, (err2) => {
        if (!err2) {
          //close file
          fs.close(fileDescriptor, (err3) => {
            if (!err3) {
              callback(false);
            } else {
              callback("error closing file");
            }
          });
        } else {
          callback("error writing file");
        }
      });
    } else {
      callback("error opening file");
    }
  });
};

//read data from a file
lib.read = (dir, file, callback) => {
  fs.readFile(`${lib.basedir + dir}/${file}.json`, "utf-8", (err, data) => {
    callback(err, data);
  });
};

//update existing file
lib.update = (dir, file, data, callback) => {
  fs.open(`${lib.basedir + dir}/${file}.json`, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      //convert data to string
      const stringData = JSON.stringify(data);

      //truncate the file
      fs.ftruncate(fileDescriptor, (err2) => {
        if (!err2) {
          //write to the file
          fs.writeFile(fileDescriptor, stringData, (err4) => {
            if (!err4) {
              //close the file
              fs.close(fileDescriptor, (err3) => {
                if (!err3) {
                  callback(false);
                } else {
                  callback("Error closing file");
                }
              });
            } else {
              callback("error updating the file");
            }
          });
        } else {
          callback("Error truncating the  file");
        }
      });
    } else {
      callback("Error opening file");
    }
  });
};

//delete existing file
lib.delete = (dir, file, callback) => {
  //unlink the file
  fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
    if (!err) {
      callback(false);
    } else {
      callback("error deleting file");
    }
  });
};

//export module
module.exports = lib;
