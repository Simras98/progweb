// Import dependencies
const auth = require('./services/oauth2'),
    bodyParser = require('body-parser'),
    express = require('express'),
    fs = require('fs'),
    https = require('https'),
    mongoose = require('mongoose'),
    mongoDB = require('./services/mongoDB');

// Import routes
const
    authRouter = require('./routes/oauth2'),
    authorRouter = require('./routes/author'),
    bookRouter = require('./routes/book');

// Import dependencies
const app = express();

// Create https server
https.createServer({
    key: fs.readFileSync('./certificate/server.key'),
    cert: fs.readFileSync('./certificate/server.cert')
}, app).listen(3000)

// Settings to properly get requests and bodies from Postman
app.use(bodyParser.urlencoded({extended: false}));

// MongoDB database connexion
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.connect('mongodb://admin:Mong0DBpassword@cluster0-shard-00-00.enbpi.mongodb.net:27017,' +
    'cluster0-shard-00-01.enbpi.mongodb.net:27017,cluster0-shard-00-02.enbpi.mongodb.net:27017' +
    '/progWeb?ssl=true&replicaSet=atlas-axiaqy-shard-0&authSource=admin&retryWrites=true&w=majority',
    {useNewUrlParser: true}, function (error) {
        if (error) {
            console.log('Unable to connect to the MongoDB database', error);
        } else {
            console.log('Connected to the MongoDB database');
        }
    });

// Uncomment this line to initialize the database if not
// mongoDB.loadExampleData();

// Application general endpoints
app.post('/oauth/token', authRouter);
app.use('/authors', auth.authenticateRequest, authorRouter);
app.use('/books', auth.authenticateRequest, bookRouter);

// Export app
module.exports = app;
