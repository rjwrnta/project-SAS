const handler = require('./handler');

const routes = [
    {
        method: 'GET',
        path: '/api/welcome',
        handler: handler.responseHandler,
    },

    {
        method: 'GET',
        path: '/{param*}',
        handler: handler.fileStatis.directoryHandler,
    },

    {
        method: 'POST',
        path: '/manga/create',
        handler: handler.createMangaHandler,
    },

    {
        method: 'GET',
        path: '/manga',
        handler: handler.showMangaHandler,
    },

    {
        method: 'GET',
        path: '/manga/{id}',
        handler: handler.detailsMangaHandler,
    },

    {
        method: 'PUT',
        path: '/manga/{id}',
        handler: handler.changeMangaHandler,
    },

    {
        method: 'DELETE',
        path: '/manga/{id}',
        handler: handler.deleteMangaHandler,
    },
];

module.exports = routes;