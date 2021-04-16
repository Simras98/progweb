const mongoose = require('mongoose'),
    modelName = 'Book',
    schemaDefinition = new mongoose.Schema({
        title: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        year: {
            type: Number,
            required: true
        },
        pageCount: {
            type: Number,
            required: true
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Author'
        }
    });

module.exports = mongoose.model(modelName, schemaDefinition);
