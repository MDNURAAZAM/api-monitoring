/*
 * Title: Environments
 * Description: enviorment configurations
 * Author: MD Nura Azam
 * Date: 16/03/2025
 *
 */

// module scaffolding
const environments = {};

//staging environment
environments.staging = {
  port: 3000,
  envName: "staging",
  secretKey: "asgagsdfhdfh",
};

//production environment
environments.production = {
  port: 5000,
  envName: "production",
  secretKey: "awehqiweyqwey",
};

//determine which environment was passed
const currentEnvironment =
  typeof process.env.NODE_ENV === "string"
    ? process.env.NODE_ENV.trim()
    : "staging";

//export corresponding environment object
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

//export module
module.exports = environmentToExport;
