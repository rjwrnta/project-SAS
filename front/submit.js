// const formTambahManga = document.getElementById('formTambahManga');
// let changeMode = false;
// let changeId = null;

// if (formTambahManga) {
//     formTambahManga.addEventListener('submit', async (e) => {
//         e.preventDefault();
//         console.log('Form submitted, Mode:', changeMode ? 'Edit' : 'Add');
//         console.log('form submitted')

//         const Title = document.getElementById('floatingTitle').value;
//         const Chapter = document.getElementById('floatingChapter').value;
//         const Status = document.getElementById('floatingStatus').value;
//         const ReleaseDate = document.getElementById('floatingReleaseDate').value;
//         const Sinopsis = document.getElementById('floatingSinopsis').value;
//         const MangaWriter = document.getElementById('floatingMangaWriter').value;
//         const ChapterPerEpisode = document.getElementById('floatingChapter-eps').value;
//         const Duration = document.getElementById('floatingDuration').value;
//         const Genre = document.getElementById('floatingGenre').value;


//         // let response;
//         try {
//             if(changeMode){
//                 response = await axios.put(`http://localhost:3000/manga/${changeId}`,{
//                     Title,
//                     Chapter,
//                     Status,
//                     ReleaseDate,
//                     Sinopsis,
//                     MangaWriter,
//                     ChapterPerEpisode,
//                     Duration,
//                     Genre,
//                 });
//             } else {
//                 response = await axios.post('http://localhost:3000/manga/create', {
//                     Title,
//                     Chapter,
//                     Status,
//                     ReleaseDate,
//                     Sinopsis,
//                     MangaWriter,
//                     ChapterPerEpisode,
//                     Duration,
//                     Genre,
//                 });
//             }

//             console.log(response)

//             if(response.data.status === 'success'){
//                 alert(changeMode ? 'Manga Berhasil Diedit' : 'Manga Berhasil Ditambahkan');
//                  formTambahManga.reset();
//                  window.location.href = 'index.html'
//             } else{
//                 alert(changeMode ? 'Manga Gagal Diedit' : 'Manga Gagal Ditambahkan');
//             }
//         } catch (error) {
//             console.error(changeMode ? 'error changed manga :' : 'error add manga :', error);
//             alert(changeMode ? 'Terjadi Kesalahan Saat Mengedit Manga' : 'Terjadi Kesalahan Saat Menambahkan Manga');
//         } finally {
//             changeMode = false;
//             changeId = null;
//         }
//     });
// }

// const fetchManga = async () => {
//     try {
//     const response = await axios.get('http://localhost:3000/manga');
//     const mangaData = response.data.data.dataManga;

//     const tableBody = document.getElementById('tabel');
//     tableBody.innerHTML = '<tr><th scope="col">Id</th><th scope="col">Title</th><th scope="col">Chapter</th><th scope="col">Status</th><th scope="col">Release Date</th><th scope="col">Sinopsis</th><th scope="col">Manga Writer</th><th scope="col">Chapter Per Episode</th><th scope="col">Duration</th><th scope="col">Genre</th><th scope="col">Edit/Delete</th></tr>';

//     mangaData.forEach((manga) => {
//         tableBody.innerHTML += `<tr>
//                       <th scope="row">${manga.id}</th>
//                       <td>${manga.Title}</td>
//                       <td>${manga.Chapter}Ch</td>
//                       <td>${manga.Status}</td>
//                       <td>${manga.ReleaseDate}</td>
//                       <td>${manga.Sinopsis}</td>
//                       <td>${manga.MangaWriter}</td>
//                       <td>${manga.ChapterPerEpisode} Chapter</td>
//                       <td>${manga.Duration}</td>
//                       <td>${manga.Genre}</td>
//                       <td>
//                         <button type="button" class="btn btn-outline-warning btn-edit" data-id="${manga.id}">Edit</button>
//                         <button type="button" class="btn btn-outline-danger btn-delete" data-id="${manga.id}">Delete</button>
//                       </td>
//                     </tr>`;
//     });
    
//     } catch (error) {
//         console.error('error fetch manga :', error);
//     }
// };

// // const changeManga = async (id) => {
// //     const populateForm = (change) => {
// //         document.getElementById('floatingTitle').value = change.Title;
// //         document.getElementById('floatingChapter').value = change.Chapter;
// //         document.getElementById('floatingStatus').value = change.Status;
// //         document.getElementById('floatingReleaseDate').value = change.ReleaseDate;
// //         document.getElementById('floatingSinopsis').value = change.Sinopsis;
// //         document.getElementById('floatingMangaWriter').value = change.MangaWriter;
// //         document.getElementById('floatingChapter-eps').value = change.ChapterPerEpisode;
// //         document.getElementById('floatingDuration').value = change.Duration;
// //         document.getElementById('floatingGenre').value = change.Genre;
// //     }

// //     try {
// //         const response = await axios.get(`http://localhost:3000/manga/${id}`)
// //         const change = response.data.data;
// //         populateForm(change);

// //         changeMode = true;
// //         changeId = id;
// //     } catch (error) {
// //         console.error('error fetch manga for edit :', error);
// //         alert('Terjadi kesalahan saat mengambil data manga untuk diedit')
// //     }
// // }

// // const deleteManga = async (id) => {
// //     try {
// //         const response = await axios.delete(`http://localhost:3000/manga/${id}`)
// //         if (response.data.status === 'success') {
// //             alert('Manga Berhasil Dihapus')
// //             fetchManga();
// //         } else {
// //             alert('Manga Gagal Dihapus')
// //         }
// //     } catch (error) {
// //         console.error('error delete manga :', error)
// //         alert('Terjadi Kesalahan Saat Menghapus Manga')
// //     }
// // }

// // const addEventListener = () => {
// //     document.querySelectorAll('.btn-edit').forEach((button) => {
// //         button.addEventListener('click', (e) => {
// //             const id = e.target.dataset.id;
// //             console.log('Edit button clicked, ID:', id);
// //             changeManga(id);
// //         });
// //     });

// //     document.querySelectorAll('.btn-delete').forEach((button) => {
// //         button.addEventListener('click', (e) => {
// //             const id = e.target.dataset.id;
// //             console.log('Delete button clicked, ID:', id);
// //             deleteManga(id);
// //         })
// //     })
// // }