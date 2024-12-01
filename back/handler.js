const {nanoid} = require('nanoid')
const path = require('path');
const dataManga = require('./manga')

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
};

const createMangaHandler = (request, h) => {
    const {
        Title, Chapter, Status, Genre, Sinopsis, ReleaseDate, MangaWriter, ChapterPerEpisode, Duration
    } = request.payload;
    const id = nanoid(5);
    const createAt = new Date().toISOString;
    const updateAt = createAt;
    const genreArray = Array.isArray(Genre)
        ? Genre
        : Genre.split(',').map((g) => g.trim());
    const newManga = {
        id,
        Title,
        Chapter,
        Status,
        Genre: genreArray,
        Sinopsis,
        ReleaseDate,
        MangaWriter,
        ChapterPerEpisode,
        Duration,
        createAt,
        updateAt,
    };
    dataManga.push(newManga);

    const isSuccess = dataManga.filter((manga) => manga.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Manga berhasil ditambahkan',
            data: {
                mangaId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Manga gagal ditambahkan',
    });
    response.code(400);
    return response;
};

const showMangaHandler = () => ({
    status: 'success',
    data: {
      dataManga: dataManga.map((manga) => ({
        id: manga.id,
        Title: manga.Title,
        Chapter: manga.Chapter,
        Status: manga.Status,
        Genre: Array.isArray(manga.Genre) ? manga.Genre : [manga.Genre],
        Sinopsis: manga.Sinopsis,
        ReleaseDate: manga.ReleaseDate,
        MangaWriter: manga.MangaWriter,
        ChapterPerEpisode: manga.ChapterPerEpisode,
        Duration: manga.Duration,
      })),
    },
  });

const detailsMangaHandler = (request, h) => {
    const {id} = request.params;
    const manga = dataManga.filter((dataManga) => dataManga.id === id)[0];

    if (manga !== undefined){
        return {
            status: 'success',
            data: {
                manga,
            },
        };
    };
    
    const response = h.response({
        status: 'fail',
        message: 'Manga tidak ditemukan'
    });
    response.code(404);
    return response;
};

const changeMangaHandler = (request, h) => {
    const {id} = request.params;
    const {Title, Chapter, Status, Genre, Sinopsis, ReleaseDate, MangaWriter, ChapterPerEpisode, Duration} = request.payload;
    const updateAt = new Date().toISOString();
    const index = dataManga.findIndex((manga) => manga.id === id);

    if (index !== -1) {
        dataManga[index] = {
            ...dataManga[index],
            Title,
            Chapter,
            Status,
            Genre,
            Sinopsis,
            ReleaseDate,
            MangaWriter,
            ChapterPerEpisode,
            Duration,
            updateAt,
        };
        const response = h.response({
            status: 'success',
            message: 'Manga berhasil diubah',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Manga gagal diubah',
    });
    response.code(404);
    return response;
}

const deleteMangaHandler = (request, h) => {
    const {id} = request.params;
    const isFind = dataManga.findIndex((manga) => manga.id === id);

    if (isFind !== -1) {
        dataManga.splice(isFind, 1);
        const response = h.response({
            status: 'success',
            message: 'Manga berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Manga gagal dihapus',
    });
    response.code(404);
    return response;
}

module.exports = {fileStatis, 
    responseHandler, 
    createMangaHandler, 
    showMangaHandler, 
    detailsMangaHandler,
    changeMangaHandler,
    deleteMangaHandler,
};