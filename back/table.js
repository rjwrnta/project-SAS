const tabel = () => {
    const tbl = document.getElementById('table');
    tbl.innerHTML = `<tr>
                  <th scope="col">Id</th>
                  <th scope="col">Title</th>
                  <th scope="col">Chapter</th>
                  <th scope="col">Status</th>
                  <th scope="col">Sinopsis</th>
                  <th scope="col">Durasi</th>
                  <th scope="col">Chapter per Eps</th>
                  <th scope="col">Genre</th>
                </tr>`
}