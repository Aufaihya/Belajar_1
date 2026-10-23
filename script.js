const tombolTambah = document.getElementById("tombolTambah");
const inputTugas = document.getElementById("inputTugas");
const daftar = document.getElementById("daftar");

let tugas = JSON.parse(localStorage.getItem("tugas")) || [];
let nomor = Math.max(0, ...tugas.map((t) => t.id));

tampilkan(tugas);

tombolTambah.addEventListener("click", tambahTugas);
inputTugas.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tambahTugas();
});

function tambahTugas() {
  const asli = inputTugas.value.trim();
  if (asli === "") return;

  const semuaNama = tugas.map((t) => t.nama);
  let namaBaru = asli;
  let index = 1;

  while (semuaNama.includes(namaBaru)) {
    namaBaru = `${asli} (${index})`;
    index++;
  }

  nomor++;
  tugas.push({ id: nomor, nama: namaBaru, selesai: false });

  simpanDanTampilkan();
  inputTugas.value = "";
  inputTugas.focus();
}

function tampilkan(data) {
  daftar.innerHTML = "";

  if (data.length === 0) {
    daftar.innerHTML =
      '<li class="list-group-item text-center text-muted py-4">Belum ada tugas.</li>';
    return;
  }

  data.forEach((item, i) => {
    const li = document.createElement("li");
    li.className =
      "list-group-item d-flex align-items-center gap-2 flex-wrap px-0";

    const teks = document.createElement("span");
    teks.className = "me-auto";
    if (item.selesai) teks.classList.add("text-decoration-line-through", "text-muted");
    teks.textContent = `${i + 1}. ${item.nama}`;
    li.appendChild(teks);

    // Tombol status selesai
    const tombolSelesai = document.createElement("button");
    tombolSelesai.className = item.selesai
      ? "btn btn-sm btn-success"
      : "btn btn-sm btn-outline-secondary";
    tombolSelesai.textContent = item.selesai ? "Sudah" : "Belum";
    tombolSelesai.addEventListener("click", () => {
      item.selesai = !item.selesai;
      simpanDanTampilkan();
    });
    li.appendChild(tombolSelesai);

    // Tombol ubah nama
    const tombolUbahNama = document.createElement("button");
    tombolUbahNama.className = "btn btn-sm btn-outline-primary";
    tombolUbahNama.textContent = "Ubah";
    tombolUbahNama.addEventListener("click", () => ubahNama(item));
    li.appendChild(tombolUbahNama);

    // Tombol hapus
    const tombolHapus = document.createElement("button");
    tombolHapus.className = "btn btn-sm btn-outline-danger";
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", () => {
      tugas = tugas.filter((t) => t.id !== item.id);
      simpanDanTampilkan();
    });
    li.appendChild(tombolHapus);

    daftar.appendChild(li);
  });
}

function ubahNama(item) {
  const hasil = prompt(`Ubah nama "${item.nama}" menjadi:`);

  if (hasil === null) return;

  const namaBaru = hasil.trim();
  if (namaBaru === "") {
    alert(`Nama tidak boleh kosong!\n"${item.nama}" tidak berubah.`);
    return;
  }

  const semuaNama = tugas.map((t) => t.nama);
  if (semuaNama.includes(namaBaru)) {
    alert(`Nama "${namaBaru}" sudah ada!\nPerubahan tidak tersimpan.`);
    return;
  }

  alert(`Nama berhasil diubah dari "${item.nama}" menjadi "${namaBaru}".`);
  item.nama = namaBaru;
  simpanDanTampilkan();
}

function simpanDanTampilkan() {
  localStorage.setItem("tugas", JSON.stringify(tugas));
  tampilkan(tugas);
}