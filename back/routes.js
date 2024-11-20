const handler = require('./handler');

const routes = [
    // {
    //     method: 'GET',
    //     path: '/',
    //     handler: handler.fileStatis.directoryHandler
    // },

    {
        method: 'GET',
        path: '/api/welcome',
        handler: handler.responseHandler
    },

    {
        method: 'GET',
        path: '/{param*}',
        handler: handler.fileStatis.directoryHandler
    }
];

module.exports = routes;