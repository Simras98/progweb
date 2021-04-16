// Convert model to object and delete __v field
const formatGeneric = function (object) {
    if (object.length === 0) {
        return object;
    }
    object = object.toObject();
    delete object.__v;
    object.id = object._id;
    delete object._id;
    if (object.firstName === undefined) {
        object = formatFieldsBook(object);
    } else {
        object = formatFieldsAuthor(object);
    }
    return object;
};

const formatFieldsAuthor = function (object) {
    const firstName = object.firstName;
    delete object.firstName;
    object.firstName = firstName;
    const lastName = object.lastName;
    delete object.lastName;
    object.lastName = lastName;
    return object;
}

const formatFieldsBook = function (object) {
    const title = object.title;
    delete object.title;
    object.title = title;
    const category = object.category;
    delete object.category;
    object.category = category;
    const year = object.year;
    delete object.year;
    object.year = year;
    const pageCount = object.pageCount;
    delete object.pageCount;
    object.pageCount = pageCount;
    const author = object.author;
    delete object.author;
    object.author = author;
    return object;
}

// Convert book model to book object
const formatBook = function (book) {
    book = formatGeneric(book);
    return book;
};

// Convert author model to author object
const formatAuthor = function (author, books) {
    author = formatGeneric(author);
    if (books === undefined) {
        return author;
    }
    author.books = formatBooks(books);
    return author;
};

// Convert books model to authors object and adding specs fields
const formatBooks = function (books) {
    if (books.length === 0) {
        return books;
    }
    let formattedBooks = [];
    for (let book of books) {
        book = formatGeneric(book);
        formattedBooks.push(book);
    }
    return {
        size: formattedBooks.length,
        list: formattedBooks
    };
};

// Convert authors model to authors object and adding specs fields
const formatAuthors = function (authors) {
    if (authors.length === 0) {
        return authors;
    }
    return {
        size: authors.length,
        list: authors
    };
};

// Export functions
module.exports = {
    formatBook: formatBook,
    formatBooks: formatBooks,
    formatAuthor: formatAuthor,
    formatAuthors: formatAuthors
};
