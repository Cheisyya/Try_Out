import type { SoalIq } from "@/lib/tes-iq/tipe";

/**
 * Tes IQ Latihan — Paket 5 (Simulasi).
 *
 * Paket penutup. Komposisinya sama dengan paket lain, tetapi butirnya dipilih
 * agar menyerupai keadaan tes yang sesungguhnya: soal mudah dan soal berat
 * berselang-seling, sehingga peserta berlatih memutuskan mana yang dikerjakan
 * lebih dahulu dan mana yang ditinggalkan sementara.
 *
 * Sama seperti paket lain, seluruh butir dapat dikerjakan tanpa gambar.
 */
export const SOAL_PAKET_5: SoalIq[] = [
  /* --------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "PANAS : TERMOS = SUARA : ...",
    opsi: { A: "Mikrofon", B: "Peredam", C: "Telinga", D: "Gema" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah sesuatu dengan alat yang menahan penyebarannya. Termos menahan panas agar tidak keluar, peredam menahan suara agar tidak menyebar. Mikrofon justru menguatkan suara, telinga menerimanya, dan gema adalah gejala pantulannya.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari NISBI adalah ...",
    opsi: { A: "Mutlak", B: "Relatif", C: "Pasti", D: "Tetap" },
    kunci: "B",
    pembahasan:
      "Nisbi berarti bergantung pada pembandingnya — persis makna relatif. Mutlak, pasti, dan tetap justru menyatakan kebalikannya, yaitu tidak bergantung pada apa pun.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "Lawan kata PROGRESIF adalah ...",
    opsi: { A: "Maju", B: "Konservatif", C: "Agresif", D: "Aktif" },
    kunci: "B",
    pembahasan:
      "Progresif berarti cenderung maju dan terbuka pada perubahan; lawannya konservatif, yang cenderung mempertahankan keadaan lama. Agresif menyangkut cara bertindak yang keras, bukan sikap terhadap perubahan.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "KAMUS : KATA = ATLAS : ...",
    opsi: { A: "Peta", B: "Negara", C: "Gambar", D: "Jarak" },
    kunci: "A",
    pembahasan:
      "Hubungannya adalah buku dengan satuan isi yang dikumpulkannya. Kamus mengumpulkan kata, atlas mengumpulkan peta. Negara dan jarak adalah hal yang ditunjukkan oleh peta, bukan satuan isi atlasnya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Sungai", B: "Danau", C: "Bendungan", D: "Laut" },
    kunci: "C",
    pembahasan:
      "Sungai, danau, dan laut adalah perairan yang terbentuk secara alami. Bendungan dibuat manusia, sehingga ia yang keluar dari kelompok. Perhatikan bahwa ukurannya berbeda-beda — itu bukan pembedanya.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Tidak seorang pun peserta yang terlambat diperbolehkan masuk. Bayu diperbolehkan masuk. Kesimpulannya ...",
    opsi: {
      A: "Bayu terlambat",
      B: "Bayu tidak terlambat",
      C: "Bayu bukan peserta",
      D: "Tidak dapat disimpulkan",
    },
    kunci: "B",
    pembahasan:
      "Pernyataan pertama berarti: bila terlambat, maka tidak boleh masuk. Bayu boleh masuk, sehingga bagian 'tidak boleh masuk' tidak berlaku padanya, dan karena itu ia tidak terlambat. Pilihan C menambahkan keterangan yang tidak diperlukan — status kepesertaannya tidak dipersoalkan.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan:
      'Makna peribahasa "Sedia payung sebelum hujan" adalah ...',
    opsi: {
      A: "Bersiap sebelum kesulitan datang",
      B: "Menunda pekerjaan sampai batas akhir",
      C: "Meminta bantuan sejak awal",
      D: "Menyimpan barang yang belum diperlukan",
    },
    kunci: "A",
    pembahasan:
      "Payung disiapkan ketika hujan belum turun, yaitu bersiap menghadapi kesulitan sebelum kesulitannya benar-benar datang. Pilihan D mendekati bunyi harfiahnya, tetapi kehilangan inti maknanya: yang ditekankan adalah kesiapsiagaan, bukan penyimpanan barang.",
  },

  /* -------------------------------- Numerik -------------------------------- */
  {
    nomor: 8,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["5, 6, 8, 11, 15, 20, ..."],
    opsi: { A: "24", B: "25", C: "26", D: "27" },
    kunci: "C",
    pembahasan:
      "Selisih antarsuku adalah 1, 2, 3, 4, 5 — bertambah satu setiap langkah. Selisih berikutnya 6, sehingga 20 + 6 = 26.",
  },
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["1, 8, 27, 64, ..."],
    opsi: { A: "81", B: "100", C: "121", D: "125" },
    kunci: "D",
    pembahasan:
      "Deret ini adalah pangkat tiga bilangan asli: 1³, 2³, 3³, 4³. Suku berikutnya 5³ = 125. Jawaban 81 adalah jebakan bagi yang mengira polanya pangkat dua.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah barang dinaikkan harganya 20%, lalu diturunkan 20% dari harga yang baru. Bagaimana harga akhirnya dibandingkan harga semula?",
    opsi: {
      A: "Sama dengan harga semula",
      B: "Lebih murah 4%",
      C: "Lebih mahal 4%",
      D: "Lebih murah 2%",
    },
    kunci: "B",
    pembahasan:
      "Ambil harga semula 100. Naik 20% menjadi 120. Turun 20% dari 120 berarti berkurang 24, sehingga menjadi 96 — lebih murah 4%. Persentase yang sama tidak saling menghapus karena dasar perhitungannya berbeda: yang pertama dari 100, yang kedua dari 120.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Tiga mesin menyelesaikan pesanan dalam 10 jam. Berapa jam yang diperlukan lima mesin sejenis untuk pesanan yang sama?",
    opsi: { A: "4 jam", B: "5 jam", C: "6 jam", D: "8 jam" },
    kunci: "C",
    pembahasan:
      "Total pekerjaan = 3 × 10 = 30 jam-mesin. Dengan lima mesin, waktunya 30 ÷ 5 = 6 jam. Banyak mesin dan lama pengerjaan berbanding terbalik, sehingga penambahan mesin memperpendek waktu, bukan memperpanjangnya.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Nilai rata-rata suatu kelas 75. Bila nilai delapan siswa dengan rata-rata 90 dikeluarkan, rata-rata sisanya menjadi 70. Berapa jumlah siswa kelas itu semula?",
    opsi: { A: "24", B: "28", C: "32", D: "40" },
    kunci: "C",
    pembahasan:
      "Misalkan jumlah siswa semula n. Jumlah seluruh nilai dapat ditulis dua cara: 75n, dan 90 × 8 + 70 × (n - 8). Menyamakannya memberi 75n = 720 + 70n - 560, sehingga 5n = 160 dan n = 32. Pemeriksaan: 75 × 32 = 2.400, sedangkan 720 + 70 × 24 = 2.400 — keduanya cocok.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah persegi panjang berukuran panjang 18 cm dan lebar 12 cm. Bila panjangnya dikurangi 3 cm dan lebarnya ditambah 3 cm, bagaimana luasnya berubah?",
    opsi: {
      A: "Bertambah 9 cm²",
      B: "Berkurang 9 cm²",
      C: "Tidak berubah",
      D: "Bertambah 18 cm²",
    },
    kunci: "A",
    pembahasan:
      "Luas semula 18 × 12 = 216 cm². Luas baru 15 × 15 = 225 cm². Selisihnya 225 - 216 = 9 cm², yaitu bertambah. Dengan keliling tetap, persegi panjang yang makin mendekati bentuk persegi selalu berluas lebih besar.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berselang berikut.",
    pola: ["7, 2, 14, 6, 28, 18, 56, ..."],
    opsi: { A: "36", B: "48", C: "54", D: "112" },
    kunci: "C",
    pembahasan:
      "Suku ganjil 7, 14, 28, 56 dikalikan 2 setiap langkah. Suku genap 2, 6, 18 dikalikan 3 setiap langkah, sehingga suku genap berikutnya 18 × 3 = 54. Yang ditanyakan menempati urutan kedelapan — urutan genap — maka jawabannya 54.",
  },

  /* --------------------------------- Logika -------------------------------- */
  {
    nomor: 15,
    kategori: "Logika",
    pertanyaan:
      "Semua pemain inti berlatih setiap sore. Bagas tidak berlatih setiap sore. Kesimpulannya ...",
    opsi: {
      A: "Bagas pemain inti",
      B: "Bagas bukan pemain inti",
      C: "Bagas pemain cadangan",
      D: "Tidak dapat disimpulkan",
    },
    kunci: "B",
    pembahasan:
      "Menjadi pemain inti selalu berakibat berlatih setiap sore. Karena akibat itu tidak berlaku pada Bagas, sebabnya juga tidak berlaku: Bagas bukan pemain inti. Pilihan C melompat — soal tidak menyebut adanya pemain cadangan.",
  },
  {
    nomor: 16,
    kategori: "Logika",
    pertanyaan:
      "Enam siswa mengikuti lomba. Rani finis sebelum Sinta, tetapi sesudah Tomo. Umar finis sesudah Sinta. Siapakah yang tidak mungkin menjadi juara pertama?",
    opsi: { A: "Tomo", B: "Rani", C: "Seorang siswa lain", D: "Semua mungkin" },
    kunci: "B",
    pembahasan:
      "Urutan yang pasti adalah Tomo sebelum Rani, Rani sebelum Sinta, dan Sinta sebelum Umar. Karena Tomo selalu berada di depan Rani, Rani tidak mungkin menjadi yang pertama. Tomo masih mungkin, dan dua siswa lain yang belum disebutkan pun masih mungkin.",
  },
  {
    nomor: 17,
    kategori: "Logika",
    pertanyaan:
      "Sebuah sandi mengganti setiap huruf dengan huruf berikutnya dalam abjad, lalu membalik urutan hurufnya. Kata BUKU menjadi ...",
    opsi: { A: "VLVC", B: "CVLV", C: "VLCV", D: "CLVV" },
    kunci: "A",
    pembahasan:
      "Langkah pertama menggeser tiap huruf satu langkah maju: B→C, U→V, K→L, U→V, sehingga menjadi CVLV. Langkah kedua membalik urutannya dari belakang: V, L, V, C — terbaca VLVC. Urutan pengerjaan tidak boleh ditukar; membalik lebih dahulu akan memberi hasil yang berbeda.",
  },
  {
    nomor: 18,
    kategori: "Logika",
    pertanyaan:
      "Di antara 30 siswa, 17 membawa pensil, 14 membawa penghapus, dan 5 tidak membawa keduanya. Berapa siswa yang membawa kedua-duanya?",
    opsi: { A: "4", B: "5", C: "6", D: "8" },
    kunci: "C",
    pembahasan:
      "Yang membawa sekurang-kurangnya satu barang = 30 - 5 = 25. Bila kedua angka dijumlahkan, 17 + 14 = 31, kelompok yang membawa dua-duanya terhitung dua kali. Maka irisannya 31 - 25 = 6.",
  },
  {
    nomor: 19,
    kategori: "Logika",
    pertanyaan:
      "Sebuah jam tertinggal 3 menit setiap jam. Bila jam itu dicocokkan tepat pukul 06.00, pukul berapa yang ditunjukkannya ketika waktu sebenarnya pukul 14.00?",
    opsi: { A: "13.36", B: "13.42", C: "13.48", D: "13.54" },
    kunci: "A",
    pembahasan:
      "Dari pukul 06.00 sampai 14.00 berlalu 8 jam, dan jam itu tertinggal 3 menit setiap jam, sehingga seluruhnya tertinggal 8 × 3 = 24 menit. Maka yang ditunjukkannya adalah 14.00 dikurangi 24 menit, yaitu 13.36.",
  },
  {
    nomor: 20,
    kategori: "Logika",
    pertanyaan:
      "Empat kotak berjajar memuat bola merah, biru, hijau, dan kuning — masing-masing satu warna. Kotak hijau paling kiri. Kotak merah dan kotak biru dua-duanya bukan di ujung, dan kotak biru tepat di sebelah kanan kotak merah. Warna apakah pada kotak paling kanan?",
    opsi: { A: "Merah", B: "Biru", C: "Hijau", D: "Kuning" },
    kunci: "D",
    pembahasan:
      "Hijau menempati kotak 1. Merah dan biru sama-sama tidak boleh di ujung, sehingga keduanya harus menempati kotak 2 dan 3 — dan karena biru tepat di kanan merah, merah di kotak 2 dan biru di kotak 3. Kotak 4 tinggal untuk kuning, satu-satunya warna yang belum ditempatkan.",
  },

  /* -------------------------------- Spasial -------------------------------- */
  {
    nomor: 21,
    kategori: "Spasial",
    pertanyaan:
      "Sebuah kubus 4 × 4 × 4 dicat seluruh permukaan luarnya lalu dipotong menjadi 64 kubus kecil. Berapa kubus kecil yang terkena cat tepat pada dua sisi?",
    opsi: { A: "8", B: "12", C: "24", D: "36" },
    kunci: "C",
    pembahasan:
      "Kubus yang terkena cat pada dua sisi adalah yang terletak pada rusuk tetapi bukan di sudut. Setiap rusuk kubus 4 × 4 × 4 memuat 4 kubus kecil, dua di antaranya sudut, sehingga tersisa 2 per rusuk. Kubus memiliki 12 rusuk, maka 12 × 2 = 24.",
  },
  {
    nomor: 22,
    kategori: "Spasial",
    pertanyaan:
      "Sehelai kertas dilipat tiga kali berturut-turut, lalu digunting satu lubang menembus seluruh lapisan. Berapa lubang yang terbentuk setelah dibuka?",
    opsi: { A: "Tiga", B: "Empat", C: "Enam", D: "Delapan" },
    kunci: "D",
    pembahasan:
      "Setiap lipatan menggandakan jumlah lapisan: 2, lalu 4, lalu 8. Satu guntingan menembus kedelapan lapisan sekaligus, sehingga terbentuk delapan lubang. Polanya adalah 2 pangkat banyaknya lipatan, bukan dua kali banyaknya lipatan.",
  },
  {
    nomor: 23,
    kategori: "Spasial",
    pertanyaan:
      "Sebuah bangun diputar 90° berlawanan arah jarum jam, lalu dicerminkan terhadap garis tegak. Perputaran 90° berlawanan arah jarum jam setara dengan perputaran berapa derajat searah jarum jam?",
    opsi: { A: "90°", B: "180°", C: "270°", D: "360°" },
    kunci: "C",
    pembahasan:
      "Satu putaran penuh adalah 360°. Berputar 90° ke satu arah menempuh kedudukan yang sama dengan berputar 360° - 90° = 270° ke arah sebaliknya. Pencerminan pada langkah kedua tidak mengubah kesetaraan ini karena yang ditanyakan hanya bagian perputarannya.",
  },
  {
    nomor: 24,
    kategori: "Spasial",
    pertanyaan:
      "Pada matriks berikut, banyaknya garis pada setiap sel bertambah dua dari kiri ke kanan dan bertambah satu dari atas ke bawah. Berapa garis yang menggantikan tanda tanya?",
    pola: ["1    3    5", "2    4    6", "3    5    ?"],
    opsi: { A: "Lima", B: "Enam", C: "Tujuh", D: "Delapan" },
    kunci: "C",
    pembahasan:
      "Sel yang ditanyakan berada di baris ketiga kolom ketiga. Dari arah baris: 3, 5, lalu 7. Dari arah kolom: 5, 6, lalu 7. Kedua arah memberi angka yang sama, yaitu tujuh — dan kecocokan dua arah itulah tanda bahwa polanya sudah terbaca benar.",
  },
  {
    nomor: 25,
    kategori: "Spasial",
    pertanyaan:
      "Pada sebuah dadu, jumlah mata dua sisi yang berhadapan selalu 7. Bila sisi bermata 1 menghadap ke atas dan sisi bermata 2 menghadap ke depan, berapa mata pada sisi yang menghadap ke bawah?",
    opsi: { A: "3", B: "4", C: "5", D: "6" },
    kunci: "D",
    pembahasan:
      "Sisi bawah selalu berhadapan dengan sisi atas, sehingga jumlah keduanya 7. Karena sisi atas bermata 1, sisi bawah bermata 7 - 1 = 6. Keterangan tentang sisi depan tidak diperlukan untuk menjawabnya — ia hanya menguji apakah peserta memilah keterangan yang penting.",
  },
];
