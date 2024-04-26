require('dotenv').config();
const crypto = require('crypto');

let apiKey;
let apiKeys = new Map();

function getNewApiKey(email){
  let newApiKey = crypto.randomBytes(6).toString('hex');
  apiKeys.set(email, newApiKey);
  displayApiKeys();
  return newApiKey;
}

function displayApiKeys(){
  console.log("apiKeys:");
  for(let entry of apiKeys.entries()){
    console.log(entry)
  }
}

function setApiKey() {
    apiKey = process.env.API_KEY;
    if (process.argv[2] != null) {
        if (process.argv[2].indexOf('=') >= 0) {
            apiKey = process.argv[2].substring(process.argv[2].indexOf('=') + 1, process.argv[2].length);
            console.log("apiKey provided through command line. apiKey = " + apiKey);
            // return apiKey;
        }
    } else if (apiKey) {
        console.log("apiKey provided through API_KEY env var. API_KEY = " + apiKey);
        // return apiKey;
    } else {
        console.log("apiKey has no value. Please provide a value through the API_KEY env var or --api-key cmd line parameter.");
        process.exit(0);
    }
    if(apiKey && apiKey.length >0){
        apiKeys.set("default", apiKey );
        displayApiKeys();
    }  
}

function auth(req, res, next) {
    const apiKeyHeader = req.headers["x-api-key"];
    const apiKeyQuery = req.query["x-api-key"];
    if (!apiKeyHeader && !apiKeyQuery) {
        res.status(401);
        res.send("API Key is missing");
    
    } 
    let keyValid = false;    
    for (let value of apiKeys.values()) {
      if (apiKeyHeader === value || apiKeyQuery === value) {
        keyValid = true;
      }
    }

    if (!keyValid) {
        res.status(403);
        return res.send("Invalid API Key");
    }
    next();
}

setApiKey();

module.exports = { auth, getNewApiKey };