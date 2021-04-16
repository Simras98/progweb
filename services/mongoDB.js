// Import models
const clientModel = require('../models/client'),
    userModel = require('../models/user');

// Create entries in MongoDB database
const loadExampleData = async function () {

    const client1 = new clientModel({
        id: 'application',
        clientId: 'application',
        clientSecret: 'secret',
        grants: [
            'password',
            'refresh_token'
        ],
        redirectUris: []
    });
    await client1.save(function (error, client) {
        if (error) {
            return console.error(error);
        }
        console.log('Created client', client);
    });

    const client2 = new clientModel({
        id: 'application',
        clientId: 'confidentialApplication',
        clientSecret: 'topSecret',
        grants: [
            'password',
            'client_credentials'
        ],
        redirectUris: []
    });
    await client2.save(function (error, client) {
        if (error) {
            return console.error(error);
        }
        console.log('Created client', client);
    });

    const user1 = new userModel({
        username: 'admin',
        password: 'password'
    });
    await user1.save(function (error, user) {
        if (error) {
            return console.error(error);
        }
        console.log('Created user', user);
    });
};

// Export functions
module.exports = {loadExampleData: loadExampleData};
