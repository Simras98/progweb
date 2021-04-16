// Convert model to object and delete __v field
const format = function (object) {
    if(object.length === 0){
        return object;
    }
    object = object.toObject();
    delete object.__v;
    return object;
};

// Convert book model to book object
const formatBook = function (book) {
    book = format(book);
    return book;
};

// Convert author model to author object
const formatAuthor = function (author, books) {
    author = format(author);
    if(books === undefined) {
        return author;
    }
    author.books = formatBooks(books);
    return author;
};

// Convert books model to authors object and adding specs fields
const formatBooks = function (books) {
    if(books.length === 0) {
        return books;
    }
    let finalBooks = {};
    let formattedBooks = [];
    for (let book of books) {
        book = book.toObject();
        delete book.__v;
        formattedBooks.push(book);
    }
    finalBooks['size'] = formattedBooks.length;
    finalBooks['list'] = formattedBooks;
    return finalBooks;
};

// Convert authors model to authors object and adding specs fields
const formatAuthors = function (authors) {
    if(authors.length === 0){
        return authors;
    }
    let finalAuthors = {};
    finalAuthors['size'] = authors.length;
    finalAuthors['list'] = authors;
    return finalAuthors;
};

// Export functions
module.exports = {
    formatBook: formatBook,
    formatBooks:formatBooks,
    formatAuthor: formatAuthor,
    formatAuthors: formatAuthors
};
