const mongoose = require('mongoose'),
    modelName = 'User',
    schemaDefinition = new mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    }),
    modelInstance = mongoose.model(modelName, schemaDefinition);

module.exports = modelInstance;
