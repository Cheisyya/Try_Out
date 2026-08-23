# Smart Home Center — Ruang Belajar Digital

Learning management system (LMS) bimbingan belajar **Smart Home Center**:
materi, latihan, simulasi ujian berbasis komputer, dan pemantauan hasil belajar.
Modul ujiannya disiapkan untuk seleksi masuk SMA Taruna Nusantara.

> **Status: Tahap 9 — Siap deploy.**
> Anti-kecurangan sisi peramban, pengerasan keamanan, dan pelengkapan antarmuka
> sudah terpasang. Seluruh penyimpanan kini melalui satu lapisan
> ([`src/lib/penyimpanan`](src/lib/penyimpanan)) yang memakai **Postgres** bila
> `DATABASE_URL` terisi, dan folder berkas bila tidak — sehingga aplikasi dapat
> berjalan di hosting serverless tanpa kehilangan data. Berkas di
> [`src/data`](src/data) berubah peran menjadi **nilai bawaan** yang dipakai
> ketika penyimpanan masih kosong. Langkahnya ada di
> [Deploy ke Vercel](#deploy-ke-vercel).

## Bank Soal

Cakupan materi mengikuti dokumen **Seleksi Tahap I — Materi Ujian** SMA Taruna
Nusantara; kategori di luar daftar berikut ditolak validator.

| Mata uji | Target/paket | Cakupan materi |
| --- | --- | --- |
| Bahasa Indonesia | 20¹ | Membaca, Menyunting, Kosa Kata, Struktur Bahasa Indonesia |
| IPA | 30¹ | 16 kategori: Kimia Dasar Unsur & Terapan; Fisika Energetika, Kalor, Elektromagnet, Fluida, Gaya, Gelombang, Optik, Rangkaian Listrik; Biologi Ciri Kehidupan, Ekologi, Genetika, Fisiologi Hewan, Botani; Bioteknologi Mutakhir |
| Bahasa Inggris | 20¹ | Reading, Grammar, Vocabulary |
| Matematika | 30¹ | Aljabar, Geometri, Kombinatorika, Teori Bilangan |

¹ Angka bawaan; target sesungguhnya diatur admin per paket pada menu Sesi.

Setiap butir soal wajib berbentuk pilihan ganda **A–D** dengan bidang:
`id`, `package_id`, `subject`, `session`, `category`, `question`, `options`,
`correct_answer`, `difficulty` (Easy/Medium/Hard), `explanation`, `image`
(opsional), `table` (opsional), `question_order`, dan `active`.

Bank soal disimpan terpisah per paket pada `src/data/bank-soal/paket-1.json`
sampai `paket-7.json`, berisi **700 butir** — 100 per paket, dan pada setiap
paket **seluruh 27 pasangan mata uji–kategori terisi**. Tingkat kesulitannya
naik bertahap:

| Paket | Tingkat | Ciri soal |
| --- | --- | --- |
| 1–2 | Easy | pengenalan konsep, satu langkah penyelesaian |
| 3–7 | Medium & Hard (HOTS) | menganalisis, menafsirkan data, menerapkan konsep pada situasi baru, dan menarik simpulan; sebagian besar menuntut lebih dari satu langkah |

Paket 3–7 seluruhnya berisi soal baru yang tidak mengulang pertanyaan, bacaan,
angka, maupun ilustrasi paket sebelumnya, dan komposisi Medium : Hard-nya
mendekati seimbang pada tiap paket. Di dalamnya terdapat 12–15 soal IPA dan
Matematika berbahasa Inggris, 4–5 gambar atau diagram yang benar-benar
diperlukan untuk menjawab, 4–9 tabel data, serta beberapa bacaan panjang untuk
Bahasa Indonesia dan Bahasa Inggris.

Sebaran kunci jawaban dijaga di rentang 15–35% untuk tiap huruf A–D pada setiap
paket, dan tidak pernah ada empat soal berurutan dengan kunci yang sama dalam
satu mata uji, sehingga jawaban tidak dapat ditebak dari pola hurufnya.

Pengambilan soal untuk ujian: hanya soal `active`, diurutkan berdasarkan
`question_order`, dipotong sebanyak target mata uji. Selama bank belum penuh,
sesi tetap berjalan memakai soal yang tersedia dan jumlah sebenarnya
diberitahukan kepada peserta. Kunci jawaban dan pembahasan tidak pernah dikirim
ke browser; penilaian dilakukan di server.

### CRUD soal

Panel admin `/admin/bank-soal` menampilkan cakupan pengisian tiap paket. Angka
pada tabel itu adalah tautan: mengkliknya membuka
`/admin/bank-soal/daftar?paket=…&subject=…`, halaman yang menampilkan butir soal
**persis seperti ruang ujian peserta** — satu soal per layar, pilihan A–D,
navigasi nomor di samping — hanya saja kunci jawaban dan pembahasan ikut tampil
dan tiap soal membawa aksi sunting, aktif/nonaktif, serta hapus. Penyimpanan
menulis kembali ke berkas JSON, sehingga penyuntingan hanya berjalan pada
lingkungan dengan sistem berkas yang dapat ditulis (pengembangan lokal). Pada
hosting read-only, pembacaan tetap normal dan operasi tulis mengembalikan pesan
kegagalan yang jelas — batasan ini hilang setelah database dipasang.

Gambar soal diletakkan di `public/soal/` dan dirujuk lewat `image.src`
(contoh: `/soal/p3-ipa-rangkaian.svg`). Seluruh gambar berupa SVG buatan sendiri
yang membawa `aria-label` berisi uraian isinya, sehingga soal tetap terbaca
pembaca layar. Gambar yang diunggah admin lewat panel bank soal disimpan di
lapisan penyimpanan dan disajikan lewat `/gambar-soal/<nama>`.

## Struktur Try Out

Bawaan awal: **7 paket**, masing-masing **2 sesi** berisi 100 soal pilihan
ganda. Paket 1–2 berdurasi 160 menit, sedangkan paket 3–7 berdurasi 180 menit
karena soalnya menuntut penalaran bertahap. Seluruh angka berikut dapat diubah
admin pada menu **Sesi**:

| Sesi | Mata Uji | Jumlah Soal | Waktu paket 1–2 | Waktu paket 3–7 |
| --- | --- | --- | --- | --- |
| Sesi 1 | Bahasa Indonesia | 20 | 25 menit | 30 menit |
| Sesi 1 | IPA | 30 | 55 menit | 60 menit |
| Sesi 2 | Bahasa Inggris | 20 | 25 menit | 30 menit |
| Sesi 2 | Matematika | 30 | 55 menit | 60 menit |

Status tiap sesi: **Belum Dimulai**, **Sedang Berlangsung**, atau **Selesai**.
Sesi dengan urutan lebih besar baru terbuka setelah sesi sebelumnya pada paket
yang sama berstatus Selesai.

## Pembahasan Soal

Setiap butir soal punya kolom `explanation`, dan sejak versi ini ia **wajib
diisi** — bukan lagi catatan internal admin. Alasannya: peserta membacanya.

| Tempat | Perlakuan |
| --- | --- |
| Form Bank Soal | Wajib, dengan keterangan bahwa isinya dibaca siswa |
| Template Excel | Kolom `explanation` ditandai **Wajib** pada lembar Petunjuk |
| Impor Excel | Baris tanpa pembahasan ditolak validator |
| Impor PDF | Baris `Pembahasan:` wajib; tanpa itu barisnya ditolak, bukan diisi teks pengganti |
| Daftar Bank Soal | Soal lama yang pembahasannya kosong ditandai merah |

Siswa membukanya dari **Riwayat Hasil → Pembahasan Soal → per paket**. Halaman
itu menampilkan, untuk setiap soal: pertanyaannya, seluruh opsi dengan penanda
kunci dan penanda jawaban peserta, status benar/salah/tidak dijawab, serta
pembahasannya.

**Batas yang dijaga ketat** ([`src/lib/pengerjaan/pembahasan.ts`](src/lib/pengerjaan/pembahasan.ts)):
kunci dan pembahasan hanya dilepas untuk mata uji yang **sudah dikumpulkan
peserta itu sendiri**. Mata uji yang masih berjalan tidak pernah ikut, jadi
membuka halaman pembahasan di tengah ujian tidak membocorkan apa pun — termasuk
lewat mata uji berikutnya pada sesi yang sama. Identitas peserta diambil dari
sesi login, bukan dari URL, sehingga pembahasan milik orang lain tidak dapat
dibuka.

## Dashboard Siswa

Dashboard merangkum **seluruh** isi portal, bukan hanya try out:

| Bagian | Isi |
| --- | --- |
| Paket yang Sedang Dikerjakan | Paket berjalan beserta status kedua sesinya |
| Perkembangan Nilai | Grafik garis rata-rata nilai dari paket ke paket |
| Pembahasan (lewat Riwayat Hasil) | Kunci dan penjelasan tiap soal yang sudah dikumpulkan |
| Hasil Terakhir | Nilai mata uji yang paling baru dikumpulkan |
| Kelengkapan Data Diri | Progres pengisian + pintasan ke tiap bagian yang belum selesai |

Kartu rekap angka sengaja tidak dipakai: isinya hanya mengulang apa yang sudah
terbaca pada menunya masing-masing. Bagian yang seksinya sedang dimatikan admin
tidak ikut dirender maupun diambil datanya.

### Grafik perkembangan

Digambar sebagai SVG inline ([`grafik-garis.tsx`](src/components/siswa/grafik-garis.tsx)),
tanpa pustaka grafik: satu-satunya bentuk yang dibutuhkan portal ini adalah garis
0–100, dan pustaka grafik akan menambah ratusan kilobyte untuk itu.

Sumbu X mengikuti paket yang sudah dikerjakan. Paket yang dilewati menjadi
**jeda** pada garis, bukan ditarik lurus melewatinya — menyambungkannya akan
mengarang nilai yang tidak pernah ada. Setiap grafik menyediakan tombol **Lihat
tabel** sebagai padanan teksnya.

Empat warna serinya diambil dari palet kategorikal yang sudah lolos pemeriksaan
buta warna pada permukaan putih; dua di antaranya berkontras di bawah 3:1,
sehingga label langsung di ujung garis dan tabel bukan hiasan melainkan
kelengkapan aksesibilitasnya.

## Testing Manual

Checklist urut untuk memeriksa seluruh alur admin dan siswa sebelum dipakai
sungguhan ada di [`TESTING.md`](TESTING.md).

## Alur Sesi Ujian

1. Siswa memilih paket pada `/siswa/tryout`.
2. Siswa memilih sesi pada halaman detail paket.
3. Sistem menampilkan halaman instruksi (susunan mata uji + tata tertib).
4. Siswa mencentang pernyataan dan memasukkan **password sesi**.
5. Password salah → sesi tidak dapat dimulai (diverifikasi di server).
6. Password benar → waktu mulai dicatat dan siswa masuk ruang ujian.

Password bawaan mengikuti pola `TN26-P<nomor paket>-S<nomor sesi>`, misalnya
`TN26-P3-S1`. Password ini hanya ditampilkan pada halaman instruksi ketika
aplikasi berjalan di pengembangan lokal dan belum pernah diganti; di produksi
tidak ada password sesi yang ikut terkirim ke HTML peserta. Begitu admin
menggantinya lewat tab **Sesi & Password**, hanya password baru yang berlaku.

### Timer

Batas waktu dihitung berantai dari waktu mulai sesi, bukan dari penghitung di
browser, sehingga tetap benar meskipun halaman ditutup atau dimuat ulang:

```
Sesi 1: Bahasa Indonesia 25 menit -> IPA 55 menit
Sesi 2: Bahasa Inggris   25 menit -> Matematika 55 menit
```

Ketika timer mencapai 00:00, sistem otomatis mengumpulkan jawaban mata uji
tersebut, mengunci pengerjaan (penyimpanan jawaban ditolak server), lalu
melanjutkan ke mata uji berikutnya. Setelah mata uji terakhir berakhir, sesi
dinilai dan statusnya menjadi **Selesai**. Jawaban yang telanjur dipilih tetap
tersimpan karena dikirim ke server setiap kali siswa memilih opsi.

Bila browser ditutup sampai waktu sesi habis, sesi dibukukan otomatis begitu
siswa kembali ke area siswa.

### Ruang Ujian (`/ujian/[paketId]/[sesiId]`)

Timer selalu terlihat, nama paket, nama mata uji, nomor soal, total soal,
progres pengerjaan, navigasi nomor soal dengan indikator sudah/belum dijawab,
tombol sebelumnya/berikutnya, pilihan ganda A–D, serta tombol kumpulkan dengan
konfirmasi. Halaman ini memakai layout tersendiri tanpa sidebar agar fokus.

Kunci jawaban tidak pernah dikirim ke browser; penilaian dilakukan di server.

## Panel Admin

Menu pada `/admin`, seluruhnya membaca dan menulis ke lapisan penyimpanan yang
sama dengan portal peserta:

| Menu | Isi |
| --- | --- |
| Dashboard | Keadaan seluruh sistem: sorotan peserta/kelengkapan berkas/kesiapan paket/rata-rata nilai, daftar **Perlu Tindakan**, tabel kesiapan & jadwal tiap paket, grafik rata-rata per mata pelajaran, sebaran nilai, matriks perkembangan tiap peserta, dan catatan pengawasan ujian |
| Siswa → Daftar Siswa | Peserta yang masih **Sedang Proses**: CRUD, status akun, link drive, status kelulusan |
| Siswa → Alumni | Peserta yang sudah **Lulus / Tidak Lulus** |
| Materi | Unggah bahan ajar PDF per mata pelajaran, tampil/sembunyi, sunting, hapus |
| Try Out → Paket & Sesi | Satu halaman: jadwal paket, tambah/sunting/hapus paket, aktif/nonaktif, dan sesi beserta passwordnya |
| Try Out → Import Soal | Impor massal dari Excel/PDF dengan pratinjau dan konfirmasi |
| Try Out → Hasil Try Out | Satu kartu per paket; rinciannya per peserta dengan tab per mata pelajaran, urutan nilai, dan pencarian nama |
| Bank Soal | Filter paket/mata pelajaran/tingkat/status, pencarian, CRUD, unggah gambar |
| Pengaturan | Sakelar seksi portal siswa (Data Diri Siswa, Materi Belajar) dan daftar isian siap salin untuk peserta |

Seluruh tabel admin memakai filter berbasis URL, pencarian, dan paginasi,
sehingga tautan hasil penyaringan dapat dibagikan.

### Jadwal buka & tutup paket

Setiap paket punya jendela pengerjaan yang diatur pada menu **Paket Try Out**:

| Isian | Sifat | Akibat |
| --- | --- | --- |
| **Dibuka Pada** | wajib | Sebelum waktu ini peserta tidak dapat memulai sesi |
| **Ditutup Pada** | opsional | Setelah waktu ini paket tidak dapat dikerjakan lagi. Dikosongkan = tanpa batas akhir |

Status yang muncul: **Belum Dibuka**, **Dibuka**, **Ditutup**, atau **Nonaktif**.
Kedua tanggal dapat diubah kapan saja — memperpanjang atau membuka ulang paket
cukup dengan mengganti tanggal tutupnya.

Penjagaannya ada di server ([`mulaiPercobaan`](src/lib/pengerjaan/layanan.ts)),
bukan sekadar menyembunyikan tombol, sehingga tautan langsung ke ruang ujian pun
tetap ditolak.

**Sesi yang sedang berjalan saat paket ditutup** ikut dibukukan otomatis pada
detik penutupan: waktu tutup menjadi batas tambahan di
[`hitungJadwal`](src/lib/pengerjaan/tipe.ts), sehingga jalurnya sama persis
dengan habisnya waktu mata uji — jawaban yang telanjur tersimpan tetap dinilai,
dan peserta tidak dapat melanjutkan. Perilaku ini sudah diuji langsung.

### Konfigurasi yang dapat diubah admin

Struktur paket dan sesi tidak lagi ditulis di dalam kode. Konfigurasi tersimpan
pada [`src/data/konfigurasi/paket.json`](src/data/konfigurasi) dan dibaca
seluruh bagian aplikasi: mengubah jumlah soal atau durasi pada menu Sesi
langsung mengubah target pengambilan soal, lama timer, dan tampilan instruksi
peserta. Menonaktifkan paket menyembunyikannya dari portal peserta tanpa
menghapus datanya.

### Data peserta

Menu **Siswa** menyediakan CRUD penuh: tambah, sunting, aktif/nonaktif, dan
hapus permanen. Data tersimpan pada `src/data/konfigurasi/siswa.json`.

Setiap peserta punya **dua** nomor yang perannya berbeda. `id` dibuat sistem,
tidak pernah berubah, dan tidak pernah ditampilkan — ia hanya kunci penyimpanan.
Yang tampil di layar adalah **nomor casis** yang ditetapkan panitia saat menambah
peserta: opsional, boleh diperbaiki, wajib unik bila diisi, dan juga sah dipakai
peserta untuk masuk.

Kolom tabelnya sengaja pendek — siswa, ringkasan pengerjaan, link drive, status
kelulusan, dan aksi. Aksinya berupa empat tombol ikon berlebar tetap (detail,
sunting, aktif/nonaktif, hapus) sehingga kolom Aksi tidak pernah ikut melebar
mengikuti panjang teks dan tidak terpotong pada layar sempit. Rincian lengkap
tiap peserta — asal SMP, kelengkapan berkas, nilai akademik — dibuka pada
halaman detail `/admin/siswa/<id>`.

Peserta masuk memakai **username**, bukan NIS. Setiap peserta punya dua
identitas yang berbeda perannya:

| Kolom | Sifat | Kegunaan |
| --- | --- | --- |
| `id` | Dibuat sistem, tidak pernah berubah | Kunci penyimpanan pengerjaan dan isi cookie sesi |
| `username` | Ditetapkan admin, dapat diganti | Identitas yang diketik peserta saat masuk |

Pemisahan ini membuat penggantian username **tidak memutus riwayat pengerjaan**
peserta. Username wajib unik, 4–32 karakter, hanya huruf kecil, angka, titik,
garis bawah, dan strip. Peserta lama yang terbiasa memakai NIS tetap dapat masuk
karena `id` juga diterima saat login.

Saat menyunting, mengosongkan kolom password berarti password lama tetap
berlaku. Menghapus peserta ikut menghapus berkas pengerjaannya; bila hanya ingin
menutup akses, pakai **Nonaktifkan**. Peserta berstatus nonaktif ditolak saat
masuk dan langsung kehilangan sesi yang sedang berjalan.

### Status kelulusan & Alumni

Status kelulusan seorang peserta hanya punya tiga nilai: **Sedang Proses**,
**Lulus**, dan **Tidak Lulus**. Statusnya menentukan di halaman mana peserta itu
muncul:

| Status | Halaman |
| --- | --- |
| Sedang Proses | `/admin/siswa` |
| Lulus / Tidak Lulus | `/admin/alumni` |

Begitu admin memilih Lulus atau Tidak Lulus dari daftar Siswa, peserta itu
langsung diantar ke halaman Alumni — bukan sekadar lenyap dari layar tanpa
penjelasan. Sebaliknya berlaku sama: mengembalikan status ke Sedang Proses dari
halaman Alumni akan mengantar kembali ke daftar Siswa. Salah tandai karenanya
selalu dapat dibatalkan.

Data lama yang masih menyimpan nama status "Belum Diproses" dibaca sebagai
"Sedang Proses" oleh [`keStatusKelulusan`](src/lib/siswa/status.ts), jadi tidak
ada langkah migrasi yang perlu dijalankan.

### Paket, sesi, dan passwordnya

Ketiganya satu halaman. Sesi selalu milik sebuah paket, jadi memisahkannya ke tab
lain membuat satu pekerjaan — menyiapkan sebuah paket — tersebar di dua tempat.

Tabelnya **satu baris per paket**, memuat jadwal, ringkasan tiap sesi beserta
status passwordnya, dan kesiapan bank soalnya. Ikon **gerigi** membuka satu
jendela berisi tab Sesi 1 dan Sesi 2, masing-masing dengan mata uji, jumlah soal,
durasi, urutan, dan password pembukanya.

Paket juga dapat **dihapus**. Yang hilang hanya konfigurasinya: riwayat
pengerjaan peserta dan soal di bank soal sengaja dibiarkan utuh, sehingga nilai
yang sudah masuk tetap terbaca pada Hasil Try Out. Tiap sesi tetap disimpan lewat aksinya sendiri supaya
validasi silang antar sesi tetap berlaku. Mengosongkan kedua isian password
berarti password lama tetap berlaku.

Password disimpan sebagai turunan scrypt beserta salt acak per sesi
([`src/lib/konfigurasi/sandi.ts`](src/lib/konfigurasi/sandi.ts)) — tidak pernah
dalam bentuk teks biasa, sehingga password lama tidak dapat ditampilkan
kembali. Admin hanya dapat menetapkan password baru, dan verifikasi peserta
memakai perbandingan waktu tetap.

### Materi belajar

Menu **Materi** menampung bahan ajar per mata pelajaran, **terpisah dari try
out**: materi adalah bahan baca, bukan soal. Daftar mata pelajarannya karenanya
berdiri sendiri di [`src/lib/materi/tipe.ts`](src/lib/materi/tipe.ts) — IPA,
Bahasa Indonesia, Bahasa Inggris, dan Matematika. Daftarnya kebetulan sama
dengan mata uji try out, tetapi sengaja tidak mengimpor `SUBJECTS`: mengubah
mata uji seleksi tidak boleh diam-diam mengubah pengelompokan materi.

Berkas yang diterima hanya **PDF** (maksimal 4 MB), diperiksa lewat magic bytes
`%PDF-`, bukan sekadar nama berkasnya. Alasan memilih PDF: ia dapat dibaca
langsung di dalam halaman tanpa peserta perlu mengunduhnya.

**Siswa dapat melihat, tidak disediakan mengunduh.** Yang menopang itu:

- berkas disimpan di luar `public/`, jadi tidak ada alamat statis yang dapat
  disalin atau dibagikan;
- satu-satunya pintu adalah `/siswa/materi/<id>/lihat`, yang memeriksa sesi
  siswa **dan** sakelar fitur lebih dahulu;
- responsnya `Content-Disposition: inline` dengan `Cache-Control: no-store`;
- pembacanya menyematkan PDF dengan `#toolbar=0`, sehingga bilah alat bawaan
  peramban beserta tombol unduh dan cetaknya tidak muncul;
- menu klik-kanan pada area pembaca dimatikan.

Sejujurnya: ini menutup jalur simpan yang biasa, bukan menjadikan berkas mustahil
diambil — apa pun yang dapat dibaca peramban pada dasarnya dapat disalin.
Keterangan itu ikut ditampilkan pada panel admin agar tidak ada salah harap.

### Menyembunyikan seksi dari portal siswa

Menu **Pengaturan** berisi sakelar per seksi portal siswa:

| Sakelar | Bila dimatikan |
| --- | --- |
| Data Diri Siswa | Menu beserta seluruh sub-halamannya hilang; halaman, Server Action pengisiannya, dan pratinjau berkasnya ditutup di server |
| Materi Belajar | Menu Materi hilang; halaman daftar, halaman baca, dan route berkasnya ditutup |

Penjagaannya tidak berhenti di menu. [`wajibFitur`](src/lib/get-session.ts)
memeriksa sakelarnya di server pada setiap halaman terkait, sehingga mengetik
alamatnya langsung pun tidak membukanya. Data yang sudah masuk **tidak dihapus**
— ia tetap tersimpan dan tetap terbaca dari panel admin.

### Daftar isian untuk peserta yang tidak mengisi sendiri

Tidak semua peserta terbiasa mengisi formulir dan mengunggah berkas. Menu
**Pengaturan → Daftar Isian Data Diri** menyediakan tombol salin untuk tiap
bagian — Biodata, Orang Tua/Wali, Akademik, Kelengkapan Dokumen, Prestasi —
serta satu tombol **Salin Seluruh Daftar**. Panitia tinggal menempelkannya di
chat peserta.

Isinya sengaja hanya **nama isian dan nama berkas**, tanpa ketentuan format
maupun batas ukuran: ketentuan itu sudah tertulis lengkap pada halaman
pengisian, dan mengulangnya membuat pesan terlalu panjang untuk dibaca.

Sumber kebenarannya satu berkas,
[`src/lib/pendaftaran/daftar-isian.ts`](src/lib/pendaftaran/daftar-isian.ts),
yang mengambil isinya dari tempat yang sama dengan formulir: spesifikasi
dokumen, daftar mata pelajaran, dan batas jumlah prestasi. Kunci tiap butir
biodata dan orang tua diketik sebagai `keyof Biodata` / `keyof DataOrtu`,
sehingga field yang diganti nama atau dihapus membuat berkas ini **gagal
dikompilasi** — daftarnya tidak dapat diam-diam menjadi usang.

Salinan siap kirim juga tersimpan sebagai berkas **`Daftar Isian Data Diri.txt`**
di akar project. Berkas itu dihasilkan dari modul yang sama, bukan diketik
ulang; perbarui dengan:

```bash
npm run daftar-isian
```

### Import massal bank soal

Menu **Import Soal** menerima dua sumber. Alur keduanya sama: unggah → parsing →
validasi → **pratinjau** → konfirmasi → simpan. Tidak ada baris yang masuk bank
soal sebelum admin menekan konfirmasi, dan seluruh baris divalidasi ulang di
server pada saat konfirmasi sehingga pratinjau yang diubah dari sisi klien tidak
dapat menyelipkan data cacat. Batas satu kali impor: 300 baris atau 8 MB.

**Excel (.xlsx)** — **paket tujuan dipilih pada form**, sama seperti impor PDF;
berkasnya sendiri tidak memuat kolom `package`, sehingga satu berkas dapat
dipakai untuk paket mana pun — termasuk paket yang dibuat setelah templatenya
diunduh. Unduh template lewat tombol *Unduh Template*
(`/admin/import/template`). Kolom: `subject`, `category`, `question`,
`option_a` … `option_d`, `correct_answer`, `difficulty`, `explanation`. Kolom
`difficulty` menerima huruf kecil maupun padanan Indonesia
(mudah/sedang/sulit).

Kolom yang **wajib** diisi hanya: `subject`, `question`, `option_a`
sampai `option_d`, dan `correct_answer`. Kolom `category` dan `difficulty` boleh
dikosongkan — kategori memakai kategori pertama mata uji tersebut, dan tingkat
kesulitan dianggap Medium.

Kolom `package`, `session`, dan `image` sengaja tidak dicetak: paket dipilih
pada form, sesi mengikuti penempatan mata uji pada paket tujuan, dan gambar soal
dipasang lewat menu Bank Soal. Ketiganya tetap dikenali bila muncul pada berkas
lama — isi `package` diabaikan dan seluruh baris mengikuti paket yang dipilih
pada form.

Template berisi dropdown untuk `subject`, `correct_answer`, dan `difficulty`,
serta lembar **Petunjuk** berisi cara pakai dan daftar kategori.

Validasi per baris mencakup: paket dikenal, mata pelajaran dikenal, sesi cocok
dengan penempatan mata uji, kategori berada dalam cakupan materi bila diisi,
keempat opsi A–D terisi dan tidak kembar, `correct_answer` salah satu A–D dan
menunjuk opsi yang berisi, `difficulty` sah bila diisi, path gambar sah, serta
deteksi pertanyaan kembar antar baris. Setiap kesalahan ditampilkan pada baris
yang bersangkutan; baris bermasalah dilewati, baris sisanya tetap dapat diimpor.

**PDF (.pdf)** — admin memilih paket, mata pelajaran, kategori, dan tingkat
bawaan, lalu mengunggah PDF berbasis teks. Pola yang dikenali:

```
1. Teks pertanyaan
A. pilihan A
...
E. pilihan E
Kunci: C
Tingkat: Medium        (opsional)
Kategori: Aljabar      (opsional)
Pembahasan: ...        (opsional)
```

Bila tidak ada blok yang memenuhi pola, atau PDF ternyata hasil pindaian tanpa
lapisan teks, sistem menampilkan pesan yang menjelaskan penyebabnya dan tidak
meneruskan data apa pun. Soal yang terbaca tetapi tanpa kunci jawaban ditandai
bermasalah pada pratinjau sehingga tidak ikut tersimpan.

Selama berkas diproses, tombol berubah menjadi indikator "Memproses berkas..."
beserta bilah progres.

### Unggah gambar soal

Form soal menerima berkas SVG/PNG/JPG/WebP maksimal 2 MB. Berkas disimpan ke
`public/soal/` dengan nama yang sudah dibersihkan, lalu path-nya terisi
otomatis pada isian gambar.

## Submission, Scoring, dan Penyimpanan Jawaban

Seluruh pengerjaan disimpan **di server**. Browser tidak memegang jawaban,
kunci, maupun nilai: identitas peserta diambil dari sesi login, dan percobaan
yang sedang berjalan dicari berdasarkan identitas tersebut.

### Penyimpanan jawaban

Setiap kali peserta memilih opsi, jawaban langsung dikirim ke server dan
disimpan sebagai satu baris yang terikat pada **student → package → session →
subject → question**:

```json
{
  "question_id": "p1-bin-01",
  "subject": "Bahasa Indonesia",
  "question_order": 1,
  "answer": "B",
  "updated_at": 1786364926747
}
```

Data pengerjaan tersimpan pada `.data/pengerjaan/<NIS>.json`
([`src/lib/pengerjaan/repositori.ts`](src/lib/pengerjaan/repositori.ts)) — satu
lapisan yang menyentuh media penyimpanan, sehingga penggantian ke database
sungguhan hanya mengubah berkas tersebut. Folder `.data/` tidak masuk ke git.

### Rumus nilai dan rata-rata

Seluruh angka nilai berasal dari dua rumus ini, dan keduanya dihitung di server
dari jawaban tersimpan — klien tidak pernah mengirim nilai.

**Nilai satu mata uji** ([`layanan.ts`](src/lib/pengerjaan/layanan.ts)):

```
nilai = round( benar / jumlah_soal_diujikan x 100 )
```

`jumlah_soal_diujikan` adalah banyaknya soal yang benar-benar diambil untuk
peserta, yaitu target mata uji pada menu Sesi, atau lebih sedikit bila bank soal
belum penuh. Soal yang tidak dijawab dihitung salah — tidak ada pengurang nilai
untuk jawaban keliru. Rentangnya 0–100.

**Rata-rata satu paket** ([`rekap-admin.ts`](src/lib/pengerjaan/rekap-admin.ts)
untuk admin, [`pembahasan.ts`](src/lib/pengerjaan/pembahasan.ts) untuk peserta):

```
rata-rata paket = round( jumlah nilai seluruh mata uji / banyak mata uji )
```

Perhatikan bahwa rata-ratanya dihitung dari **nilai tiap mata uji**, bukan dari
total jawaban benar. Karena jumlah soal tiap mata uji berbeda (20 dan 30), kedua
cara itu memberi hasil berbeda — cara yang dipakai memberi bobot sama kepada
setiap mata pelajaran. Mata uji yang belum dikumpulkan tidak ikut dihitung,
bukan dianggap nol.

**Rata-rata sebuah paket untuk seluruh kelas** adalah rata-rata dari rata-rata
peserta, dan **rata-rata sebuah mata pelajaran** adalah rata-rata nilai mata
uji itu dari seluruh peserta pada seluruh paket.

### Pengumpulan dan penilaian

Saat peserta menekan **Kumpulkan**, klien hanya mengirim nama mata uji yang
sedang berjalan — tidak ada jawaban maupun nilai yang dikirim. Server lalu
memvalidasi, menghitung jumlah benar/salah/kosong dari jawaban tersimpan
terhadap kunci bank soal, menghitung nilai `benar / jumlah soal × 100`, dan
membukukan hasilnya. Ketika timer mencapai 00:00, proses yang sama dijalankan
otomatis dengan penanda `otomatis: true`; bila peserta menutup browser sampai
waktu habis, pembukuan dilakukan saat ia kembali membuka area siswa.

### Validasi backend

Aturan berikut dijaga di server dan tidak dapat dilewati dengan mengubah
JavaScript di browser ([`src/lib/pengerjaan/layanan.ts`](src/lib/pengerjaan/layanan.ts)):

- identitas peserta selalu diambil dari sesi login, tidak pernah dari kiriman
  klien — peserta tidak dapat mengerjakan atau melihat hasil atas nama orang lain;
- jawaban hanya diterima untuk soal yang benar-benar milik mata uji yang sedang
  berjalan pada paket tersebut, dan hanya sebelum batas waktunya;
- pilihan di luar A–D ditolak;
- satu mata uji hanya dapat dikumpulkan satu kali;
- sesi yang sudah selesai tidak dapat diulang, dan hanya satu sesi boleh
  berjalan pada satu waktu;
- password sesi diverifikasi di server sebelum percobaan dibuat;
- nilai selalu dihitung ulang di server — klien tidak pernah mengirim skor.

`correct_answer` dan `explanation` dibuang sebelum soal dikirim
([`keSoalUjian`](src/lib/bank-soal/skema.ts)), sehingga tidak pernah muncul di
HTML maupun payload hidrasi.

### Ketika waktu habis

Batas waktu adalah milik server, bukan penghitung di browser. Ketika alokasi
suatu mata uji terlampaui — baik peserta masih membuka halaman, sudah menutup
browser, maupun mematikan JavaScript — hal berikut dijamin:

1. mata uji itu **dibukukan** dengan penanda `otomatis: true` pada saat
   pembacaan berikutnya (`sinkronkan` berjalan sebelum setiap operasi);
2. **jawaban yang telanjur dipilih tetap tersimpan**, karena setiap pilihan
   dikirim ke server saat itu juga, bukan saat pengumpulan;
3. **penilaian tetap dilakukan** dari jawaban tersimpan terhadap kunci bank soal;
4. **peserta tidak dapat melanjutkan**: penyimpanan jawaban ditolak, ruang ujian
   mengarahkan kembali ke halaman paket, dan sesi berstatus **Selesai** setelah
   seluruh mata uji dibukukan.

Perilaku ini sudah diuji langsung: sesi yang waktu mulainya dimundurkan melewati
seluruh alokasi langsung dinilai (termasuk jawaban yang tersimpan sebelumnya)
dan ruang ujiannya tidak dapat dibuka lagi.

## Anti-Kecurangan (Pengawasan Ujian)

Pengawasan berjalan di peramban peserta selama sesi masih dapat dikerjakan
([`src/components/ujian/pengawas.tsx`](src/components/ujian/pengawas.tsx)) dan
setiap kejadian dicatat di server lewat `POST /api/ujian/pelanggaran`.

| Kejadian | Perilaku |
| --- | --- |
| Mode layar penuh | Peserta diminta masuk layar penuh saat ruang ujian dibuka |
| Keluar dari layar penuh | Peringatan penuh layar + ajakan kembali, tercatat |
| Berpindah tab/jendela | Tercatat, dan saat peserta kembali **naskah soal ditutup** sampai ia menekan tombol pengakuan |
| Halaman disembunyikan | Sama seperti di atas; jumlah kejadian ditampilkan pada layar penutup |
| Menutup/meninggalkan halaman | Konfirmasi bawaan peramban + tercatat |
| Salin / potong / tempel | Dibatalkan + tercatat; naskah soal juga tidak dapat diseleksi |
| Klik kanan | Menu konteks dibatalkan + tercatat |
| Pintasan penyalinan | `Ctrl/Cmd + C, X, V, A, S, P, U, F`, `Ctrl+Shift+I/J/C/K`, `F12` dibatalkan; `PrintScreen` hanya dicatat karena tidak dapat dicegah peramban |
| Tangkapan layar | `PrintScreen` dan `Win/Ctrl+Shift+S`, serta setiap kali jendela ujian kehilangan fokus, menurunkan **tirai hitam** yang menutup naskah soal — gambar yang tertangkap berisi layar hitam |

**Batas yang dipegang agar tidak merusak usability:**

- Muat ulang halaman (`F5`/`Ctrl+R`) tetap diizinkan — sesi tidak hilang karena
  waktu dan jawaban ada di server.
- Navigasi papan tik (`Tab`, panah, `Enter`, `Spasi`) tidak diblokir sama
  sekali, sehingga pengguna pembaca layar tetap dapat mengerjakan soal.
- Setiap peringatan punya jalan keluar: peserta yang peramban atau perangkatnya
  tidak mendukung layar penuh tetap dapat mengerjakan soal, dan penolakan
  tersebut ikut tercatat, bukan memblokir ujian.
- Deteksi hanya dipasang selama mata uji berjalan; setelah dikumpulkan atau
  waktu habis, pengawasan berhenti agar peserta tidak diperingatkan saat
  meninggalkan halaman yang sudah selesai.

**Soal "siswa tidak dapat membuka tab lain":** tidak ada API peramban yang dapat
mencegah perpindahan tab atau jendela. Alt+Tab, Ctrl+T, dan klik ke aplikasi
lain berada di luar jangkauan halaman web — kalau ada cara memblokirnya, setiap
situs iklan akan memakainya. Yang dilakukan sistem ini adalah membuat
perpindahan itu **tidak berguna dan mahal**: begitu peserta kembali, naskah soal
tertutup sampai ia menekan tombol pengakuan, jumlah kejadian ditampilkan
kepadanya, seluruhnya tercatat untuk panitia, dan waktu ujian tetap berjalan di
server selama layar penutup itu tampil.

Penguncian tab yang sesungguhnya hanya mungkin lewat aplikasi terpasang
(kiosk mode, Safe Exam Browser, atau aplikasi desktop) yang menguasai sistem
operasi — bukan lewat situs web.

**Yang jujur perlu diketahui:** pengawasan ini adalah *pencegah*, bukan
pengaman. Peserta yang mematikan JavaScript hanya membuat kejadiannya tidak
tercatat — ia tidak memperoleh keuntungan nilai apa pun, karena soal, kunci,
waktu, dan penilaian seluruhnya berada di server.

Catatan pelanggaran **tidak** mengurangi nilai secara otomatis. Panitia
melihatnya pada **Hasil Try Out → Detail**: rekap per jenis, sepuluh kejadian
terakhir, serta penanda jumlah kejadian pada baris tabel.

### Yang boleh dilihat peserta

**Selama ujian berjalan**, peserta tidak pernah menerima kunci jawaban maupun
pembahasan: `keSoalUjian` membuangnya sebelum soal dikirim ke peramban, dan
penilaian sepenuhnya di server.

**Setelah mata uji dikumpulkan**, peserta melihat nilai, jumlah benar/salah,
jumlah soal, **dan pembahasannya** — lihat [Pembahasan Soal](#pembahasan-soal).
Pembatasnya per mata uji, bukan per sesi: mata uji berikutnya pada sesi yang
sama tetap tertutup sampai ia sendiri dikumpulkan.

### Pengecilan berkas unggahan

Batas ukuran tiap dokumen (lihat `maksByte` pada
[`src/lib/pendaftaran/dokumen.ts`](src/lib/pendaftaran/dokumen.ts)) tetap
ditegakkan server, tetapi berkas yang melebihinya **tidak langsung ditolak**:
peramban mengecilkannya lebih dulu lewat
[`src/lib/kompresi`](src/lib/kompresi), dan yang terkirim ke server adalah
hasilnya. Peserta tidak perlu mencari alat kompresi sendiri.

| Jenis | Cara | Akibat |
| --- | --- | --- |
| JPG/PNG/WebP | Digambar ulang pada `canvas`: sisi terpanjang dipangkas bertahap (2000 → 1600 → 1200 px) dan kualitas JPEG diturunkan (0,82 → 0,42) sampai muat | Hasilnya selalu JPG; transparansi PNG diganti latar putih |
| PDF | Tiap halaman dirender pdf.js lalu disusun ulang menjadi PDF berisi JPEG dengan pdf-lib (1500 → 1000 px, kualitas 0,72 → 0,52) | **Teks tidak lagi dapat diseleksi atau dicari** karena sudah menjadi gambar; ukuran halaman dalam titik tetap sama |

Percobaan berhenti pada konfigurasi pertama yang muat. Bila setelah percobaan
terakhir berkasnya masih di atas batas, unggahan ditolak dengan pesan berisi
ukuran sebelum dan sesudah — bukan menyimpan berkas yang melanggar batas.
Berkas di atas 25 MB dan PDF di atas 25 halaman ditolak lebih awal karena
prosesnya terlalu lama untuk hasil yang hampir pasti tetap gagal.

Dua catatan teknis yang menentukan implementasinya:

- Halaman dirender ke `OffscreenCanvas` dengan `intent: "print"`. Pada intent
  `display`, pdf.js menjadwalkan penggambaran lewat `requestAnimationFrame`
  yang **berhenti ketika tab tidak terlihat** — pengecilan akan menggantung
  begitu peserta berpindah aplikasi.
- Worker pdf.js dibuat sendiri sebagai *module worker*
  (`new Worker(url, { type: "module" })`). Lewat `workerSrc`, pdf.js
  menyusunnya sebagai worker klasik dan berkas worker v6 langsung mati dengan
  "Cannot use 'import.meta' outside a module", membuat pemuatan dokumen
  menggantung tanpa pesan apa pun. Berkas workernya disalin ke `public/` oleh
  `scripts/sinkron-worker-pdf.mjs` yang berjalan pada `predev`/`prebuild`,
  sehingga versinya tidak pernah berbeda dengan pustakanya.

Kompresi hanya berjalan ketika berkas memang melebihi batas — berkas yang sudah
cukup kecil dikirim apa adanya sehingga kualitas aslinya tidak dikorbankan.

### Kunci layar penuh

Ruang ujian meminta layar penuh pada **interaksi pertama** peserta — peramban
menolak `requestFullscreen()` tanpa gestur pengguna, dan gestur dari halaman
instruksi tidak terbawa melewati navigasi, jadi inilah yang paling dekat dengan
"langsung layar penuh".

Selama mata uji berjalan, keluar dari layar penuh **menutup naskah soal**
sampai peserta kembali; tidak ada pilihan "lanjutkan tanpa layar penuh", dan
menjawab seluruh soal pun tidak melepas kuncinya. Layar penuh baru terlepas
setelah jawaban dikumpulkan (atau waktunya habis).

Terus terang soal batasnya: peramban tidak menyediakan cara apa pun untuk
mencegah tombol Esc, dan tidak ada API yang dapat menahan Alt+Tab. Yang dapat
dilakukan halaman adalah membuat keluar itu **tidak berguna** — naskah tertutup,
waktu tetap berjalan di server, dan kejadiannya tercatat pada laporan
pengawasan. Satu pengecualian yang disengaja: bila peramban sendiri yang menolak
mode layar penuh, kuncinya dilepas dan kejadiannya dicatat — peserta tidak boleh
terkunci dari naskah soal karena sebab di luar kendalinya.

### Tirai anti tangkapan layar

Peramban tidak dapat mencegah tangkapan layar tingkat sistem. Yang dilakukan
ruang ujian adalah membuat hasilnya tidak berguna: begitu ada tandanya —
`PrintScreen`, pintasan alat pemotong Windows (`Win/Ctrl+Shift+S`), atau jendela
ujian kehilangan fokus — seluruh layar ditutup **hitam pekat** sampai peserta
kembali ke jendela ujian. Alat pemotong selalu mengambil fokus lebih dulu, jadi
tirainya sudah turun sebelum area soal sempat dipilih.

Ini pencegah, bukan pengaman: kamera ponsel tetap dapat memotret layar. Karena
itu kejadiannya juga tetap tercatat pada laporan pengawasan yang dibaca panitia.

## Stack

| Bagian | Teknologi |
| --- | --- |
| Framework | Next.js 15 (App Router, Server Components, Server Actions) |
| Bahasa | TypeScript (strict) |
| Styling | Tailwind CSS v4 (token desain via `@theme`) |
| Ikon | lucide-react |
| Sesi | Cookie httpOnly berisi token bertanda tangan HMAC-SHA256 (Web Crypto) |
| Deploy | Vercel — perlu environment variable, lihat [Deploy ke Vercel](#deploy-ke-vercel) |

## Menjalankan Project

```bash
npm install
```

```bash
npm run dev
```

Buka http://localhost:3000.

### Kalau terasa lambat saat mengklik menu

Itu perilaku normal `next dev`, bukan kelambatan aplikasi: setiap route baru
dikompilasi saat pertama kali dibuka. Pengukuran pada project ini:

| Mode | Buka pertama | Buka berikutnya |
| --- | --- | --- |
| `npm run dev` (Turbopack) | ~11 dtk (beranda) | ~0,4–2 dtk |
| `npm run start` (produksi) | ~0,15 dtk | ~0,03 dtk |

Script `dev` sudah memakai Turbopack. Untuk meninjau atau mendemokan aplikasi
pada kecepatan sesungguhnya, pakai mode produksi:

```bash
npm run build
```

```bash
npm run start
```

Bila Turbopack bermasalah, tersedia `npm run dev:webpack` sebagai cadangan.

Catatan: bila port 3000 sudah dipakai proses lain, Next otomatis pindah ke 3001.

### Yang dikerjakan agar perpindahan halaman tidak menggantung

Selain kompilasi dev di atas, ada tiga hal yang memang menahan navigasi dan
sudah diperbaiki:

**1. Pembacaan berantai ke penyimpanan.** Panel admin membaca satu dokumen per
peserta — catatan pengerjaan dan data pendaftaran — jadi 50 peserta berarti
puluhan query berurutan pada kolam koneksi yang hanya berisi tiga koneksi.
Lapisan penyimpanan kini punya
[`bacaBanyakJson`](src/lib/penyimpanan/index.ts) yang mengambil seluruhnya dalam
**satu** query (`WHERE kunci = ANY(...)`), dan kolam koneksinya dinaikkan ke 8
(dapat diatur lewat `DATABASE_POOL_MAX`). Halaman Siswa juga tidak lagi membaca
data pendaftaran sama sekali karena kolom berkasnya sudah dihapus.

**2. Tidak ada isyarat saat menunggu.** Perpindahan App Router menunggu server
selesai merender; tanpa penanda apa pun, klik terasa seperti tidak terjadi
apa-apa. Sekarang ada bilah kemajuan tipis di puncak layar
([`ProgresNavigasi`](src/components/layout/progres-navigasi.tsx)) yang menyala
untuk **semua** tautan internal dan formulir GET — termasuk tab dan tombol
filter, bukan hanya menu sidebar — plus spinner pada item menu yang sedang
dituju.

**3. Batas Suspense yang terlalu tinggi.** Tiap segmen berat kini punya
`loading.tsx` sendiri, sehingga sidebar dan kepala halaman tetap terpasang dan
rangka isinya muncul seketika.

Menu sidebar juga memakai `prefetch` eksplisit, jadi isi halaman berikutnya
sudah diambil sebelum diklik.

## Keamanan

### Sesi dan peran

Sesi disimpan pada cookie httpOnly `sameSite=lax` bermasa berlaku 8 jam. Di
produksi namanya `__Host-tn_session`: awalan `__Host-` membuat peramban hanya
menerimanya lewat HTTPS, ber-`Path=/`, dan tanpa atribut `Domain` — sehingga
subdomain lain tidak dapat menuliskan cookie sesi untuk aplikasi ini. Pada
pengembangan lokal yang berjalan di HTTP, awalan itu justru membuat cookie
ditolak, jadi namanya tetap `tn_session`. Isinya **token bertanda tangan HMAC-SHA256**
([`src/lib/session.ts`](src/lib/session.ts)) memakai Web Crypto, sehingga sama
berjalannya di middleware (Edge) maupun Server Action. Cookie yang disusun
sendiri pengunjung — termasuk yang menyatakan `role: "admin"` — ditolak karena
tanda tangannya tidak cocok, dan token yang lewat `exp` ikut ditolak.

Penjagaan peran berlapis dua:

1. [`src/middleware.ts`](src/middleware.ts) memverifikasi token pada setiap
   permintaan ke `/siswa/*`, `/ujian/*`, dan `/admin/*`;
2. `wajibSesi(peran)` ([`src/lib/get-session.ts`](src/lib/get-session.ts))
   diulang di setiap halaman dan Server Action, sekaligus memeriksa identitas
   terhadap data terkini — peserta yang dihapus atau dinonaktifkan langsung
   kehilangan akses tanpa menunggu sesinya kedaluwarsa, dan sesi admin harus
   menunjuk akun admin yang sedang dikonfigurasi.

Admin hanya dapat membuka area admin, siswa hanya area siswa; peran yang keliru
diarahkan ke dashboard miliknya sendiri.

**Satu halaman masuk untuk semua peran.** `/masuk` melayani siswa maupun
pengelola; peran **tidak pernah dikirim dari peramban** — server menyimpulkannya
dari kredensial yang cocok (akun pengelola diperiksa lebih dahulu), menuliskannya
ke dalam token bertanda tangan, lalu mengantar ke dashboard yang sesuai. Tidak
ada cara menaikkan peran dari sisi klien, dan pesan gagalnya tunggal supaya tidak
membocorkan identitas mana yang terdaftar. Alamat lama `/masuk/siswa` dan
`/masuk/admin` diteruskan ke `/masuk`.

### Kredensial

- Password peserta dan password sesi disimpan sebagai turunan **scrypt**
  beserta salt acak, diverifikasi dengan perbandingan waktu tetap.
- Akun admin diambil dari environment variable (`ADMIN_EMAIL`,
  `ADMIN_PASSWORD`) dan tidak pernah ikut terbundel ke sisi klien.
- **Kredensial bawaan tidak berlaku di produksi.** Nilai bawaan
  (`admin@shc.id` / `adminkeren`) tertulis di dalam kode sumber, jadi pada
  `NODE_ENV=production` ia sengaja dimatikan: selama `ADMIN_EMAIL` dan
  `ADMIN_PASSWORD` kosong — atau passwordnya kurang dari 10 karakter — panel
  admin tidak dapat dimasuki siapa pun. Statusnya terbaca di `/admin/diagnosa`.
- Pesan gagal masuk tidak membedakan "identitas tidak ditemukan" dan "password
  salah" agar tidak dapat dipakai menebak daftar akun.
- Percobaan masuk dan percobaan password sesi dibatasi
  ([`src/lib/keamanan/pembatas.ts`](src/lib/keamanan/pembatas.ts)): 8 percobaan
  masuk per identitas, 30 percobaan masuk per alamat asal, dan 10 percobaan
  password sesi — semuanya per 5 menit. Pembatas per alamat menahan penyisiran
  banyak akun dari satu tempat. Pembatas ini hidup di memori
  proses, jadi ia mempersulit penebakan otomatis pada satu instance — bukan
  pengganti pembatasan di tingkat infrastruktur.

### Tidak ada rahasia di frontend

Tidak ada variabel berawalan `NEXT_PUBLIC_`, dan tidak ada komponen klien yang
membaca `process.env`. `correct_answer` serta `explanation` dibuang sebelum soal
meninggalkan server ([`keSoalUjian`](src/lib/bank-soal/skema.ts)), sehingga tidak
pernah muncul di HTML maupun payload hidrasi. Kredensial demo dan password sesi
bawaan hanya dikirim ketika `NODE_ENV !== production`.

### Unggah berkas

Unggah gambar soal ([`src/lib/actions-unggah.ts`](src/lib/actions-unggah.ts))
memeriksa peran admin, ukuran (maks 2 MB), tipe MIME, kecocokan ekstensi nama
berkas, serta **magic bytes** isi berkas — tipe dari klien tidak dipercaya. SVG
yang mengandung `<script>`, `<foreignObject>`, `<iframe>`, `javascript:`, atau
atribut `on…=` ditolak, karena berkas di `public/soal` disajikan dari origin yang
sama. Nama berkas dibersihkan sehingga tidak dapat keluar dari folder tujuan.

Impor massal dibatasi 300 baris atau 8 MB per berkas, dan setiap sel dibersihkan
dari karakter kontrol, spasi nol lebar, serta dipotong pada 4.000 karakter
sebelum divalidasi ([`src/lib/import/validasi.ts`](src/lib/import/validasi.ts)).
Path gambar wajib menunjuk berkas gambar di dalam folder public, tanpa `..`.

### Header keamanan

[`next.config.ts`](next.config.ts) memasang **Content-Security-Policy**,
`X-Frame-Options: DENY` (halaman ujian tidak dapat disematkan pada situs lain),
`X-Content-Type-Options`, `Referrer-Policy`, `X-DNS-Prefetch-Control`, dan
`Permissions-Policy`. Di produksi ditambah `Strict-Transport-Security`. Header
`X-Powered-By` dimatikan.

CSP-nya mengunci `default-src`, `connect-src`, dan `form-action` ke `'self'`,
serta `object-src 'none'` dan `frame-ancestors 'none'` — data tidak dapat
dikirim ke server pihak ketiga, formulir tidak dapat dibajak ke alamat lain, dan
halaman tidak dapat dibingkai situs lain. `script-src` masih memuat
`'unsafe-inline'` karena Next menyisipkan skrip bootstrap dan muatan RSC secara
inline; menghapusnya menuntut nonce per permintaan.

Dua pengecualian yang disengaja: `/admin/*`, `/siswa/*`, `/masuk/*`, dan
`/ujian/*` ditambah `X-Robots-Tag: noindex` karena memuat data pribadi; dan
`/siswa/materi/<id>/lihat` memakai `frame-ancestors 'self'` dengan
`X-Frame-Options: SAMEORIGIN` karena PDF-nya memang disematkan pada halaman
pembacanya sendiri — situs lain tetap tidak dapat membingkainya.

Route `/ujian/*` dan seluruh route berkas pribadi ditambah
`Cache-Control: no-store`.

### Penulisan bersamaan

Seluruh operasi baca-ubah-tulis satu peserta dijalankan di bawah kunci per
peserta ([`denganKunci`](src/lib/pengerjaan/repositori.ts)). Tanpa ini, dua
permintaan yang datang bersamaan — misalnya penyimpanan jawaban dan pencatatan
pelanggaran — sama-sama membaca berkas versi lama lalu menimpanya, sehingga
salah satu perubahan hilang. Kunci ini menyerialkan permintaan pada satu
instance; penjagaan lintas instance baru diperoleh setelah lapisan penyimpanan
diganti database dengan transaksi.

## Environment Variable

Salin [`.env.example`](.env.example) menjadi `.env.local` untuk pengembangan,
dan isikan nilainya pada dasbor hosting untuk produksi. Seluruh variabel bersifat
server-only.

| Variabel | Wajib | Keterangan |
| --- | --- | --- |
| `SESSION_SECRET` | Ya, di produksi | Kunci penanda tangan cookie sesi, minimal 32 karakter. Tanpa ini aplikasi menolak menerbitkan sesi pada `NODE_ENV=production`, sehingga login gagal |
| `DATABASE_URL` | Ya, di hosting serverless | Connection string Postgres. Terisi → seluruh data masuk database; kosong → memakai folder berkas. `POSTGRES_URL` (diisi otomatis oleh Vercel Postgres) juga dikenali |
| `ADMIN_EMAIL` | **Ya, di produksi** | Email akun administrator. Tanpa ini panel admin tidak dapat dimasuki siapa pun di produksi — kredensial bawaan sengaja tidak berlaku di sana |
| `ADMIN_PASSWORD` | **Ya, di produksi** | Password akun administrator, minimal 10 karakter |
| `ADMIN_NAMA` | Tidak | Nama yang tampil pada panel admin (bawaan "Panitia Seleksi") |
| `DATA_DIR` | Tidak | Lokasi folder data saat **tidak** memakai Postgres; bawaan `.data/` di dalam project |
| `DATABASE_POOL_MAX` | Tidak | Jumlah koneksi database maksimal per instance; bawaan 8 |

Membuat `SESSION_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

## Akun

Keduanya masuk lewat halaman yang sama, `/masuk`; server menentukan sendiri
dashboard mana yang dibuka.

| Peran | Identitas | Kata Sandi | Berlaku di |
| --- | --- | --- | --- |
| Siswa | `aditya.pratama` | `siswa123` | pengembangan lokal |
| Admin | `admin@shc.id` | `adminkeren` | **pengembangan lokal saja** |

Kredensial admin tidak pernah ditampilkan pada antarmuka, termasuk halaman masuk
maupun dashboard. Pada `NODE_ENV=production` kredensial bawaan di atas **tidak
berlaku sama sekali**: isi `ADMIN_EMAIL` + `ADMIN_PASSWORD` sebelum deploy, atau
panel admin tidak dapat dimasuki siapa pun.

Kredensial siswa demo hanya ditampilkan sebagai petunjuk pada form login
selama `NODE_ENV !== production` dan password bawaannya belum diganti.

Password sesi bawaan mengikuti pola `TN26-P<nomor paket>-S<nomor sesi>` dan
mengikuti aturan yang sama: ditampilkan pada halaman instruksi hanya di
pengembangan lokal, dan hilang begitu admin menggantinya.

## Struktur Route

```
/                     Beranda publik
/masuk                Login siswa & admin (satu halaman, peran ditentukan server)
/masuk/siswa          → diteruskan ke /masuk (alamat lama)
/masuk/admin          → diteruskan ke /masuk (alamat lama)
/keluar               Keluar dari sesi (POST)

/siswa                                  Dashboard siswa        (dilindungi)
/siswa/materi                           Daftar materi, dipisah per mata pelajaran (?mapel=)
/siswa/materi/[id]                      Pembaca materi (tanpa tombol unduh)
/siswa/materi/[id]/lihat                Isi PDF, hanya untuk disematkan pembaca
/siswa/tryout                           Daftar paket try out
/siswa/tryout/[paketId]                 Detail paket & status kedua sesi
/siswa/tryout/[paketId]/[sesiId]/instruksi
                                        Instruksi + password & tombol mulai sesi
/siswa/hasil                            Rekap nilai per paket (semua mapel sekaligus)
/siswa/hasil/[paketId]                  Pembahasan soal paket itu (hanya mata uji
                                        yang sudah dikumpulkan peserta)
/siswa/data-diri                        Biodata, ortu, akademik, dokumen, prestasi
                                        (dapat dimatikan admin)

/ujian/[paketId]/[sesiId]               Ruang ujian CBT       (dilindungi)

/admin                Dashboard admin          (dilindungi)
/admin/siswa          Peserta yang masih Sedang Proses (`/[id]` detail)
/admin/alumni         Peserta yang sudah Lulus / Tidak Lulus
/admin/materi         Unggah & kelola materi per mata pelajaran
/admin/tryout         Paket & Sesi, Import Soal, Hasil (tab `?tab=`)
/admin/bank-soal      Bank soal + CRUD          (`/baru`, `/[id]`)
/admin/pengaturan     Sakelar seksi portal siswa
/admin/diagnosa       Pemeriksaan penyimpanan setelah deploy

/api/ujian/pelanggaran  Pencatatan kejadian pengawasan (POST, khusus siswa)
```

Aturan proteksi: pengunjung tanpa sesi diarahkan ke `/masuk`, dan peran yang
keliru diarahkan ke dashboard miliknya sendiri.

## Struktur Folder

```
src/
├── app/
│   ├── layout.tsx            Root layout + font + metadata + ToastProvider
│   ├── globals.css           Token desain & utility Tailwind v4
│   ├── page.tsx              Landing page
│   ├── not-found.tsx         Halaman 404
│   ├── error.tsx             Batas kesalahan seluruh halaman
│   ├── global-error.tsx      Batas kesalahan terakhir (root layout gagal)
│   ├── masuk/                Satu halaman login untuk semua peran
│   ├── siswa/                Area siswa (layout + halaman + loading per segmen)
│   ├── ujian/                Ruang ujian CBT (layout fokus, loading, error)
│   ├── admin/                Area admin (layout + halaman + loading per segmen)
│   └── api/ujian/pelanggaran Pencatatan kejadian pengawasan
├── components/
│   ├── auth/login-form.tsx   Form login (Client Component)
│   ├── tryout/               Form password & tombol mulai sesi
│   ├── ujian/                Ruang ujian (timer, navigasi soal), pengawas
│   │                         anti-kecurangan, dan lapisan peringatannya
│   ├── admin/                Kelola paket/sesi+password/siswa, import, detail,
│   │                         aksi baris siswa, sakelar fitur
│   ├── materi/               Kelola materi (admin) & pembaca materi (siswa)
│   ├── bank-soal/            Form soal, aksi per baris, unggah gambar
│   ├── layout/               Brand, shell dashboard (sidebar, topbar, drawer),
│   │                         dan bilah kemajuan navigasi
│   └── ui/                   Komponen dasar: button, card, badge, field,
│                             table, progress, stat-card, page-header,
│                             modal, pagination, toast, state
├── data/bank-soal/           Bank soal per paket (JSON)
├── data/konfigurasi/         Konfigurasi paket, sesi, password, dan siswa
├── lib/
│   ├── actions.ts            Server Action login satu pintu (peran ditentukan
│   │                         server dari kredensial yang cocok)
│   ├── actions-sesi.ts       Server Action mulai sesi (password), simpan
│   │                         jawaban, dan kumpulkan mata uji
│   ├── actions-bank-soal.ts  Server Action CRUD soal (khusus admin)
│   ├── admin/akun.ts         Akun admin dari environment variable
│   ├── admin/ringkasan-dashboard.ts  Angka Dashboard Admin: kesiapan tiap
│   │                         paket, kelengkapan berkas peserta, capaian
│   │                         nilai, matriks perkembangan, dan pengawasan
│   ├── keamanan/pembatas.ts  Pembatas percobaan masuk & password sesi
│   ├── bank-soal/skema.ts    Tipe, cakupan materi, target, dan validator
│   ├── bank-soal/repositori.ts  Baca/tulis bank soal + CRUD
│   ├── bank-soal/pengambilan.ts Pengambilan soal ujian, kunci, dan cakupan
│   ├── pengerjaan/tipe.ts    Model percobaan, jawaban, hasil, penjadwalan,
│   │                         dan jenis pelanggaran pengawasan
│   ├── pengerjaan/repositori.ts Penyimpanan pengerjaan + kunci per peserta
│   ├── pengerjaan/layanan.ts Validasi, penilaian, submit, riwayat, pengawasan
│   ├── pengerjaan/status.ts  Status sesi & paket untuk tampilan siswa
│   ├── pengerjaan/admin.ts   Pembacaan hasil seluruh peserta (khusus admin)
│   ├── penyimpanan/          Adapter berkas & Postgres di balik satu antarmuka,
│   │                         termasuk pembacaan banyak kunci sekaligus
│   ├── konfigurasi/          Repositori paket/sesi + hashing password sesi,
│   │                         dan sakelar fitur portal siswa (aplikasi.ts)
│   ├── materi/               Tipe & repositori materi belajar
│   ├── siswa/repositori.ts   Data siswa + verifikasi kredensial
│   ├── siswa/status.ts       Status akun & status kelulusan (Sedang Proses,
│   │                         Lulus, Tidak Lulus) beserta pemetaan nama lama
│   ├── paket-tryout.ts       Titik masuk konfigurasi paket dan sesi
│   ├── actions-konfigurasi.ts Server Action paket, sesi, dan password
│   ├── actions-siswa.ts      Server Action CRUD siswa dan status kelulusan
│   ├── actions-materi.ts     Server Action unggah/sunting/hapus materi
│   ├── actions-pengaturan.ts Server Action sakelar fitur portal siswa
│   ├── actions-unggah.ts     Unggah gambar soal ke public/soal
│   ├── actions-import.ts     Pratinjau dan konfirmasi impor massal
│   ├── import/excel.ts       Pembacaan .xlsx dan penyusunan template
│   ├── import/pdf.ts         Ekstraksi teks PDF dan pengenalan soal
│   ├── import/validasi.ts    Sanitasi & validasi baris impor per kolom
│   ├── session.ts            Token sesi bertanda tangan (aman untuk Edge)
│   ├── get-session.ts        Pembacaan sesi di server + penjaga peran
│   ├── navigasi.ts           Konfigurasi menu sidebar per peran
│   ├── pengumuman.ts         Isi pengumuman dashboard peserta
│   └── utils.ts              Helper `cn` dan format tanggal/angka
└── middleware.ts             Proteksi route /siswa/*, /ujian/*, /admin/*
```

## Sistem Desain

Warna diambil langsung dari logo Smart Home Center:

| Token | Nilai | Asal pada logo |
| --- | --- | --- |
| `--color-navy-900` | `#0f3055` | Wordmark dan sampul buku |
| `--color-langit-500` | `#4a81b0` | Lingkaran luar dan atap rumah |
| `--color-gold-400` | `#edb94e` | Bohlam dan aksen halaman buku |

Lambang tersimpan di [`public/logo.svg`](public/logo.svg) — timpa berkas itu
untuk memakai berkas logo asli, tanpa perlu mengubah kode.

- **Navy** sebagai warna utama, **langit** untuk aksen navigasi, **gold** untuk
  penanda prestasi dan tombol utama.
- Netral bersih untuk latar dan garis, bayangan lembut, sudut membulat.
- Responsif penuh: sidebar tetap pada layar ≥1024px, drawer pada layar kecil,
  tabel dapat digeser horizontal tanpa membuat halaman melebar.

### Responsif di ponsel

Seluruh tabel padat punya dua tampilan: **tabel** pada layar lebar dan **kartu**
pada ponsel — daftar siswa, alumni, sesi & password, paket, hasil try out (admin
maupun siswa), dan materi. Yang tersisa memakai gulir horizontal hanyalah tabel
yang memang matriks (nilai akademik per semester) dan bilah tab, dan gulirnya
selalu terkurung di dalam wadahnya sendiri sehingga badan halaman tidak pernah
ikut bergeser.

Formulir filter menumpuk ke bawah pada layar sempit, dan kontrolnya naik menjadi
40px. Di luar itu ada aturan `@media (pointer: coarse)` pada
[`globals.css`](src/app/globals.css) yang menaikkan tinggi minimum tombol dan
isian pada peranti sentuh, tanpa mengubah kerapatan tampilan desktop.

### Keadaan antarmuka

| Keadaan | Wujudnya |
| --- | --- |
| Memuat | `loading.tsx` per area (admin, siswa, ujian) + rangka tabel; tombol aksi berubah menjadi indikator saat proses berjalan |
| Gagal | `error.tsx` per area dan `global-error.tsx`; pesan teknis tidak ditampilkan, hanya kode kejadian untuk dicocokkan dengan log |
| Kosong | Setiap tabel/daftar punya pesan kosong yang menjelaskan langkah berikutnya, bukan sekadar "tidak ada data" |
| Notifikasi | Toast ([`src/components/ui/toast.tsx`](src/components/ui/toast.tsx)) dengan `aria-live`, dipakai aksi admin; ruang ujian memakai peringatan pengawasan tersendiri |
| Konfirmasi | Dialog konfirmasi untuk tindakan yang tidak dapat dibatalkan: kumpulkan mata uji, hapus soal, hapus peserta, hapus materi |
| Pencarian & filter | Berbasis URL pada seluruh tabel admin, sehingga hasil penyaringan dapat dibagikan |
| Paginasi | Komponen bersama yang mempertahankan parameter pencarian/filter antar halaman |

### Navigasi papan tik

Ruang ujian menerima panah **←/→** untuk berpindah soal serta **A–D** atau
**1–4** untuk memilih jawaban. Kombinasi dengan Ctrl/Alt/Meta sengaja dilewati
agar tidak bentrok dengan pengawas ujian, dan `Tab` tetap berfungsi normal
sehingga pengguna pembaca layar dapat menyusuri opsi seperti biasa. Ruang ujian
adalah satu-satunya halaman dengan pintasan tambahan; halaman lain memakai
perilaku fokus bawaan peramban.

## Deploy ke Vercel

Sistem berkas Vercel bersifat hanya-baca dan hilang setiap permintaan selesai,
jadi **database wajib** agar data bertahan. Ketiga penyedia di bawah ini
sama-sama Postgres biasa dan sama-sama cocok.

1. **Siapkan database.** Pilih salah satu:
   - Vercel Postgres — Storage → Create Database → Postgres, lalu hubungkan ke
     project. Vercel mengisi `POSTGRES_URL` otomatis.
   - [Neon](https://neon.tech) atau [Supabase](https://supabase.com) — buat
     project, salin connection string-nya.

   Tabel dibuat otomatis saat aplikasi pertama kali menulis. Tidak ada langkah
   migrasi manual.

2. **Push repository ke GitHub**, lalu import project di Vercel. Framework
   Next.js terdeteksi otomatis, tanpa konfigurasi build tambahan.

3. **Isi Environment Variables** (Project Settings → Environment Variables):

   | Variabel | Nilai |
   | --- | --- |
   | `SESSION_SECRET` | Hasil `node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"` |
   | `DATABASE_URL` | Connection string Postgres — lewati bila memakai Vercel Postgres, karena `POSTGRES_URL` sudah terisi sendiri |
   | `ADMIN_EMAIL` | Email admin Anda |
   | `ADMIN_PASSWORD` | Password admin Anda, minimal 10 karakter |

   **Tanpa `SESSION_SECRET`, login ditolak di produksi** — sengaja gagal secara
   aman daripada berjalan dengan sesi yang dapat dipalsukan. Begitu pula tanpa
   `ADMIN_EMAIL` + `ADMIN_PASSWORD`: panel admin tidak dapat dimasuki siapa pun,
   karena kredensial bawaan yang tertulis di kode sumber sengaja dimatikan di
   produksi.

4. **Deploy**, lalu buka **`/admin/diagnosa`**. Halaman itu menulis satu kunci
   uji, membacanya kembali, dan menghapusnya — sehingga Anda langsung melihat
   apakah penyimpanan benar-benar berfungsi, bukan sekadar terkonfigurasi.
   Yang ingin dilihat: adapter **Postgres**, Membaca **OK**, Menyimpan **OK**,
   dan daftar peringatan kosong.

### Cara kerja penyimpanan

`src/lib/penyimpanan` memilih adapter dari environment:

| Kondisi | Adapter | Data disimpan di |
| --- | --- | --- |
| `DATABASE_URL`/`POSTGRES_URL` terisi | `postgres` | Tabel `penyimpanan_aplikasi` (kunci → `bytea`) |
| Keduanya kosong | `berkas` | Folder `DATA_DIR`, bawaan `.data/` |

Berkas di `src/data` menjadi **nilai bawaan**: dibaca hanya ketika sebuah kunci
belum pernah ditulis. Karena itu aplikasi langsung jalan pada database kosong —
paket, sesi, dan bank soal bawaan tetap tampil — lalu tertutupi oleh data
sungguhan begitu admin menyimpan perubahan.

Berkas unggahan (pas foto, rapor, gambar soal) ikut tersimpan pada tabel yang
sama sebagai `bytea`, dengan batas 12 MB per berkas. Untuk ratusan siswa yang
masing-masing mengunggah belasan dokumen, pertimbangkan memindahkannya ke blob
storage — lihat Tahap Berikutnya.

### Anti-crash

Tidak ada satu pun jalur penyimpanan yang dapat menjatuhkan halaman:

- **Pembacaan tidak pernah melempar.** Database mati atau kunci rusak → jatuh ke
  nilai bawaan, kesalahan dicatat ke log server. Halaman tetap tampil.
- **Penulisan selalu mengembalikan hasil, bukan galat.** Seluruh penulisan
  melewati `cobaSimpan`, sehingga kegagalan muncul sebagai pesan di layar.
- **JSON rusak tidak mematikan halaman** — dicatat ke log, lalu memakai bawaan.

## Tahap Berikutnya (belum dikerjakan)

1. Blob storage terpisah untuk berkas unggahan bila jumlah peserta besar
   (Vercel Blob / Supabase Storage), menggantikan `bytea` pada Postgres
2. Penguncian lintas instance memakai transaksi database — `denganKunci` saat
   ini menyerialkan permintaan per instance saja
3. Pengisian bank soal hingga 100 soal per paket (600 butir)
4. Manajemen banyak akun admin beserta jejak audit tindakan
5. Analitik lanjutan: peringkat nasional dan tren capaian
