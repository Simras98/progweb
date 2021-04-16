// Import dependencies
const Author = require('../models/author'),
    Book = require('../models/book'),
    express = require('express'),
    format = require('../services/format'),
    router = express.Router();

// Create new author
router.put('/new', async (req, res) => {
    try {
        const author = new Author({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
        });
        await author.save();
        return res.json(format.formatAuthor(author));
    } catch {
        res.status(500);
        return res.json({error: 'Error creating author'});
    }
});

// Get all authors
router.get('/', async (req, res) => {
    try {
        let finalAuthors = [];
        const authors = await Author.find();
        for (const author of authors) {
            const authorBooks = await Book.find({author: author.id}).exec();
            const formattedAuthor = format.formatAuthor(author, authorBooks);
            finalAuthors.push(formattedAuthor);
        }
        return res.json(format.formatAuthors(finalAuthors));
    } catch {
        res.status(500);
        return res.json({error: 'Error getting authors'});
    }
});

// Get author with id
router.get('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({author: author.id}).exec();
        const formattedAuthor = format.formatAuthor(author, books);
        return res.json(formattedAuthor);
    } catch {
        res.status(500);
        return res.json({error: 'Error getting author'});
    }
});

// Search authors with parameters
router.post('/search', async (req, res) => {
    try {
        const {firstName, lastName} = req.body;
        let finalAuthors = [];
        let query = Author.find();
        if (firstName) {
            query = query.regex('firstName', new RegExp(firstName, 'i'));
        }
        if (lastName) {
            query = query.regex('lastName', new RegExp(lastName, 'i'));
        }
        const authors = await query.exec();
        if (authors.length > 0) {
            for (const author of authors) {
                const authorBooks = await Book.find({author: author.id}).exec();
                const formattedAuthor = format.formatAuthor(author, authorBooks);
                finalAuthors.push(formattedAuthor);
            }
            return res.json(format.formatAuthors(finalAuthors));
        } else {
            return res.json(format.formatAuthor(finalAuthors));
        }
    } catch {
        res.status(500);
        return res.json({error: 'Error gettings books'});
    }
})
;

// Update author
router.put('/:id', async (req, res) => {
    try {
        let author = await Author.findById(req.params.id);
        author.firstName = req.body.firstName;
        author.lastName = req.body.lastName;
        await author.save();
        return res.json(format.formatAuthor(author));
    } catch {
        res.status(500);
        return res.json({error: 'Error editing author'});
    }
});

// Delete author
router.delete('/:id', async (req, res) => {
    try {
        const author = await Author.findById(req.params.id);
        const books = await Book.find({author: author.id}).exec();
        if (books.length > 0) {
            res.status(500);
            return res.json({error: 'Impossible to delete author with books'});
        }
        await author.remove();
        return res.json({success: 'Author successfully deleted'});
    } catch {
        res.status(500);
        return res.json({error: 'Error deleting author'});
    }
});

// Export routes
module.exports = router;
