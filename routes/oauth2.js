// Import dependencies
const app = require("../server"),
    express = require('express'),
    router = express.Router(),
    OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

// Start the OAuth2 server
app.oauth = new OAuth2Server({
    model: require('../services/oauth2'),
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

// Generate a token
router.post('/oauth/token', (req, res) => {
    const request = new Request(req);
    const response = new Response(res);
    return app.oauth.token(request, response)
        .then(function (token) {
            res.json(token);
        }).catch(function (err) {
            res.status(err.code || 500).json(err);
        });
});

// Export routes
module.exports = router;
