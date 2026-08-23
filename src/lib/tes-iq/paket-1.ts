import type { SoalIq } from "@/lib/tes-iq/tipe";

/**
 * Tes IQ Latihan — Paket 1 (Dasar).
 *
 * Tujuh soal verbal, tujuh numerik, enam logika, dan lima spasial. Seluruhnya
 * dapat dikerjakan tanpa gambar: pola spasialnya ditulis sebagai huruf atau
 * lambang sederhana sehingga tetap terbaca di layar ponsel maupun oleh pembaca
 * layar.
 *
 * Setiap butir wajib punya tepat satu jawaban yang dapat dipertanggungjawabkan
 * beserta pembahasannya — latihan ini tidak menghasilkan angka IQ, jadi
 * penjelasan cara berpikirnya adalah satu-satunya keluaran yang bernilai.
 */
export const SOAL_PAKET_1: SoalIq[] = [
  /* --------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "KAKI : SEPATU = TANGAN : ...",
    opsi: {
      A: "Jari",
      B: "Sarung tangan",
      C: "Cincin",
      D: "Lengan",
    },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah anggota badan dengan pelindung yang dikenakan padanya. Sepatu melindungi kaki, maka pasangan untuk tangan adalah sarung tangan. Jari dan lengan adalah bagian tubuh, bukan pelindung, sedangkan cincin hanya perhiasan pada satu jari.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Kata yang bersinonim dengan MANDIRI adalah ...",
    opsi: {
      A: "Berdikari",
      B: "Berhemat",
      C: "Bersahaja",
      D: "Bergantung",
    },
    kunci: "A",
    pembahasan:
      "Berdikari adalah singkatan dari berdiri di atas kaki sendiri, yang berarti tidak bergantung kepada orang lain — persis makna mandiri. Berhemat berkaitan dengan pengeluaran, bersahaja berarti sederhana, dan bergantung justru lawan katanya.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "Lawan kata GERSANG adalah ...",
    opsi: {
      A: "Kering",
      B: "Tandus",
      C: "Subur",
      D: "Panas",
    },
    kunci: "C",
    pembahasan:
      "Gersang berarti tidak dapat ditumbuhi tanaman dengan baik, sehingga lawannya adalah subur. Kering dan tandus justru bersinonim dengan gersang, sedangkan panas menyatakan suhu, bukan kesuburan tanah.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "DOKTER : RUMAH SAKIT = GURU : ...",
    opsi: {
      A: "Murid",
      B: "Sekolah",
      C: "Buku",
      D: "Pelajaran",
    },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah profesi dengan tempat ia bekerja. Dokter bekerja di rumah sakit, guru bekerja di sekolah. Murid adalah orang yang dilayani, buku adalah alat, dan pelajaran adalah isi pekerjaan — ketiganya bukan tempat.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan: "Manakah kata yang TIDAK sekelompok dengan ketiga kata lainnya?",
    opsi: {
      A: "Mawar",
      B: "Melati",
      C: "Anggrek",
      D: "Bambu",
    },
    kunci: "D",
    pembahasan:
      "Mawar, melati, dan anggrek sama-sama tanaman yang ditanam karena bunganya. Bambu ditanam karena batangnya dan tidak dikenal sebagai tanaman bunga, sehingga ia yang keluar dari kelompok.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan: "HAUS : MINUM = LELAH : ...",
    opsi: {
      A: "Istirahat",
      B: "Bekerja",
      C: "Sakit",
      D: "Lapar",
    },
    kunci: "A",
    pembahasan:
      "Hubungannya adalah keadaan tubuh dengan tindakan yang mengatasinya. Haus diatasi dengan minum, lelah diatasi dengan istirahat. Bekerja justru menambah lelah, sedangkan sakit dan lapar adalah keadaan lain, bukan tindakan.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Kata yang bersinonim dengan BAKU adalah ...",
    opsi: {
      A: "Standar",
      B: "Aneh",
      C: "Kasar",
      D: "Baru",
    },
    kunci: "A",
    pembahasan:
      "Baku berarti sesuai dengan patokan atau ketentuan yang berlaku umum, yaitu standar. Contohnya, bahasa baku sama artinya dengan bahasa standar. Pilihan lain tidak berkaitan dengan makna patokan.",
  },

  /* -------------------------------- Numerik -------------------------------- */
  {
    nomor: 8,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["3,  6,  9,  12,  ..."],
    opsi: { A: "13", B: "14", C: "15", D: "18" },
    kunci: "C",
    pembahasan:
      "Setiap suku bertambah 3: 3 + 3 = 6, 6 + 3 = 9, 9 + 3 = 12. Maka suku berikutnya adalah 12 + 3 = 15.",
  },
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["2,  4,  8,  16,  ..."],
    opsi: { A: "20", B: "24", C: "32", D: "64" },
    kunci: "C",
    pembahasan:
      "Setiap suku adalah dua kali suku sebelumnya: 2 x 2 = 4, 4 x 2 = 8, 8 x 2 = 16. Maka suku berikutnya adalah 16 x 2 = 32. Jawaban 20 keliru karena mengira polanya penjumlahan.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["1,  4,  9,  16,  25,  ..."],
    opsi: { A: "30", B: "32", C: "36", D: "49" },
    kunci: "C",
    pembahasan:
      "Deret ini adalah bilangan kuadrat: 1 = 1 x 1, 4 = 2 x 2, 9 = 3 x 3, 16 = 4 x 4, dan 25 = 5 x 5. Suku keenam adalah 6 x 6 = 36. Jawaban 49 adalah kuadrat ke-7, jadi melompat satu langkah terlalu jauh.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut.",
    pola: ["5,  8,  12,  17,  23,  ..."],
    opsi: { A: "28", B: "29", C: "30", D: "31" },
    kunci: "C",
    pembahasan:
      "Selisih antarsuku bertambah satu setiap langkah: +3, +4, +5, lalu +6. Maka selisih berikutnya adalah +7, sehingga 23 + 7 = 30.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Deret berikut tersusun dari dua deret yang berselang-seling. Berapakah bilangan berikutnya?",
    pola: ["2,  5,  4,  10,  6,  15,  8,  ..."],
    opsi: { A: "10", B: "18", C: "20", D: "24" },
    kunci: "C",
    pembahasan:
      "Suku pada urutan ganjil membentuk deret 2, 4, 6, 8 yang bertambah 2. Suku pada urutan genap membentuk deret 5, 10, 15, ... yang bertambah 5. Bilangan yang diminta menempati urutan genap, jadi nilainya 15 + 5 = 20.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Harga 3 buku tulis adalah Rp24.000. Berapa harga 7 buku tulis yang sama?",
    opsi: {
      A: "Rp48.000",
      B: "Rp54.000",
      C: "Rp56.000",
      D: "Rp63.000",
    },
    kunci: "C",
    pembahasan:
      "Cari harga satuannya lebih dahulu: Rp24.000 dibagi 3 sama dengan Rp8.000 per buku. Harga 7 buku adalah 7 x Rp8.000 = Rp56.000.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah kelas berisi 40 siswa. Sebanyak 30% di antaranya mengikuti ekstrakurikuler. Berapa siswa yang mengikuti ekstrakurikuler?",
    opsi: { A: "10 siswa", B: "12 siswa", C: "14 siswa", D: "16 siswa" },
    kunci: "B",
    pembahasan:
      "30% dari 40 dihitung sebagai 30/100 x 40 = 12. Jadi ada 12 siswa yang mengikuti ekstrakurikuler.",
  },

  /* --------------------------------- Logika -------------------------------- */
  {
    nomor: 15,
    kategori: "Logika",
    pertanyaan:
      "Semua siswa kelas IX mengikuti try out. Andi adalah siswa kelas IX. Kesimpulan yang pasti benar adalah ...",
    opsi: {
      A: "Andi mengikuti try out",
      B: "Andi belum tentu mengikuti try out",
      C: "Hanya Andi yang mengikuti try out",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "A",
    pembahasan:
      "Pernyataan pertama berlaku untuk seluruh siswa kelas IX tanpa kecuali, dan Andi termasuk di dalamnya, sehingga Andi pasti mengikuti try out. Pilihan C keliru karena pernyataan itu tidak melarang orang lain ikut serta.",
  },
  {
    nomor: 16,
    kategori: "Logika",
    pertanyaan:
      "Semua anggota pramuka mahir tali-temali. Sebagian siswa kelas VIII adalah anggota pramuka. Kesimpulan yang pasti benar adalah ...",
    opsi: {
      A: "Semua siswa kelas VIII mahir tali-temali",
      B: "Sebagian siswa kelas VIII mahir tali-temali",
      C: "Tidak ada siswa kelas VIII yang mahir tali-temali",
      D: "Semua yang mahir tali-temali adalah siswa kelas VIII",
    },
    kunci: "B",
    pembahasan:
      "Yang menjadi anggota pramuka hanya sebagian siswa kelas VIII, dan sebagian itu pasti mahir tali-temali. Jadi kesimpulan yang aman berhenti pada kata sebagian. Aturannya: kesimpulan tidak boleh lebih kuat daripada pernyataan yang paling lemah.",
  },
  {
    nomor: 17,
    kategori: "Logika",
    pertanyaan:
      "Rina lebih tinggi daripada Sari. Sari lebih tinggi daripada Tuti. Siapakah yang paling pendek?",
    opsi: {
      A: "Rina",
      B: "Sari",
      C: "Tuti",
      D: "Tidak dapat ditentukan",
    },
    kunci: "C",
    pembahasan:
      "Urutkan dari yang tertinggi: Rina, lalu Sari, lalu Tuti. Karena Tuti berada di bawah Sari yang sudah berada di bawah Rina, Tuti adalah yang paling pendek.",
  },
  {
    nomor: 18,
    kategori: "Logika",
    pertanyaan:
      "Jika hujan turun, maka lapangan basah. Pagi ini lapangan TIDAK basah. Kesimpulannya ...",
    opsi: {
      A: "Hujan turun",
      B: "Hujan tidak turun",
      C: "Hujan mungkin turun",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "B",
    pembahasan:
      "Jika hujan turun, akibatnya pasti lapangan basah. Karena akibat itu tidak terjadi, sebabnya juga tidak mungkin terjadi, sehingga hujan tidak turun. Penalaran ini disebut menyangkal akibat dan hasilnya selalu sah.",
  },
  {
    nomor: 19,
    kategori: "Logika",
    pertanyaan:
      "Jika hujan turun, maka lapangan basah. Pagi ini lapangan basah. Kesimpulannya ...",
    opsi: {
      A: "Hujan pasti turun",
      B: "Hujan pasti tidak turun",
      C: "Belum tentu hujan turun",
      D: "Lapangan pasti disiram petugas",
    },
    kunci: "C",
    pembahasan:
      "Pernyataan hanya menjamin arah hujan menyebabkan basah, bukan sebaliknya. Lapangan basah dapat disebabkan hal lain, misalnya disiram atau berembun. Menyimpulkan hujan dari lapangan yang basah adalah kekeliruan berpikir yang disebut menegaskan akibat. Bandingkan dengan soal sebelumnya, yang arah penalarannya sah.",
  },
  {
    nomor: 20,
    kategori: "Logika",
    pertanyaan:
      "Empat anak duduk berjajar menghadap ke depan. Doni duduk di ujung kiri. Beni tepat di sebelah kanan Doni. Ana duduk di antara Beni dan Citra. Siapakah yang duduk di ujung kanan?",
    opsi: { A: "Ana", B: "Beni", C: "Citra", D: "Doni" },
    kunci: "C",
    pembahasan:
      "Mulai dari yang pasti: Doni di kursi pertama, Beni di kursi kedua. Ana berada di antara Beni dan Citra, jadi Ana menempati kursi ketiga dan Citra kursi keempat. Urutannya Doni - Beni - Ana - Citra, sehingga ujung kanan adalah Citra.",
  },

  /* -------------------------------- Spasial -------------------------------- */
  {
    nomor: 21,
    kategori: "Spasial",
    pertanyaan:
      "Huruf kecil b diputar 180 derajat pada bidang datar. Bentuk yang terlihat menjadi ...",
    opsi: { A: "d", B: "p", C: "q", D: "b" },
    kunci: "C",
    pembahasan:
      "Putaran 180 derajat sama dengan mencerminkan dua kali: mendatar lalu tegak. Cermin mendatar mengubah b menjadi d, kemudian cermin tegak mengubah d menjadi q. Jawaban d dan p masing-masing hanya hasil satu kali pencerminan, bukan putaran penuh.",
  },
  {
    nomor: 22,
    kategori: "Spasial",
    pertanyaan:
      "Huruf N dicerminkan terhadap sebuah garis tegak di sebelahnya. Bayangan yang terbentuk adalah ...",
    opsi: {
      A: "Tetap berbentuk N",
      B: "N yang terbalik kiri-kanan",
      C: "Huruf Z",
      D: "Huruf M",
    },
    kunci: "B",
    pembahasan:
      "Cermin tegak menukar sisi kiri dengan sisi kanan. Garis miring huruf N yang semula turun dari kiri atas ke kanan bawah menjadi turun dari kanan atas ke kiri bawah, sehingga bayangannya adalah N yang terbalik kiri-kanan. Huruf N tidak simetris terhadap garis tegak, jadi bayangannya tidak mungkin tetap sama.",
  },
  {
    nomor: 23,
    kategori: "Spasial",
    pertanyaan:
      "Huruf kapital manakah yang bayangannya TETAP SAMA bila dicerminkan terhadap garis tegak?",
    opsi: { A: "F", B: "A", C: "L", D: "P" },
    kunci: "B",
    pembahasan:
      "Huruf A memiliki sumbu simetri tegak di tengahnya, sehingga sisi kiri dan sisi kanannya sama persis dan bayangannya tidak berubah. Huruf F, L, dan P seluruh bagiannya menjorok ke satu sisi saja, sehingga bayangannya menghadap arah berlawanan.",
  },
  {
    nomor: 24,
    kategori: "Spasial",
    pertanyaan:
      "Pada matriks berikut, urutan lambang setiap baris digeser satu langkah ke kiri dari baris di atasnya. Lambang apakah yang menggantikan tanda tanya?",
    pola: ["O   S   K", "S   K   O", "K   O   ?"],
    opsi: {
      A: "O (lingkaran)",
      B: "S (segitiga)",
      C: "K (kotak)",
      D: "Tidak ada yang cocok",
    },
    kunci: "B",
    pembahasan:
      "Baris pertama O-S-K. Digeser satu langkah ke kiri menjadi S-K-O, yaitu baris kedua. Digeser sekali lagi menjadi K-O-S, yaitu baris ketiga, sehingga tanda tanya diisi S. Pemeriksaan silang: dengan jawaban itu setiap kolom pun berisi ketiga lambang tepat satu kali.",
  },
  {
    nomor: 25,
    kategori: "Spasial",
    pertanyaan:
      "Pada sebuah dadu, jumlah mata pada dua sisi yang berhadapan selalu 7. Berapa mata pada sisi yang berhadapan dengan sisi bermata 2?",
    opsi: { A: "3", B: "4", C: "5", D: "6" },
    kunci: "C",
    pembahasan:
      "Karena jumlah dua sisi berhadapan adalah 7, sisi lawan dari mata 2 bernilai 7 - 2 = 5. Dengan aturan yang sama, pasangan lainnya adalah 1 dengan 6 serta 3 dengan 4.",
  },
];
