const {nanoid} = require('nanoid') // Import nanoid untuk membuat ID unik
const path = require('path'); // import path untuk menangani jalur direktori
const dataManga = require('./manga')// Import dataManga, yaitu array tempat data manga disimpan

// Konfigurasi file statis untuk direktori tertentu
const fileStatis = {
    directoryHandler: {
        directory: {
            path: path.join(__dirname, '../front/'), // Menentukan path folder "front"
            index: ['index.html'] // File default yang akan diload jika hanya direktori yang diakses
        }
    }
};

// Handler untuk response default server
const responseHandler = (request, h) => {
    return h.response({message: 'Welcome to the hapi.js server'}).code(200) // Menampilkan pesan selamat datang
};

// Handler untuk membuat data manga baru
const createMangaHandler = (request, h) => {
    const {
        // Destrukturisasi data dari request payload
        Title, Chapter, Status, Genre, Sinopsis, ReleaseDate, MangaWriter, ChapterPerEpisode, Duration
    } = request.payload;
    // Membuat ID unik dan timestamp
    const id = nanoid(5);
    const createAt = new Date().toISOString;
    const updateAt = createAt;
    // Memproses genre menjadi array

    let tarif = parseInt(Chapter) * 10000;
    if (Chapter > 5000){
        tarif *= 0.8;
    } else if(Chapter > 1000){
        tarif *= 0.88;
    } else if(Chapter > 500){
        tarif *= 0.93;
    } else if(Chapter > 100){
        tarif *= 0.97;
    }

    const genreArray = Array.isArray(Genre)
        ? Genre
        : Genre.split(',').map((g) => g.trim());
    // Memproses genre menjadi array
    const newManga = {
        id,
        Title,
        Chapter,
        Tarif: Math.round(tarif), // membulatkan tarif ke bilangan bulat
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
    // Menambahkan data manga ke array
    dataManga.push(newManga);
    

    console.log('data request: ', request.payload)
    console.log('ID yang dibuat: ', id)
    console.log('isi data manga setelah tambah: ', dataManga)

    // Memastikan manga berhasil ditambahkan
    const isSuccess = dataManga.filter((manga) => manga.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Manga berhasil ditambahkan',
            data: {
                mangaId: id,
            },
        });
        response.code(201); // Status kode sukses pembuatan data
        return response;
    }

    // Jika gagal menambahkan data
    const response = h.response({
        status: 'fail',
        message: 'Manga gagal ditambahkan',
    });
    response.code(400);
    return response;
};

// Handler untuk menampilkan semua data manga
const showMangaHandler = () => ({
    status: 'success',
    data: {
      dataManga: dataManga.map((manga) => ({
        id: manga.id,
        Title: manga.Title,
        Chapter: manga.Chapter,
        Tarif: manga.Tarif,
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

  // Handler untuk menampilkan detail manga berdasarkan ID
const detailsMangaHandler = (request, h) => {
    const {id} = request.params; // Mengambil ID dari parameter URL
    console.log('mencari manga dengan ID: ', id)
    console.log('isi data manga: ', dataManga)
    const manga = dataManga.filter((manga) => manga.id === id)[0];

    if (manga !== undefined){
        const response = h.response({
            status: 'success',
            data: { manga }
        })
        response.code(200) // Status kode berhasil ditemukan
        return response
    };
    
    // Jika manga dengan ID tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Manga tidak ditemukan'
    });
    response.code(404); // Status kode tidak ditemukan
    return response;
};

// Handler untuk mengubah data manga berdasarkan ID
const changeMangaHandler = (request, h) => {
    const {id} = request.params; // Mengambil ID dari parameter URL
    const {Title, Chapter, Status, Genre, Sinopsis, ReleaseDate, MangaWriter, ChapterPerEpisode, Duration} = request.payload;
    const updateAt = new Date().toISOString(); // Timestamp update
    const index = dataManga.findIndex((dataManga) => dataManga.id === id); // Mencari index manga
    const genreArray = Array.isArray(Genre)
        ? Genre
        : Genre.split(',').map((g) => g.trim());

    if (index !== -1) {
        // Mengupdate data manga
        let tarif = parseInt(Chapter) * 10000;
        if (Chapter > 5000){
            tarif *= 0.8;
        } else if(Chapter > 1000){
            tarif *= 0.88;
        } else if(Chapter > 500){
            tarif *= 0.93;
        } else if(Chapter > 100){
            tarif *= 0.97;
        }

        dataManga[index] = {
            ...dataManga[index],
            Title,
            Chapter,
            Tarif: Math.round(tarif), // tarif dihitung ulang
            Status,
            Genre: genreArray,
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
        response.code(200); // Status kode berhasil diubah
        return response;
    }

    // Jika manga dengan ID tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Manga gagal diubah',
    });
    response.code(404); // Status kode tidak ditemukan
    return response;
}

// Handler untuk menghapus data manga berdasarkan ID
const deleteMangaHandler = (request, h) => {
    const {id} = request.params; // Mengambil ID dari parameter URL
    const isFind = dataManga.findIndex((manga) => manga.id === id); // Mencari index manga

    if (isFind !== -1) {
        dataManga.splice(isFind, 1); // Menghapus manga dari array
        const response = h.response({
            status: 'success',
            message: 'Manga berhasil dihapus',
        });
        response.code(200); // Status kode berhasil dihapus
        return response;
    }

    // Jika manga dengan ID tidak ditemukan
    const response = h.response({
        status: 'fail',
        message: 'Manga gagal dihapus',
    });
    response.code(404); // Status kode tidak ditemukan
    return response;
}

// Ekspor semua handler untuk digunakan di file lain
module.exports = {fileStatis, 
    responseHandler, 
    createMangaHandler, 
    showMangaHandler, 
    detailsMangaHandler,
    changeMangaHandler,
    deleteMangaHandler,
};