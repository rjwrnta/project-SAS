console.log('fungsiCRUD.js terpanggil')
// variabel untuk mengambil element html berdasarkan ID
const formManga = document.getElementById('mangaForm');

// fungsi untuk mendapatkan ID
function getQueryParam(param) {
    const urlParam = new URLSearchParams(window.location.search) // mencari ID dengan WindowLocationSearch
    const id = urlParam.get(param) // mendapat ID dari UrlParam
    if (!id) {
        console.log('ID tidak ditemukan di URL') // memberikan log jika ID tidak ditemukan
        return null // mengembalikan null jika ID tidak ada
    }

    return id // mengembalikan nilai jika ID ditemukan
}

// menunggu seluruh konten DOM selesai dimuat
document.addEventListener('DOMContentLoaded', () => {
    // mengambil element form dan tombol navigasi
    const formGroups = document.querySelectorAll('.form-group');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    let currentStep = 0;
    // menyimpan langkah form aktif saat ini, 0 berarti langkah pertama

    // fungsi untuk memperbarui tampilan form berdasarkan langkah
    function updateForm() {
        formGroups.forEach((group, index) => {
            group.classList.toggle('active', index === currentStep);
            // mengaktifkan grup form yang sesuai dengan langkah saat ini
        });
        // mengubah teks tombol navigasi berdasarkan langkah
        prevButton.textContent = currentStep === 0 ? 'Back' : 'Back';
        nextButton.textContent = currentStep === formGroups.length - 1 ? 'Submit' : 'Next';
    }

    // event listener untuk tombol back
    prevButton.addEventListener('click', () => {
        if (currentStep > 0){
            currentStep--;
            // kembali ke langkah sebelumnya
            updateForm();
            // memperbarui tampilan form
        } else {
            window.location.href = 'index.html'
            // jika di langkah pertama, kembali ke halaman utama
        }
    });

    // event listener untuk tombol next atau submit
    nextButton.addEventListener('click', async () => {
        if (currentStep < formGroups.length - 1) {
            currentStep++; // pindah ke langkah berikutnya
            updateForm();
        } else {
            const mangaId = getQueryParam('id')
            // ketika tersedia mangaID maka update
            if (mangaId) {
                console.log('EDITING')
                await updateManga(mangaId)
                // memperbarui data manga berdasarkan ID yang diberikan
            } else {
                // ketika tidak tersedia mangaID maka tambah
                console.log('Add New')
                await addManga()
                // menambah manga baru
            }
        }
    });

    // fungsi untuk menambah manga baru
    const addManga = async () => {
        console.log('fungsi addManga terpanggil')
        // mengambil data dari input form berdasarkan ID element
        const Title = document.getElementById('title').value;
        const Chapter = document.getElementById('chapter').value;
        const Status = document.getElementById('status').value;
        const ReleaseDate = document.getElementById('Rilis').value;
        const Sinopsis = document.getElementById('synopsis').value;
        const MangaWriter = document.getElementById('writer').value;
        const ChapterPerEpisode = document.getElementById('chapter-Eps').value;
        const Duration = document.getElementById('duration').value;
        // mengumpulkan genre yang dipilih
        const selectGenre = [];
        document.querySelectorAll('input[name="genre"]:checked').forEach((checkbox) => {
            selectGenre.push(checkbox.value);
        });

        try {
            // menmgirim data manga baru ke server menggunakan axios
            const response = await axios.post('http://localhost:3000/manga/create', {
                Title,
                Chapter,
                Tarif: parseInt(Chapter) * 10000, // tarif dihitung berdasarkan jumlah chapter
                Status,
                ReleaseDate,
                Sinopsis,
                MangaWriter,
                ChapterPerEpisode,
                Duration,
                Genre: selectGenre,
            });

            if (response.data.status === 'success') {
                formManga.reset(); // mereset form jika sukses menambah data
                window.location.href = 'index.html' // kembali ke halaman utama
            } else {
                alert('Manga Gagal Ditambahkan');
            }
        } catch (error) {
            console.error('error add manga:', error); // log jika terjadi kesalahan
            alert('Terjadi Kesalahan Saat Menambahkan Manga')
        }
    }

})

// fungsi untuk menampikan manga
const fetchManga = async () => {
    console.log('fungsi fetchManga terpanggil')
    try {
        // mengirim request GET ke server untuk mengambil data manga
        const response = await axios.get('http://localhost:3000/manga');
        const mangaData = response.data.data.dataManga; // mengambil data manga dari response

        const table = document.getElementById('tabel'); // mengambil element tabel menggunakan ID element
        // meng inner/ mengambil dari tabel dari html
        table.innerHTML = '<tr><th scope="col">Id</th><th scope="col">Title</th><th scope="col">Chapter</th><th scope="col">Tarif</th><th scope="col">Status</th><th scope="col">Release Date</th><th scope="col">Sinopsis</th><th scope="col">Manga Writer</th><th scope="col">Chapter Per Episode</th><th scope="col">Duration</th><th scope="col">Genre</th><th scope="col">Edit/Delete</th></tr>';

        mangaData.forEach((manga) => {
            // untuk menambah data yang ditambahkan dari server
            table.innerHTML += `<tr>
                       <th scope="row">${manga.id}</th>
                       <td>${manga.Title}</td>
                       <td>${manga.Chapter}Ch</td>
                       <td>Rp${manga.Tarif}</td>
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

        // memanggil fungsi agar tombol edit dan delete berfungsi/aktif
        addEventListener();

    } catch (error) {
        console.error('error fetch manga:', error); // log jika terjadi kesalahan
    }
};

// fungsi agar tombol edit dan delete berfungsi/aktif
const addEventListener = () => {
    // mengambil semua yang ada di element
    document.querySelectorAll('.btn-delete').forEach((button) => {
        // menambah event, jika button di click, maka akan mencari id yang ada di button
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