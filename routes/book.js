// Import dependencies
const Book = require('../models/book'),
    express = require('express'),
    format = require('../services/format'),
    router = express.Router();

// Create new book
router.post('/new', async (req, res) => {
    try {
        const {title, category, year, pageCount, author} = req.body;
        const book = new Book({
            title: title,
            category: category,
            year: Number(year),
            pageCount: Number(pageCount),
            author: author
        });
        await book.save();
        return res.json(format.formatBook(book));
    } catch {
        res.status(500);
        return res.json({error: 'Error creating book'});
    }
});

// Get all books
router.get('/', async (req, res) => {
    try {
        const books = await Book.find();
        return res.json(format.formatBooks(books));
    } catch {
        res.status(500);
        return res.json({error: 'Error getting books'});
    }
});

// Get book with id
router.get('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        return res.json(format.formatBook(book));
    } catch {
        res.status(500);
        return res.json({error: 'Error getting book'});
    }
});

// Search books with parameters
router.put('/search', async (req, res) => {
    try {
        const {title, category, year, filterYear, pageCount, filterPageCount, author} = req.body;
        let query = Book.find();
        if (title) {
            query = query.regex('title', new RegExp(title, 'i'));
        }
        if (category) {
            query = query.regex('category', new RegExp(category, 'i'));
        }
        if (year) {
            if(filterYear) {
                if (filterYear === 'before') {
                    query = query.lt('year', year);
                }
                if (filterYear === 'equal') {
                    query = query.lte('year', year);
                }
                if (filterYear === 'after') {
                    query = query.gt('year', year);
                }
            } else {
                    query = query.lte('year', year);
            }
        }
        if (pageCount && filterPageCount) {
            if (filterPageCount === 'before') {
                query = query.lt('pageCount', pageCount);
            }
            if (filterPageCount === 'equal') {
                query = query.lte('pageCount', pageCount);
            }
            if (filterPageCount === 'after') {
                query = query.gt('pageCount', pageCount);
            }
        }
        if (author) {
            query = query.regex('author', new RegExp(author, 'i'));
        }
        const books = await query.exec();
        return res.json(format.formatBooks(books));
    } catch {
        res.status(500);
        return res.json({error: 'Error gettings books'});
    }
});

// Update book
router.put('/:id', async (req, res) => {
    try {
        let book = await Book.findById(req.params.id);
        book.title = req.body.title;
        book.category = req.body.category;
        book.year = Number(req.body.year);
        book.pageCount = Number(req.body.pageCount);
        book.author = req.body.author;
        await book.save();
        return book.json(format.formatBook(book));
    } catch {
        res.status(500);
        return res.json({error: 'Error editing book'});
    }
});

// Delete book
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        await book.remove();
        return res.json({success: 'Book successfully deleted'});
    } catch {
        res.status(500);
        return res.json({error: 'Error deleting book'});
    }
});

// Export routes
module.exports = router;
