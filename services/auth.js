// Import dependencies
const app = require("../server"),
    clientModel = require('../models/client'),
    tokenModel = require('../models/token'),
    userModel = require('../models/user'),
    OAuth2Server = require('oauth2-server'),
    Request = OAuth2Server.Request,
    Response = OAuth2Server.Response;

app.oauth = new OAuth2Server({
    model: require('../services/auth'),
    accessTokenLifetime: 60 * 60,
    allowBearerTokensInQueryString: true
});

const createToken = async function (req, res) {
    const request = new Request(req);
    const response = new Response(res);
    return app.oauth.token(request, response)
        .then(function (token) {
            res.json(token);
        }).catch(function (err) {
            res.status(err.code || 500).json(err);
        });
}

const getAccessToken = function (token, callback) {
    tokenModel.findOne({
        accessToken: token
    }).lean().exec((function (callback, err, token) {
        if (!token) {
            console.error('Token not found');
        }
        callback(err, token);
    }).bind(null, callback));
};

const getClient = function (clientId, clientSecret, callback) {
    clientModel.findOne({
        clientId: clientId,
        clientSecret: clientSecret
    }).lean().exec((function (callback, err, client) {
        if (!client) {
            console.error('Client not found');
        }
        callback(err, client);
    }).bind(null, callback));
};

const saveToken = function (token, client, user, callback) {
    token.client = {
        id: client.clientId
    };
    token.user = {
        username: user.username
    };
    let a;
    const tokenInstance = new tokenModel(token);
    tokenInstance.save((function (callback, err, token) {
        if (!token) {
            console.error('Token not saved');
        } else {
            token = token.toObject();
            delete token._id;
            delete token.__v;
        }
        a = token;
        callback(err, token);
    }).bind(null, callback));
};

// Method used only by password grant type
const getUser = function (username, password, callback) {
    userModel.findOne({
        username: username,
        password: password
    }).lean().exec((function (callback, err, user) {
        if (!user) {
            console.error('User not found');
        }
        callback(err, user);
    }).bind(null, callback));
};

// Method used only by client_credentials grant type
const getUserFromClient = function (client, callback) {
    clientModel.findOne({
        clientId: client.clientId,
        clientSecret: client.clientSecret,
        grants: 'client_credentials'
    }).lean().exec((function (callback, err, client) {
        if (!client) {
            console.error('Client not found');
        }
        callback(err, {
            username: ''
        });
    }).bind(null, callback));
};

// Methods used only by refresh_token grant type
const getRefreshToken = function (refreshToken, callback) {
    tokenModel.findOne({
        refreshToken: refreshToken
    }).lean().exec((function (callback, err, token) {
        if (!token) {
            console.error('Token not found');
        }
        callback(err, token);
    }).bind(null, callback));
};

const revokeToken = function (token, callback) {
    tokenModel.deleteOne({
        refreshToken: token.refreshToken
    }).exec((function (callback, err, results) {
        const deleteSuccess = results && results.deletedCount === 1;
        if (!deleteSuccess) {
            console.error('Token not deleted');
        }
        callback(err, deleteSuccess);
    }).bind(null, callback));
};

const signup = function (username, password) {
    userModel.findOne({
        username: username,
        password: password
    }).lean().exec((function (callback, err, user) {
        if (!user) {
            user = new userModel({
                username: username,
                password: password
            });
            user.save(function (err, user) {
                if (err) {
                    return console.error(err);
                }
                console.log('Created user', user);
            });
        }
        if (user) {
            console.error('User already existing');
        }
        callback(err, user);
    }).bind(null));
};

const authenticateRequest = function (req, res, next) {
    const request = new Request(req);
    const response = new Response(res);
    return app.oauth.authenticate(request, response)
        .then(function () {
            next();
        }).catch(function (err) {
            res.status(err.code || 500).json(err);
        });
}

// Export functions
module.exports = {
    authenticateRequest:authenticateRequest,
    createToken: createToken,
    getAccessToken: getAccessToken,
    getClient: getClient,
    saveToken: saveToken,
    getUser: getUser,
    getUserFromClient: getUserFromClient,
    getRefreshToken: getRefreshToken,
    revokeToken: revokeToken,
    signup: signup
};
