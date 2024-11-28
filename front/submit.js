// import axios from 'axios';
// const dataManga = require('../back/manga')

const formTambahManga = document.getElementById('formTambahManga');

if (formTambahManga) {
    formTambahManga.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('form submitted')

        const Title = document.getElementById('floatingTitle').value;
        const Chapter = document.getElementById('floatingChapter').value;
        const Status = document.getElementById('floatingStatus').value;
        const ReleaseDate = document.getElementById('floatingReleaseDate').value;
        const Sinopsis = document.getElementById('floatingSinopsis').value;
        const MangaWriter = document.getElementById('floatingMangaWriter').value;
        const ChapterPerEpisode = document.getElementById('floatingChapter-eps').value;
        const Duration = document.getElementById('floatingDuration').value;
        const Genre = document.getElementById('floatingGenre').value;
        
        try {
            const response = await axios.post('http://localhost:3000/manga/create', {
                Title,
                Chapter,
                Status,
                ReleaseDate,
                Sinopsis,
                MangaWriter,
                ChapterPerEpisode,
                Duration,
                Genre,
            });
            console.log(response)

            if(response.data.status === 'success'){
                alert('Manga Berhasil Ditambahkan');
                 formTambahManga.reset();
                 window.location.href = 'Table.html'
            } else{
                alert('Manga Gagal Ditambahkan');
            }
        } catch (error) {
            console.error('error add manga :', error);
            alert('Terjadi Kesalahan Saat Menambahkan Manga');
        }
    });
}

const fetchManga = async () => {
    try {
    const response = await axios.get('http://localhost:3000/manga');
    const mangaData = response.data.data.dataManga;

    const tableBody = document.getElementById('table');
    tableBody.innerHTML = '<tr><th scope="col">Id</th><th scope="col">Title</th><th scope="col">Chapter</th><th scope="col">Status</th><th scope="col">Release Date</th><th scope="col">Sinopsis</th><th scope="col">Manga Writer</th><th scope="col">Chapter Per Episode</th><th scope="col">Duration</th><th scope="col">Genre</th><th scope="col">Edit/Delete</th></tr>';

    mangaData.forEach((manga) => {
        tableBody.innerHTML += `<tr>
                      <th scope="row">${manga.id}</th>
                      <td>${manga.Title}</td>
                      <td>${manga.Chapter}</td>
                      <td>${manga.Status}</td>
                      <td>${manga.ReleaseDate}</td>
                      <td>${manga.Sinopsis}</td>
                      <td>${manga.MangaWriter}</td>
                      <td>${manga.ChapterPerEpisode}</td>
                      <td>${manga.Duration}</td>
                      <td>${manga.Genre}</td>
                      <td><button type="submit" class="btn btn-outline-warning">Edit</button><button="submit" class="btn btn-outline-danger">Delete</button></td>
                    </tr>`;
    });
    } catch (error){
        console.error('error fetch manga :', error);
    }
};

const deleteManga = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:3000/manga/${id}`);

        if(response.data.status === 'success') {
            alert('Manga berhasil dihapus');
            window.location.reload();
        } else (
            alert('Manga gagal dihapus')
        )
    } catch (error){
        console.error('error Deleting manga:', error)
    }
};