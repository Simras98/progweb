const mongoose = require('mongoose'),
    modelName = 'Client',
    schemaDefinition = new mongoose.Schema({
        id: {
            type: String,
            required: true
        },
        clientId: {
            type: String,
            required: true
        },
        clientSecret: {
            type: String,
            required: true
        },
        grants: {
            type: [String],
            required: true
        },
        redirectUris: {
            type: [String],
            required: true
        }
    });

module.exports = mongoose.model(modelName, schemaDefinition);
