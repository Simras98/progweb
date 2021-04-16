const mongoose = require('mongoose'),
    modelName = 'Author',
    Book = require('./book'),
    schemaDefinition = new mongoose.Schema({
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        }
    });

schemaDefinition.pre('remove', function (next) {
    Book.find({author: this.id}, (error, books) => {
        if (error) {
            next(error);
        } else if (books.length > 0) {
            next(new Error('This author has books still'));
        } else {
            next();
        }
    });
});

module.exports = mongoose.model(modelName, schemaDefinition);
