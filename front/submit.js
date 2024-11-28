// import axios from 'axios';
// const dataManga = require('../back/manga')

const formTambahManga = document.getElementById('formTambahManga');

if (formTambahManga) {
    formTambahManga.addEventListener('submit', async (e) => {
        e.preventDefault();
        console.log('form submitted')

        const Title = document.getElementById('floatingTitle').value;
        const Chapter = document.getElementById('floatingChapter').value;
        const Status = document.getElementById('floatingSelect1').value;
        const ReleaseDate = document.getElementById('floatingReleaseDate').value;
        const Sinopsis = document.getElementById('floatingTextarea2').value;
        const MangaWriter = document.getElementById('floatingMangaWriter').value;
        const ChapterPerEpisode = document.getElementById('floatingChapter-eps').value;
        const Duration = document.getElementById('floatingDuration').value;
        const Genre = document.getElementById('floatingSelect2').value;
        
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
    tableBody.innerHTML = '';

    mangaData.forEach((manga) => {
        const row = document.createElement('tr');

        row.innerHTML = `<th scope="col">Id</th>
                      <th scope="col">Title</th>
                      <th scope="col">Chapter</th>
                      <th scope="col">Status</th>
                      <th scope="col">Genre</th>
                      <th scope="col">Durasi</th>
                      <th scope="col">Chapter per Episode</th>
                      <th scope="col">Sinopsis</th>
                      <th scope="col">Action</th>`

        row.innerHTML = `
                <td>${manga.Title}</td>
                <td>${manga.Chapter}</td>
                <td>${manga.Status}</td>
                <td>${manga.Genre}</td>
                <td>${manga.ReleaseDate}</td>
                <td>${manga.MangaWriter}</td>
                <td>
                    <button class="btn btn-outline-warning btn" onclick="editManga('${manga.id}')">Edit</button>
                    <button class="btn btn-outline-danger btn" onclick="deleteManga('${manga.id}')">Delete</button>
                </td>
            `;
            
            tableBody.appendChild(row);
    });
    } catch (error){
        console.error('error fetch manga :', error);
    }
};

// window.onload = fetchManga;