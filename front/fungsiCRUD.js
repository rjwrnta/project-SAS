console.log('fungsiCRUD.js terpanggil')
const formManga = document.getElementById('mangaForm');


function getQueryParam(param) {
    const urlParam = new URLSearchParams(window.location.search)
    const id = urlParam.get(param)
    if (!id) {
        console.log('ID tidak ditemukan di URL')
        // alert('ID tidak valid')
        return null
    }

    return id
}

document.addEventListener('DOMContentLoaded', () => {
    const formGroups = document.querySelectorAll('.form-group');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    let currentStep = 0;

    function updateForm() {
        formGroups.forEach((group, index) => {
            group.classList.toggle('active', index === currentStep);
        });
        prevButton.textContent = currentStep === 0 ? 'Back' : 'Back';
        nextButton.textContent = currentStep === formGroups.length - 1 ? 'Submit' : 'Next';
    }

    prevButton.addEventListener('click', () => {
        if (currentStep > 0){
            currentStep--;
            updateForm();
        } else {
            window.location.href = 'index.html'
        }
    });

    nextButton.addEventListener('click', async () => {
        if (currentStep < formGroups.length - 1) {
            currentStep++;
            updateForm();
        } else {
            const mangaId = getQueryParam('id')
            // ketika tersedia mangaID maka update
            if (mangaId) {
                console.log('EDITING')
                await updateManga(mangaId)
            } else {
                console.log('Add New')
                await addManga()
            }
        }
    });

    const addManga = async () => {
        console.log('fungsi addManga terpanggil')
        const Title = document.getElementById('title').value;
        const Chapter = document.getElementById('chapter').value;
        const Status = document.getElementById('status').value;
        const ReleaseDate = document.getElementById('Rilis').value;
        const Sinopsis = document.getElementById('synopsis').value;
        const MangaWriter = document.getElementById('writer').value;
        const ChapterPerEpisode = document.getElementById('chapter-Eps').value;
        const Duration = document.getElementById('duration').value;
        const selectGenre = [];
        document.querySelectorAll('input[name="genre"]:checked').forEach((checkbox) => {
            selectGenre.push(checkbox.value);
        });

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
                Genre: selectGenre,
            });

            if (response.data.status === 'success') {
                // alert('Manga berhasil Ditambahkan');
                formManga.reset();
                window.location.href = 'index.html'
            } else {
                alert('Manga Gagal Ditambahkan');
            }
        } catch (error) {
            console.error('error add manga:', error);
            alert('Terjadi Kesalahan Saat Menambahkan Manga')
        }
    }

})

const fetchManga = async () => {
    console.log('fungsi fetchManga terpanggil')
    try {
        const response = await axios.get('http://localhost:3000/manga');
        const mangaData = response.data.data.dataManga;

        const table = document.getElementById('tabel');
        table.innerHTML = '<tr><th scope="col">Id</th><th scope="col">Title</th><th scope="col">Chapter</th><th scope="col">Status</th><th scope="col">Release Date</th><th scope="col">Sinopsis</th><th scope="col">Manga Writer</th><th scope="col">Chapter Per Episode</th><th scope="col">Duration</th><th scope="col">Genre</th><th scope="col">Edit/Delete</th></tr>';

        mangaData.forEach((manga) => {
            table.innerHTML += `<tr>
                       <th scope="row">${manga.id}</th>
                       <td>${manga.Title}</td>
                       <td>${manga.Chapter}Ch</td>
                       <td>${manga.Status}</td>
                       <td>${manga.ReleaseDate}</td>
                       <td>${manga.Sinopsis}</td>
                       <td>${manga.MangaWriter}</td>
                       <td>${manga.ChapterPerEpisode} Chapter</td>
                       <td>${manga.Duration}</td>
                       <td>${Array.isArray(manga.Genre) ? manga.Genre.join(', ') : manga.Genre.split(', ').join(', ')}</td>
                       <td>
                         <button type="button" class="btn btn-outline-warning btn-edit" data-id="${manga.id}">Edit</button>
                         <button type="button" class="btn btn-outline-danger btn-delete" data-id="${manga.id}">Delete</button>
                       </td>
                     </tr>`;
        });

        addEventListener();

    } catch (error) {
        console.error('error fetch manga:', error);
    }
};

const addEventListener = () => {
    document.querySelectorAll('.btn-delete').forEach((button) => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const confirmDelete = confirm('Yakin Ingin Menghapus Manga Ini?')
            if (confirmDelete) {
                deleteManga(id)
            }
        })
    })

    document.querySelectorAll('.btn-edit').forEach((button) => {
        button.addEventListener('click', (e) => {
            const id = e.target.dataset.id
            console.log(id)
            window.location.href = `input.html?id=${id}`
        })
    })
}

const deleteManga = async (id) => {
    console.log('fungsi deleteManga terpanggil')
    try {
        const response = await axios.delete(`http://localhost:3000/manga/${id}`);
        if (response.data.status === 'success') {
            // alert('Manga Berhasil Dihapus');
            fetchManga();
        } else {
            alert('Manga Gagal Dihapus')
        }
    } catch (error) {
        console.error('error delete manga:', error);
        alert('Terjadi Kesalahan Saat Menghapus Manga');
    }
}


const changeManga = async (id) => {
    console.log('fungsi changeManga terpanggil')
    if (!id) {
        console.error('ID tidak ditemukan')
    } else {
        console.log('ID adalah: ', id)
    }
    try {
        const response = await axios.get(`http://localhost:3000/manga/${id}`);
        console.log('data diterima: ', response.data)
        const manga = response.data.data.manga;
        console.log('data manga: ', manga)

        document.getElementById('title').value = manga.Title;
        document.getElementById('chapter').value = manga.Chapter;
        document.getElementById('status').value = manga.Status;
        document.getElementById('Rilis').value = manga.ReleaseDate;
        document.getElementById('synopsis').value = manga.Sinopsis;
        document.getElementById('writer').value = manga.MangaWriter;
        document.getElementById('chapter-Eps').value = manga.ChapterPerEpisode;
        document.getElementById('duration').value = manga.Duration;
        const genreCheckbox = document.querySelectorAll('input[name="genre"]')
        genreCheckbox.forEach((checkbox) => {
            checkbox.checked = manga.Genre.includes(checkbox.value);
        })
    } catch (error) {
        console.error('error fetch manga by ID :', error)
        if (error.response && error.response.status === 404) {
            alert('manga dengan ID tersebut tidak ditemukan')
        }
        alert('Terjadi Kesalahan Saat Mengambil Data Manga')
    }
}

const updateManga = async (id) => {
    try {
        const updateManga = {
            Title: document.getElementById('title').value,
            Chapter: document.getElementById('chapter').value,
            Status: document.getElementById('status').value,
            ReleaseDate: document.getElementById('Rilis').value,
            Sinopsis: document.getElementById('synopsis').value,
            MangaWriter: document.getElementById('writer').value,
            ChapterPerEpisode: document.getElementById('chapter-Eps').value,
            Duration: document.getElementById('duration').value,
            Genre: Array.from(document.querySelectorAll('input[name="genre"]:checked')).map(el => el.value)
        };

        const updateResponse = await axios.put(`http://localhost:3000/manga/${id}`, updateManga)
        if (updateResponse.data.status === 'success') {
            console.log(updateManga)
            // alert('Manga Berhasil Diubah')
            formManga.reset()
            window.location.href = 'index.html'
        } else {
            alert('Manga Gagal Diubah')
        }
    } catch (error) {
        console.error('error change manga :', error)
        alert('Terjadi Kesalahan Saat Mengubah Manga')
    }
}