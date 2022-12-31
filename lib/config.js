/*
*create and export configuration variables
*
*/

// Container for all the environments

let environments = {};

// staging (default) environment
environments.staging = {
    'httpPort': 5000,
    'httpsPort': 5001,
    'envName': 'staging',
    'hashingSecret':'thisIsABigSecret',
    'maxChecks': 5,
    'twilio' : {
        'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
    },
    'templateGlobals' :{
        'appName' : 'UptimeChecker',
        'companyName' : 'NotARealC, Inc',
        'yearCreated' : '2021',
        'baseUrl' : 'http://localhost:5000/'
    }
};

//Production environment
environments.production = {
    'httpPort': 6000,
    'httpsPort': 6001,
    'envName': 'production',
    'hashingSecret':'thisIsBigSecret',
    'maxChecks': 5,
    'twilio' : {
        'accountSid' : 'ACb32d411ad7fe886aac54c665d25e5c5d',
        'authToken' : '9455e3eb3109edc12e3d8c92768f7a67',
        'fromPhone' : '+15005550006'
    },
    'templateGlobals' :{
        'appName' : 'UptimeChecker',
        'companyName' : 'NotARealC, Inc',
        'yearCreated' : '2021',
        'baseUrl' : 'http://localhost:6000/'
    }
};

//Determine which environment was passed as a command line argument

const currentEnvironment = typeof(process.env.NODE_ENV) == 'string'? process.env.NODE_ENV.toLowerCase(): '';

//check that the current environment is one of the environments above, if not, default to staging
const environmentToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment]: environments.staging;

//export the module
module.exports = environmentToExport;