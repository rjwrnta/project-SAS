const path = require('path');

const fileStatis = {
    directoryHandler: {
        directory: {
            path: path.join(__dirname, '../front/'),
            index: ['index.html']
        }
    }
};

const responseHandler = (request, h) => {
    return h.response({message: 'Welcome to the hapi.js server'}).code(200)
}

module.exports = {fileStatis, responseHandler};