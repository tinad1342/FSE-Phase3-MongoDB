require('dotenv').config();

function auth(req, res, next) {
    let apiKeyHeader = req.headers["x-api-key"];
    let apiKeyQuery = req.query["x-api-key"];
    if (!apiKeyHeader && !apiKeyQuery) {
        res.status(401);
        res.send("API Key is missing");
    } else if (apiKeyHeader === process.env.API_KEY) {
        next();
    } else if (apiKeyQuery === process.env.API_KEY) {
        next();
    } else {
        res.status(403);
        res.send("Invalid API Key");
    }

    // let apiKey = null;
    // if (req.headers["x-api-key"]) {
    //     apiKey = ;
    // }

}

module.exports = { auth };