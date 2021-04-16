const mongoose = require('mongoose'),
    modelName = 'Token',
    schemaDefinition = new mongoose.Schema({
        accessToken: {
            type: String,
            required: true
        },
        accessTokenExpiresAt: {
            type: Date,
            required: true
        },
        refreshToken: {
            type: String,
            required: true
        },
        refreshTokenExpiresAt: {
            type: Date,
            required: true
        },
        client: {
            type: Object,
            required: true
        },
        user: {
            type: Object,
            required: true
        }
    });

schemaDefinition.index({"refreshTokenExpiresAt": 1}, {expireAfterSeconds: 0});

module.exports = mongoose.model(modelName, schemaDefinition);
