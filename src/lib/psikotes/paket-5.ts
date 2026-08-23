import { EPPS_PAKET_5 } from "@/lib/psikotes/epps-lanjutan";
import type { PaketPsikotes, SoalSkor } from "@/lib/psikotes/tipe";

/**
 * Try Out Psikotes — Paket 5.
 *
 * Bertumpu pada kecepatan. Setiap butir sebenarnya dapat diselesaikan dalam
 * beberapa detik bila polanya sudah dikenali, sehingga yang dilatih di sini
 * adalah keputusan cepat: mengenali bentuk soal, memilih cara terpendek, lalu
 * berpindah tanpa berlama-lama.
 */

/* -------------------------------------------------------------------------- */
/*                    Sesi 1 — Tes Intelegensi Umum (TIU)                     */
/* -------------------------------------------------------------------------- */

const TIU_5: SoalSkor[] = [
  /* ------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari CERMAT adalah ...",
    opsi: { A: "Teliti", B: "Cepat", C: "Hemat", D: "Tegas" },
    kunci: "A",
    pembahasan:
      "Cermat berarti penuh perhatian dan tidak gegabah — persis makna teliti. Hemat menyangkut pemakaian barang atau uang, cepat menyangkut kecepatan, dan tegas menyangkut ketegasan sikap.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Lawan kata SEMENTARA adalah ...",
    opsi: { A: "Singkat", B: "Abadi", C: "Cepat", D: "Berkala" },
    kunci: "B",
    pembahasan:
      "Sementara berarti hanya berlaku untuk waktu yang terbatas, sehingga lawannya adalah abadi atau tetap. Singkat justru sejalan dengannya, dan berkala menyangkut perulangan, bukan lama berlakunya.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "JARUM : JAHIT = PENSIL : ...",
    opsi: { A: "Kertas", B: "Gambar", C: "Penghapus", D: "Tulis" },
    kunci: "D",
    pembahasan:
      "Hubungannya adalah alat dengan pekerjaan yang dilakukannya. Jarum dipakai menjahit, pensil dipakai menulis. Kertas adalah bahannya, gambar salah satu hasilnya, dan penghapus alat yang berbeda.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "IKAN : INSANG = MANUSIA : ...",
    opsi: { A: "Hidung", B: "Paru-paru", C: "Mulut", D: "Jantung" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah makhluk dengan alat pernapasannya. Ikan bernapas dengan insang, manusia dengan paru-paru. Hidung dan mulut hanya jalan masuk udara, sedangkan jantung mengedarkan darah.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan:
      "Semua peserta yang membawa kartu ujian boleh masuk ruang. Doni boleh masuk ruang. Kesimpulan yang PASTI benar adalah ...",
    opsi: {
      A: "Doni membawa kartu ujian",
      B: "Doni tidak membawa kartu ujian",
      C: "Doni bukan peserta ujian",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "D",
    pembahasan:
      "Pernyataan itu hanya menjamin arah 'membawa kartu → boleh masuk', bukan sebaliknya. Boleh masuk dapat saja terjadi karena alasan lain, misalnya membawa surat keterangan. Karena itu tidak ada kesimpulan yang pasti.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Tidak seorang pun anggota koperasi menunggak iuran. Semua pengurus kelas adalah anggota koperasi. Kesimpulannya ...",
    opsi: {
      A: "Sebagian pengurus kelas menunggak iuran",
      B: "Tidak seorang pun pengurus kelas menunggak iuran",
      C: "Semua yang tidak menunggak adalah pengurus kelas",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "B",
    pembahasan:
      "Seluruh pengurus kelas berada di dalam kelompok anggota koperasi, dan tidak satu pun anggota koperasi menunggak. Maka tidak seorang pun pengurus kelas menunggak. Pilihan C membalik arahnya secara keliru.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Kemarau", B: "Hujan", C: "Musim", D: "Pancaroba" },
    kunci: "C",
    pembahasan:
      "Kemarau, hujan, dan pancaroba adalah nama-nama musim. Musim adalah nama kelompoknya, bukan salah satu anggotanya, sehingga ia berada pada tingkatan yang berbeda.",
  },
  {
    nomor: 8,
    kategori: "Verbal",
    pertanyaan:
      'Makna ungkapan "Buah bibir" dalam kalimat "Prestasinya menjadi buah bibir warga" adalah ...',
    opsi: {
      A: "Hal yang ramai dibicarakan orang",
      B: "Hal yang dirahasiakan warga",
      C: "Hasil yang manis dan menyenangkan",
      D: "Pujian yang berlebihan",
    },
    kunci: "A",
    pembahasan:
      "Buah bibir berarti pokok pembicaraan orang banyak, tanpa memandang isinya baik atau buruk. Pilihan C tergoda oleh kata 'buah', padahal ungkapan ini tidak berkaitan dengan rasa manis.",
  },

  /* ------------------------------- Numerik ------------------------------- */
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 7, 14, 28, 56, ...",
    opsi: { A: "84", B: "98", C: "112", D: "126" },
    kunci: "C",
    pembahasan:
      "Setiap suku dua kali suku sebelumnya, sehingga 56 × 2 = 112. Jawaban 84 muncul bila polanya keliru dianggap penambahan 28.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 90, 45, 46, 23, 24, 12, ...",
    opsi: { A: "6", B: "11", C: "13", D: "24" },
    kunci: "C",
    pembahasan:
      "Aturannya berselang: dibagi dua, lalu ditambah satu. Dari 90 → 45 (bagi dua), 45 → 46 (tambah satu), 46 → 23, 23 → 24, 24 → 12, sehingga langkah berikutnya menambah satu: 12 + 1 = 13.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan: "Berapakah 12,5% dari 320?",
    opsi: { A: "32", B: "36", C: "40", D: "48" },
    kunci: "C",
    pembahasan:
      "12,5% sama dengan 1/8. Maka 320 ÷ 8 = 40. Mengubah persen menjadi pecahan sederhana jauh lebih cepat daripada mengalikan dengan 0,125.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah mobil menempuh 180 km dalam 2 jam 30 menit. Berapa kecepatan rata-ratanya?",
    opsi: { A: "60 km/jam", B: "68 km/jam", C: "72 km/jam", D: "90 km/jam" },
    kunci: "C",
    pembahasan:
      "Ubah waktunya menjadi 2,5 jam, lalu 180 ÷ 2,5 = 72 km/jam. Membagi dengan 2 saja akan memberi 90 km/jam, yaitu kesalahan yang paling sering terjadi pada soal semacam ini.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Jumlah dua bilangan 48 dan selisihnya 12. Berapa bilangan yang lebih kecil?",
    opsi: { A: "16", B: "18", C: "20", D: "24" },
    kunci: "B",
    pembahasan:
      "Bilangan yang lebih kecil adalah (jumlah - selisih) ÷ 2 = (48 - 12) ÷ 2 = 18. Pemeriksaan: 18 dan 30 berjumlah 48 dan berselisih 12.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah pekerjaan selesai dalam 9 hari oleh 8 orang. Bila 4 orang mengundurkan diri sebelum pekerjaan dimulai, berapa hari yang diperlukan?",
    opsi: { A: "12 hari", B: "15 hari", C: "18 hari", D: "20 hari" },
    kunci: "C",
    pembahasan:
      "Seluruh pekerjaan bernilai 8 × 9 = 72 hari-orang. Yang tersisa 4 orang, sehingga 72 ÷ 4 = 18 hari. Separuh pekerja berarti dua kali lipat waktunya.",
  },
  {
    nomor: 15,
    kategori: "Numerik",
    pertanyaan:
      "Harga sebuah tas naik dari Rp150.000 menjadi Rp180.000. Berapa persen kenaikannya?",
    opsi: { A: "15%", B: "16,7%", C: "20%", D: "30%" },
    kunci: "C",
    pembahasan:
      "Kenaikannya 30.000 dan dihitung dari harga lama, sehingga 30.000 ÷ 150.000 = 0,2 atau 20%. Membaginya dengan harga baru akan memberi 16,7%, yang merupakan persentase penurunan bila arahnya dibalik.",
  },
  {
    nomor: 16,
    kategori: "Numerik",
    pertanyaan:
      "Rata-rata empat bilangan adalah 25. Bila satu bilangan bernilai 40, berapa rata-rata tiga bilangan sisanya?",
    opsi: { A: "18", B: "20", C: "22", D: "24" },
    kunci: "B",
    pembahasan:
      "Jumlah keempat bilangan 4 × 25 = 100. Setelah dikurangi 40, sisanya 60 untuk tiga bilangan, sehingga rata-ratanya 60 ÷ 3 = 20.",
  },

  /* ------------------------------- Figural ------------------------------- */
  {
    nomor: 17,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["persegi", "persegi@45", "persegi@90", "?"],
    },
    opsi: {
      A: "Persegi diputar 135 derajat",
      B: "Persegi pada kedudukan semula",
      C: "Persegi terisi penuh",
      D: "Belah ketupat",
    },
    opsiFigur: {
      A: "persegi@135",
      B: "persegi",
      C: "persegi#penuh",
      D: "belahketupat",
    },
    kunci: "A",
    pembahasan:
      "Perputarannya tetap 45 derajat setiap langkah, sehingga sesudah 90 derajat menyusul 135 derajat. Bentuk maupun isinya tidak boleh ikut berubah.",
  },
  {
    nomor: 18,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["segitiga", "segitiga*2", "segitiga*3", "?"],
    },
    opsi: {
      A: "Empat segitiga",
      B: "Tiga segitiga terisi penuh",
      C: "Empat lingkaran",
      D: "Dua segitiga",
    },
    opsiFigur: {
      A: "segitiga*4",
      B: "segitiga*3#penuh",
      C: "lingkaran*4",
      D: "segitiga*2",
    },
    kunci: "A",
    pembahasan:
      "Hanya jumlahnya yang bertambah — satu, dua, tiga, lalu empat — sedangkan bentuk dan isinya tetap. Pilihan yang mengganti bentuk atau mengisi penuh mengubah hal yang seharusnya tidak berubah.",
  },
  {
    nomor: 19,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "belahketupat",
        "belahketupat#separuh",
        "belahketupat#penuh",
        "segienam",
        "segienam#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Segi enam bergaris",
      B: "Segi enam terisi penuh",
      C: "Belah ketupat terisi penuh",
      D: "Segi lima terisi penuh",
    },
    opsiFigur: {
      A: "segienam",
      B: "segienam#penuh",
      C: "belahketupat#penuh",
      D: "segilima#penuh",
    },
    kunci: "B",
    pembahasan:
      "Deret berjalan dalam dua kelompok bertiga; pada tiap kelompok satu bentuk diisi bertahap dari bergaris, separuh, lalu penuh. Kelompok kedua memakai segi enam dan baru sampai separuh.",
  },
  {
    nomor: 20,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["panah", "panah@90", "panah@180", "?"],
    },
    opsi: {
      A: "Panah mengarah ke atas",
      B: "Panah mengarah ke kanan",
      C: "Panah mengarah ke bawah",
      D: "Panah serong ke kanan-bawah",
    },
    opsiFigur: {
      A: "panah@270",
      B: "panah",
      C: "panah@90",
      D: "panah@45",
    },
    kunci: "A",
    pembahasan:
      "Panah berputar seperempat lingkaran pada setiap langkah: 0, 90, 180, lalu 270 derajat — yaitu mengarah ke atas. Pilihan ke kanan akan berarti kembali ke gambar pertama, yang baru terjadi satu langkah sesudahnya.",
  },
  {
    nomor: 21,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segitiga",
        "segitiga#separuh",
        "segitiga#penuh",
        "belahketupat",
        "belahketupat#separuh",
        "belahketupat#penuh",
        "bintang",
        "bintang#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Bintang bergaris",
      B: "Bintang terisi separuh",
      C: "Bintang terisi penuh",
      D: "Belah ketupat terisi penuh",
    },
    opsiFigur: {
      A: "bintang",
      B: "bintang#separuh",
      C: "bintang#penuh",
      D: "belahketupat#penuh",
    },
    kunci: "C",
    pembahasan:
      "Bentuk ditentukan barisnya dan isi ditentukan kolomnya. Sel yang ditanyakan berada di baris bintang dan kolom terisi penuh.",
  },
  {
    nomor: 22,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: ["lingkaran", "persegi", "lingkaran", "persegi", "?"],
    },
    opsi: { A: "Lingkaran", B: "Persegi", C: "Segitiga", D: "Bintang" },
    opsiFigur: {
      A: "lingkaran",
      B: "persegi",
      C: "segitiga",
      D: "bintang",
    },
    kunci: "A",
    pembahasan:
      "Deret berselang-seling antara dua bentuk saja. Kedudukan kelima adalah giliran lingkaran, karena kedudukan ganjil selalu ditempati lingkaran.",
  },
  {
    nomor: 23,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["bintang*4", "bintang*3", "bintang*2", "?"],
    },
    opsi: {
      A: "Satu bintang",
      B: "Dua bintang",
      C: "Satu bintang terisi penuh",
      D: "Satu lingkaran",
    },
    opsiFigur: {
      A: "bintang",
      B: "bintang*2",
      C: "bintang#penuh",
      D: "lingkaran",
    },
    kunci: "A",
    pembahasan:
      "Jumlahnya berkurang satu setiap langkah — empat, tiga, dua, lalu satu — sementara bentuk dan isinya tetap sepanjang deret.",
  },
  {
    nomor: 24,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "bintang",
        "persegi",
        "bintang",
        "persegi",
        "lingkaran",
        "persegi",
        "lingkaran",
        "?",
      ],
    },
    opsi: { A: "Lingkaran", B: "Bintang", C: "Persegi", D: "Segitiga" },
    opsiFigur: {
      A: "lingkaran",
      B: "bintang",
      C: "persegi",
      D: "segitiga",
    },
    kunci: "B",
    pembahasan:
      "Setiap baris memuat ketiga bentuk tepat satu kali, demikian pula setiap kolom. Baris ketiga sudah memuat persegi dan lingkaran, sehingga tersisa bintang — dan kolom ketiga memberi jawaban yang sama.",
  },
];

/* -------------------------------------------------------------------------- */
/*                  Sesi 2 — Tes Logika dan Penalaran Visual                  */
/* -------------------------------------------------------------------------- */

const VISUAL_5: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segienam",
        "segienam#separuh",
        "segienam#penuh",
        "silang",
        "silang#separuh",
        "silang#penuh",
        "belahketupat",
        "belahketupat#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Belah ketupat bergaris",
      B: "Belah ketupat terisi penuh",
      C: "Silang terisi penuh",
      D: "Belah ketupat terisi separuh",
    },
    opsiFigur: {
      A: "belahketupat",
      B: "belahketupat#penuh",
      C: "silang#penuh",
      D: "belahketupat#separuh",
    },
    kunci: "B",
    pembahasan:
      "Baris menentukan bentuk dan kolom menentukan isi. Sel yang ditanyakan berada di baris belah ketupat dan kolom terisi penuh.",
  },
  {
    nomor: 2,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: ["persegi", "segilima", "persegi", "segilima", "?"],
    },
    opsi: { A: "Persegi", B: "Segi lima", C: "Segi enam", D: "Segitiga" },
    opsiFigur: {
      A: "persegi",
      B: "segilima",
      C: "segienam",
      D: "segitiga",
    },
    kunci: "A",
    pembahasan:
      "Dua bentuk berselang-seling. Kedudukan ganjil selalu ditempati persegi, dan yang ditanyakan adalah kedudukan kelima.",
  },
  {
    nomor: 3,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["panah@270", "panah@315", "panah", "?"],
    },
    opsi: {
      A: "Panah serong ke kanan-bawah",
      B: "Panah mengarah ke bawah",
      C: "Panah mengarah ke kiri",
      D: "Panah mengarah ke atas",
    },
    opsiFigur: {
      A: "panah@45",
      B: "panah@90",
      C: "panah@180",
      D: "panah@270",
    },
    kunci: "A",
    pembahasan:
      "Panah berputar 45 derajat pada setiap langkah dengan arah tetap: atas, serong kanan-atas, kanan, lalu serong kanan-bawah.",
  },
  {
    nomor: 4,
    kategori: "Pencerminan",
    pertanyaan:
      "Panah yang mengarah ke atas dicerminkan terhadap garis mendatar. Ke arah manakah bayangannya menghadap?",
    stimulus: { kolom: 2, sel: ["panah@270", "?"] },
    opsi: {
      A: "Ke atas",
      B: "Ke bawah",
      C: "Ke kiri",
      D: "Ke kanan",
    },
    opsiFigur: {
      A: "panah@270",
      B: "panah@90",
      C: "panah@180",
      D: "panah",
    },
    kunci: "B",
    pembahasan:
      "Cermin mendatar menukar atas dengan bawah, sehingga panah yang menghadap atas berbalik menghadap bawah. Arah kiri dan kanan tidak tersentuh oleh pencerminan terhadap garis mendatar.",
  },
  {
    nomor: 5,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "lingkaran*2",
        "lingkaran*3",
        "segitiga",
        "segitiga*2",
        "segitiga*3",
        "persegi",
        "persegi*2",
        "?",
      ],
    },
    opsi: {
      A: "Dua persegi",
      B: "Tiga persegi",
      C: "Tiga segitiga",
      D: "Empat persegi",
    },
    opsiFigur: {
      A: "persegi*2",
      B: "persegi*3",
      C: "segitiga*3",
      D: "persegi*4",
    },
    kunci: "B",
    pembahasan:
      "Bentuk ditentukan barisnya dan jumlah ditentukan kolomnya: satu, dua, tiga. Sel yang ditanyakan berada di baris persegi dan kolom ketiga.",
  },
  {
    nomor: 6,
    kategori: "Analogi",
    pertanyaan:
      "Persegi berbanding persegi diputar 45 derajat, sebagaimana segitiga berbanding ...",
    stimulus: {
      kolom: 4,
      sel: ["persegi", "persegi@45", "segitiga", "?"],
    },
    opsi: {
      A: "Segitiga diputar 45 derajat",
      B: "Segitiga terisi penuh",
      C: "Segitiga diputar 90 derajat",
      D: "Belah ketupat",
    },
    opsiFigur: {
      A: "segitiga@45",
      B: "segitiga#penuh",
      C: "segitiga@90",
      D: "belahketupat",
    },
    kunci: "A",
    pembahasan:
      "Perubahan dari gambar pertama ke kedua hanyalah perputaran 45 derajat; bentuk dan isinya tidak diganti. Perubahan yang sama diterapkan pada segitiga.",
  },
  {
    nomor: 7,
    kategori: "Ketidaksamaan",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan tiga lainnya?",
    stimulus: {
      kolom: 4,
      sel: [
        "lingkaran#penuh",
        "segitiga#penuh",
        "persegi",
        "bintang#penuh",
      ],
    },
    opsi: {
      A: "Lingkaran terisi penuh",
      B: "Segitiga terisi penuh",
      C: "Persegi bergaris",
      D: "Bintang terisi penuh",
    },
    opsiFigur: {
      A: "lingkaran#penuh",
      B: "segitiga#penuh",
      C: "persegi",
      D: "bintang#penuh",
    },
    kunci: "C",
    pembahasan:
      "Tiga gambar lainnya sama-sama terisi penuh; hanya persegi yang dibiarkan bergaris. Bentuknya berbeda-beda pada keempat gambar, jadi bentuk bukan pembedanya.",
  },
  {
    nomor: 8,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "silang",
        "silang#separuh",
        "silang#penuh",
        "silang#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Silang bergaris",
      B: "Silang terisi separuh",
      C: "Silang terisi penuh",
      D: "Garis",
    },
    opsiFigur: {
      A: "silang",
      B: "silang#separuh",
      C: "silang#penuh",
      D: "garis",
    },
    kunci: "A",
    pembahasan:
      "Isinya bertambah lalu berkurang kembali seperti gerak bolak-balik: bergaris, separuh, penuh, separuh, lalu bergaris lagi.",
  },
  {
    nomor: 9,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["garis", "garis@30", "garis@60", "?"],
    },
    opsi: {
      A: "Garis diputar 90 derajat",
      B: "Garis diputar 120 derajat",
      C: "Garis mendatar",
      D: "Garis diputar 45 derajat",
    },
    opsiFigur: {
      A: "garis@90",
      B: "garis@120",
      C: "garis",
      D: "garis@45",
    },
    kunci: "A",
    pembahasan:
      "Garis berputar 30 derajat pada setiap langkah: 0, 30, 60, lalu 90 derajat. Pilihan 45 derajat memakai besar putaran yang lain, dan 120 derajat melompati satu langkah.",
  },
  {
    nomor: 10,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segitiga",
        "segienam",
        "bintang",
        "segienam",
        "bintang",
        "segitiga",
        "bintang",
        "segitiga",
        "?",
      ],
    },
    opsi: { A: "Segitiga", B: "Segi enam", C: "Bintang", D: "Persegi" },
    opsiFigur: {
      A: "segitiga",
      B: "segienam",
      C: "bintang",
      D: "persegi",
    },
    kunci: "B",
    pembahasan:
      "Setiap baris memuat ketiga bentuk tepat satu kali dan urutannya bergeser satu langkah pada baris berikutnya. Baris ketiga sudah memuat bintang dan segitiga, sehingga tersisa segi enam.",
  },
  {
    nomor: 11,
    kategori: "Pencerminan",
    pertanyaan:
      "Sebuah bangun dicerminkan dua kali terhadap garis tegak yang sama. Bagaimana kedudukan akhirnya?",
    opsi: {
      A: "Sama persis dengan bangun semula",
      B: "Terbalik kiri-kanan",
      C: "Terbalik atas-bawah",
      D: "Berputar 90 derajat",
    },
    kunci: "A",
    pembahasan:
      "Pencerminan yang diulang pada garis yang sama mengembalikan bangun ke kedudukan semula, karena penukaran kiri-kanan yang kedua membatalkan yang pertama.",
  },
  {
    nomor: 12,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "panah",
        "panah@90",
        "panah@180",
        "panah@90",
        "panah@180",
        "panah@270",
        "panah@180",
        "panah@270",
        "?",
      ],
    },
    opsi: {
      A: "Panah mengarah ke kanan",
      B: "Panah mengarah ke bawah",
      C: "Panah mengarah ke kiri",
      D: "Panah mengarah ke atas",
    },
    opsiFigur: {
      A: "panah",
      B: "panah@90",
      C: "panah@180",
      D: "panah@270",
    },
    kunci: "A",
    pembahasan:
      "Panah berputar 90 derajat ke arah kanan pada setiap langkah, baik dibaca menurut baris maupun menurut kolom. Sesudah 270 derajat, putaran berikutnya kembali ke 0 derajat, yaitu mengarah ke kanan.",
  },
];

/* -------------------------------------------------------------------------- */
/*                   Sesi 4 — Tes Kepribadian dan Emosi                       */
/* -------------------------------------------------------------------------- */

const EMOSI_5: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Pada sesi ujian, Anda menyadari waktu tinggal sepuluh menit sedangkan sepuluh soal belum terjawab. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengerjakan berurutan dari nomor terkecil sampai waktu habis",
      B: "Memindai seluruh sisa soal, mengerjakan yang paling cepat lebih dahulu, lalu mengisi sisanya",
      C: "Berhenti mengerjakan karena sudah tidak mungkin selesai",
      D: "Mengisi seluruhnya dengan huruf yang sama tanpa membaca",
    },
    kunci: "B",
    pembahasan:
      "Pada waktu yang tinggal sedikit, urutan pengerjaan menentukan berapa banyak soal yang sempat dijawab dengan benar. Pilihan A mengabaikan bahwa soal-soal terakhir mungkin justru lebih mudah, C menyerah sebelum waktunya habis, dan D membuang kesempatan pada soal yang sebenarnya masih terbaca.",
  },
  {
    nomor: 2,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Anda dituduh mengambil barang yang sebenarnya tidak Anda ambil. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Marah dan membalas tuduhan itu",
      B: "Diam karena percuma menjelaskan",
      C: "Menjelaskan duduk perkaranya dengan tenang dan meminta pemeriksaan bersama",
      D: "Mengaku saja agar persoalan cepat selesai",
    },
    kunci: "C",
    pembahasan:
      "Penjelasan yang tenang beserta permintaan pemeriksaan membuka jalan menemukan kebenarannya. Pilihan A memperkeruh, B membiarkan tuduhan mengendap, dan D mengorbankan kebenaran demi ketenangan sesaat.",
  },
  {
    nomor: 3,
    kategori: "Tanggung Jawab",
    pertanyaan:
      "Anda berjanji membantu panitia hari Sabtu, lalu diajak keluarga berlibur pada hari yang sama. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Ikut berlibur dan mengabari panitia setelah acara berlalu",
      B: "Memberitahukan panitia sesegera mungkin dan mencarikan penggantinya bila memang harus pergi",
      C: "Diam saja dan tidak datang",
      D: "Datang sebentar lalu pergi tanpa memberi tahu",
    },
    kunci: "B",
    pembahasan:
      "Memberi tahu lebih awal memberi panitia waktu menyesuaikan diri, dan mencarikan pengganti menutup lubang yang Anda tinggalkan. Pilihan A dan C melalaikan janji, sedangkan D meninggalkan pekerjaan tanpa serah terima.",
  },
  {
    nomor: 4,
    kategori: "Kejujuran",
    pertanyaan:
      "Nilai ulangan Anda tertulis lebih tinggi daripada yang seharusnya karena guru salah menjumlahkan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Memberitahukannya kepada guru agar diperbaiki",
      B: "Membiarkannya karena bukan Anda yang keliru",
      C: "Memberitahukannya hanya bila ada teman yang menanyakannya",
      D: "Menyimpannya dan berjanji memperbaiki nilai berikutnya",
    },
    kunci: "A",
    pembahasan:
      "Nilai yang keliru tetap keliru meski bukan Anda penyebabnya, dan membiarkannya berarti menerima sesuatu yang bukan hak Anda. Pilihan C menjadikan kejujuran bergantung pada ketahuan atau tidaknya, dan D menukar kekeliruan hari ini dengan janji yang belum tentu terjadi.",
  },
  {
    nomor: 5,
    kategori: "Menghadapi Kegagalan",
    pertanyaan:
      "Anda gagal pada percobaan pertama sebuah keterampilan yang baru dipelajari, sementara teman-teman sudah bisa. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Berhenti mencoba agar tidak ditertawakan",
      B: "Meminta teman menunjukkan bagian mana yang keliru lalu mengulangnya",
      C: "Mengatakan bahwa keterampilan itu tidak penting",
      D: "Mencoba terus tanpa bertanya sampai kebetulan berhasil",
    },
    kunci: "B",
    pembahasan:
      "Kegagalan pada percobaan pertama adalah bagian wajar dari belajar; yang menentukan adalah kesediaan mencari tahu letak kekeliruannya. Pilihan A berhenti terlalu dini, C meremehkan agar tidak perlu berusaha, dan D mengandalkan kebetulan.",
  },
  {
    nomor: 6,
    kategori: "Kepemimpinan",
    pertanyaan:
      "Regu Anda terbagi dua pendapat dan waktu rapat hampir habis. Sebagai ketua, langkah yang paling tepat adalah ...",
    opsi: {
      A: "Memilih pendapat yang sesuai dengan pendapat Anda sendiri",
      B: "Menunda keputusan sampai rapat berikutnya",
      C: "Merangkum kedua pendapat, meminta pertimbangan singkat, lalu memutuskan dan menjelaskan alasannya",
      D: "Menyerahkan keputusan kepada pembina",
    },
    kunci: "C",
    pembahasan:
      "Merangkum dan menjelaskan alasan membuat keputusan dapat diterima meski tidak semua setuju. Pilihan A memihak tanpa pertimbangan, B membiarkan pekerjaan tertunda, dan D melepaskan tanggung jawab yang memang melekat pada ketua.",
  },
  {
    nomor: 7,
    kategori: "Hubungan Sosial",
    pertanyaan:
      "Teman sekamar Anda sering memakai barang Anda tanpa izin. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menyembunyikan seluruh barang Anda",
      B: "Memakai barangnya juga tanpa izin",
      C: "Mengatakan langsung kepadanya bahwa Anda ingin dimintai izin lebih dahulu",
      D: "Mengeluhkannya kepada teman-teman lain",
    },
    kunci: "C",
    pembahasan:
      "Menyatakan keberatan langsung kepada orangnya adalah satu-satunya pilihan yang menyentuh sebabnya. Pilihan A menghindari tanpa menyelesaikan, B membalas dengan perbuatan yang sama, dan D membicarakannya di belakang.",
  },
  {
    nomor: 8,
    kategori: "Penyesuaian Diri",
    pertanyaan:
      "Jadwal asrama yang ketat membuat Anda kurang tidur pada pekan pertama. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Memakai waktu kegiatan untuk tidur",
      B: "Menyesuaikan jam tidur malam dan mengurangi kegiatan yang tidak perlu",
      C: "Meminta pengurangan jadwal kepada pengasuh",
      D: "Bertahan tanpa mengubah apa pun sampai terbiasa",
    },
    kunci: "B",
    pembahasan:
      "Yang dapat Anda ubah lebih dahulu adalah kebiasaan sendiri, bukan jadwal yang berlaku bagi semua. Pilihan A melanggar jadwal, C meminta perlakuan khusus sebelum berusaha menyesuaikan diri, dan D membiarkan kekurangan tidur berlarut sehingga justru mengganggu kegiatan.",
  },
  {
    nomor: 9,
    kategori: "Menerima Otoritas",
    pertanyaan:
      "Pembina memberi perintah yang menurut Anda kurang tepat, tetapi tidak membahayakan siapa pun. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menolak melaksanakannya",
      B: "Melaksanakannya, lalu menyampaikan pertimbangan Anda pada saat yang tepat",
      C: "Melaksanakannya sambil mengeluh kepada teman",
      D: "Mengabaikannya dan mengerjakan menurut cara Anda",
    },
    kunci: "B",
    pembahasan:
      "Melaksanakan lebih dahulu menjaga ketertiban, dan menyampaikan pertimbangan pada saat yang tepat menjaga kemungkinan perbaikan. Pilihan A dan D melanggar, sedangkan C menjalankan perintah tetapi menyebarkan ketidakpuasan tanpa menyampaikannya kepada yang berwenang.",
  },
  {
    nomor: 10,
    kategori: "Kerendahan Hati",
    pertanyaan:
      "Anda terpilih sebagai peserta terbaik, dan beberapa teman terlihat kecewa. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menceritakan keberhasilan Anda berulang kali",
      B: "Menyembunyikan hasilnya agar tidak ada yang tersinggung",
      C: "Menerimanya dengan wajar dan mengakui bantuan teman-teman dalam persiapannya",
      D: "Menolak penghargaan itu",
    },
    kunci: "C",
    pembahasan:
      "Menerima dengan wajar menghormati penilaian, sementara mengakui bantuan orang lain menjaga hubungan tetap baik. Pilihan A memancing kerenggangan, B menyangkal kenyataan, dan D membuang hasil kerja sendiri tanpa alasan.",
  },
  {
    nomor: 11,
    kategori: "Keberanian Moral",
    pertanyaan:
      "Anda melihat seorang teman diejek terus-menerus oleh kelompok lain. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Diam agar tidak ikut menjadi sasaran",
      B: "Menegur dengan baik, dan bila berlanjut melaporkannya kepada pembina",
      C: "Membalas ejekan mereka",
      D: "Menyarankan teman itu menjauhi mereka",
    },
    kunci: "B",
    pembahasan:
      "Menegur lebih dahulu memberi kesempatan berhenti, dan melaporkan bila berlanjut menyerahkannya kepada yang berwenang menghentikan. Pilihan A membiarkan, C menambah perselisihan, dan D memindahkan beban kepada pihak yang justru dirugikan.",
  },
  {
    nomor: 12,
    kategori: "Evaluasi Diri",
    pertanyaan:
      "Nilai Anda pada satu mata pelajaran terus menurun tiga kali berturut-turut. Langkah yang paling tepat adalah ...",
    opsi: {
      A: "Menambah jam belajar untuk seluruh mata pelajaran",
      B: "Menelusuri jenis soal yang paling sering salah lalu memperbaikinya lebih dahulu",
      C: "Menganggap gurunya terlalu ketat menilai",
      D: "Menunggu ulangan berikutnya sambil berharap membaik",
    },
    kunci: "B",
    pembahasan:
      "Penurunan yang berulang biasanya berpangkal pada satu jenis soal tertentu; menemukannya membuat perbaikan menjadi tepat sasaran. Pilihan A menyebar tenaga tanpa arah, C memindahkan sebab ke luar diri, dan D menyerahkan hasil pada kebetulan.",
  },
];

/* -------------------------------------------------------------------------- */

export const PAKET_PSIKOTES_5: PaketPsikotes = {
  id: "psi-5",
  nomor: 5,
  nama: "Try Out Psikotes 5",
  deskripsi:
    "Paket kecepatan. Setiap butir dapat diselesaikan cepat begitu polanya dikenali, sehingga yang dilatih adalah keputusan cepat: kenali bentuk soal, pilih cara terpendek, lalu berpindah.",
  sesi: [
    {
      id: "tiu",
      jenis: "skor",
      nama: "Tes Intelegensi Umum (TIU)",
      ringkas: "Verbal, numerik, dan figural",
      petunjuk:
        "Kerjakan soal yang Anda yakini lebih dahulu, lalu kembali ke soal yang sulit. Tidak ada pengurangan nilai untuk jawaban salah, jadi tidak ada gunanya membiarkan soal kosong pada menit-menit terakhir.",
      durasiMenit: 20,
      soal: TIU_5,
    },
    {
      id: "visual",
      jenis: "skor",
      nama: "Tes Logika dan Penalaran Visual",
      ringkas: "Pola gambar dan simbol geometris",
      petunjuk:
        "Cari satu aturan yang berlaku untuk seluruh gambar, bukan yang hanya cocok untuk dua gambar pertama. Pada soal matriks, periksa polanya dari arah baris dan dari arah kolom — jawaban yang benar cocok dari kedua arah.",
      durasiMenit: 10,
      soal: VISUAL_5,
    },
    {
      id: "epps",
      jenis: "epps",
      nama: "Tes EPPS (Kecenderungan Pribadi)",
      ringkas: "Pasangan pernyataan, pilih yang paling menggambarkan diri",
      petunjuk:
        "Pilih pernyataan yang paling menggambarkan diri Anda apa adanya, bukan yang terdengar paling baik. Kedua pernyataan memang sama-sama positif — itu memang disengaja. Jawablah cepat sesuai kesan pertama.",
      durasiMenit: 18,
      pasangan: EPPS_PAKET_5,
    },
    {
      id: "emosi",
      jenis: "skor",
      nama: "Tes Kepribadian dan Emosi",
      ringkas: "Sikap menghadapi tekanan dan situasi sulit",
      petunjuk:
        "Setiap butir menggambarkan keadaan yang mungkin Anda temui di asrama atau di sekolah. Pilih tindakan yang paling tepat — bukan yang paling mudah, dan bukan pula yang paling keras.",
      durasiMenit: 10,
      soal: EMOSI_5,
    },
  ],
};
