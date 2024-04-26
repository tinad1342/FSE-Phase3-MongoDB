require('dotenv').config();

let apiKey;

function setApiKey() {
    apiKey = process.env.API_KEY;
    if (process.argv[2] != null) {
        if (process.argv[2].indexOf('=') >= 0) {
            apiKey = process.argv[2].substring(process.argv[2].indexOf('=') + 1, process.argv[2].length);
            console.log("apiKey provided through command line. apiKey = " + apiKey);
            return apiKey;
        }
    } else if (apiKey) {
        console.log("apiKey provided through API_KEY env var. API_KEY = " + apiKey);
        return apiKey;
    } else {
        console.log("apiKey has no value. Please provide a value through the API_KEY env var or --api-key cmd line parameter.");
        process.exit(0);
    }  
}

function auth(req, res, next) {
    let apiKeyHeader = req.headers["x-api-key"];
    let apiKeyQuery = req.query["x-api-key"];
    if (!apiKeyHeader && !apiKeyQuery) {
        res.status(401);
        res.send("API Key is missing");
    } else if (apiKeyHeader === apiKey) {
        next();
    } else if (apiKeyQuery === apiKey) {
        next();
    } else {
        res.status(403);
        res.send("Invalid API Key");
    }
}

setApiKey();

module.exports = { auth };