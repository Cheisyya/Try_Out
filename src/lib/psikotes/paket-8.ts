import { EPPS_PAKET_8 } from "@/lib/psikotes/epps-lanjutan";
import type { PaketPsikotes, SoalSkor } from "@/lib/psikotes/tipe";

/**
 * Try Out Psikotes — Paket 8.
 *
 * Simulasi awal. Komposisi dan tingkat kesulitannya dibuat menyerupai
 * pelaksanaan seleksi: butir mudah dan berat berselang-seling, sehingga peserta
 * berlatih memilih urutan pengerjaan alih-alih menyelesaikan soal berurutan.
 */

/* -------------------------------------------------------------------------- */
/*                    Sesi 1 — Tes Intelegensi Umum (TIU)                     */
/* -------------------------------------------------------------------------- */

const TIU_8: SoalSkor[] = [
  /* ------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari RENOVASI adalah ...",
    opsi: { A: "Pembaruan", B: "Pembongkaran", C: "Perluasan", D: "Pemindahan" },
    kunci: "A",
    pembahasan:
      "Renovasi berarti memperbarui atau memperbaiki sesuatu agar kembali baik. Pembongkaran hanya merobohkan, perluasan menambah ukuran, dan pemindahan mengubah tempat.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Lawan kata SIMETRIS adalah ...",
    opsi: { A: "Seimbang", B: "Sebanding", C: "Asimetris", D: "Sejajar" },
    kunci: "C",
    pembahasan:
      "Simetris berarti kedua sisinya sama bila dilipat pada sumbunya; lawannya asimetris. Seimbang dan sebanding justru sejalan dengannya, sedangkan sejajar menyangkut kedudukan garis.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "KOMPOR : MEMASAK = GERGAJI : ...",
    opsi: { A: "Kayu", B: "Tukang", C: "Memotong", D: "Tajam" },
    kunci: "C",
    pembahasan:
      "Hubungannya adalah alat dengan pekerjaan yang dilakukannya. Kompor dipakai memasak, gergaji dipakai memotong. Kayu adalah bahannya, tukang pemakainya, dan tajam sifatnya.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "DOKTER : PASIEN = PENGACARA : ...",
    opsi: { A: "Hakim", B: "Klien", C: "Pengadilan", D: "Undang-undang" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah pemberi jasa dengan pihak yang dilayaninya. Dokter melayani pasien, pengacara melayani klien. Hakim adalah pihak lain di ruang sidang, dan pengadilan adalah tempatnya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan:
      "Semua yang mengikuti seleksi menyerahkan berkas. Sebagian yang menyerahkan berkas dinyatakan lengkap. Kesimpulan yang PASTI benar adalah ...",
    opsi: {
      A: "Semua peserta seleksi dinyatakan lengkap",
      B: "Sebagian peserta seleksi dinyatakan lengkap",
      C: "Sebagian yang menyerahkan berkas adalah peserta seleksi",
      D: "Semua yang dinyatakan lengkap adalah peserta seleksi",
    },
    kunci: "C",
    pembahasan:
      "Seluruh peserta seleksi berada di dalam kelompok yang menyerahkan berkas, sehingga pasti ada penyerah berkas yang merupakan peserta seleksi. Pilihan B belum tentu benar karena yang dinyatakan lengkap mungkin seluruhnya dari luar kelompok peserta seleksi.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Tidak seorang pun pelanggar aturan menerima piagam. Sebagian penerima piagam adalah ketua regu. Kesimpulannya ...",
    opsi: {
      A: "Sebagian ketua regu adalah pelanggar aturan",
      B: "Sebagian ketua regu bukan pelanggar aturan",
      C: "Semua ketua regu menerima piagam",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "B",
    pembahasan:
      "Sebagian ketua regu berada di dalam kelompok penerima piagam, dan tidak satu pun penerima piagam adalah pelanggar. Maka sebagian ketua regu itu pasti bukan pelanggar aturan.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Nadi", B: "Suhu", C: "Tekanan darah", D: "Stetoskop" },
    kunci: "D",
    pembahasan:
      "Nadi, suhu, dan tekanan darah adalah hal yang diperiksa pada tubuh. Stetoskop adalah alat pemeriksanya, sehingga ia berada pada tingkatan yang berbeda.",
  },
  {
    nomor: 8,
    kategori: "Verbal",
    pertanyaan:
      'Makna peribahasa "Bagai kacang lupa kulitnya" adalah ...',
    opsi: {
      A: "Melupakan asal-usul dan orang yang pernah berjasa",
      B: "Bekerja tanpa memikirkan hasilnya",
      C: "Menyembunyikan kemampuan sendiri",
      D: "Hidup sederhana meski berkecukupan",
    },
    kunci: "A",
    pembahasan:
      "Kacang yang melupakan kulitnya adalah kiasan bagi orang yang melupakan asal-usul dan jasa orang lain setelah ia berhasil. Pilihan D menunjuk sifat rendah hati, yang justru kebalikannya.",
  },

  /* ------------------------------- Numerik ------------------------------- */
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 3, 5, 9, 17, 33, ...",
    opsi: { A: "49", B: "57", C: "65", D: "66" },
    kunci: "C",
    pembahasan:
      "Setiap suku dua kali suku sebelumnya dikurangi satu: 3 × 2 - 1 = 5, 5 × 2 - 1 = 9, dan seterusnya. Maka 33 × 2 - 1 = 65. Selisihnya juga berlipat dua: 2, 4, 8, 16, lalu 32.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Berapakah hasil dari 0,25 × 48 + 0,5 × 24?",
    opsi: { A: "18", B: "24", C: "30", D: "36" },
    kunci: "B",
    pembahasan:
      "0,25 sama dengan seperempat, sehingga 0,25 × 48 = 12; 0,5 sama dengan separuh, sehingga 0,5 × 24 = 12. Jumlahnya 12 + 12 = 24.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah peta berskala 1 : 500.000. Berapa jarak sebenarnya bila jarak pada peta 6 cm?",
    opsi: { A: "3 km", B: "30 km", C: "300 km", D: "3.000 km" },
    kunci: "B",
    pembahasan:
      "Jarak sebenarnya 6 × 500.000 = 3.000.000 cm. Karena 1 km = 100.000 cm, hasilnya 3.000.000 ÷ 100.000 = 30 km. Kesalahan yang lazim adalah lupa mengubah sentimeter menjadi kilometer.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Seorang pedagang membeli 40 kg beras seharga Rp480.000 dan menjualnya Rp14.000 per kilogram. Berapa keuntungannya?",
    opsi: { A: "Rp60.000", B: "Rp70.000", C: "Rp80.000", D: "Rp100.000" },
    kunci: "C",
    pembahasan:
      "Hasil penjualannya 40 × 14.000 = 560.000, sedangkan modalnya 480.000. Keuntungannya 560.000 - 480.000 = 80.000.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah pekerjaan diselesaikan Ani dalam 4 jam dan Budi dalam 6 jam. Berapa lama bila keduanya bekerja bersama?",
    opsi: { A: "2 jam", B: "2,4 jam", C: "3 jam", D: "5 jam" },
    kunci: "B",
    pembahasan:
      "Dalam satu jam, Ani menyelesaikan 1/4 pekerjaan dan Budi 1/6, seluruhnya 3/12 + 2/12 = 5/12. Maka satu pekerjaan penuh selesai dalam 12/5 = 2,4 jam.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 100, 91, 83, 76, 70, ...",
    opsi: { A: "63", B: "64", C: "65", D: "66" },
    kunci: "C",
    pembahasan:
      "Selisih antarsuku adalah 9, 8, 7, 6 — berkurang satu tiap langkah — sehingga selisih berikutnya 5 dan 70 - 5 = 65.",
  },
  {
    nomor: 15,
    kategori: "Numerik",
    pertanyaan:
      "Jumlah umur kakak dan adik 34 tahun. Umur kakak 4 tahun lebih tua. Berapa umur adik?",
    opsi: { A: "13 tahun", B: "15 tahun", C: "17 tahun", D: "19 tahun" },
    kunci: "B",
    pembahasan:
      "Umur adik adalah (jumlah - selisih) ÷ 2 = (34 - 4) ÷ 2 = 15 tahun. Pemeriksaan: 15 dan 19 berjumlah 34 dan berselisih 4.",
  },
  {
    nomor: 16,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah tabungan berbunga 6% per tahun. Berapa bunga yang diterima dalam 8 bulan atas tabungan Rp1.200.000?",
    opsi: { A: "Rp36.000", B: "Rp48.000", C: "Rp72.000", D: "Rp96.000" },
    kunci: "B",
    pembahasan:
      "Bunga setahun 6% × 1.200.000 = 72.000. Untuk 8 bulan, dikalikan 8/12 = 2/3, sehingga 72.000 × 2/3 = 48.000. Melupakan perbandingan bulan akan memberi 72.000.",
  },

  /* ------------------------------- Figural ------------------------------- */
  {
    nomor: 17,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "persegi",
        "persegi#separuh",
        "persegi#penuh",
        "persegi#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Persegi bergaris",
      B: "Persegi terisi separuh",
      C: "Persegi terisi penuh",
      D: "Belah ketupat bergaris",
    },
    opsiFigur: {
      A: "persegi",
      B: "persegi#separuh",
      C: "persegi#penuh",
      D: "belahketupat",
    },
    kunci: "A",
    pembahasan:
      "Isinya bergerak bolak-balik: bergaris, separuh, penuh, separuh, lalu bergaris lagi. Bentuknya tidak pernah berganti sepanjang deret.",
  },
  {
    nomor: 18,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segienam",
        "segienam#separuh",
        "segienam#penuh",
        "panah",
        "panah#separuh",
        "panah#penuh",
        "belahketupat",
        "belahketupat#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Belah ketupat bergaris",
      B: "Belah ketupat terisi penuh",
      C: "Panah terisi penuh",
      D: "Belah ketupat terisi separuh",
    },
    opsiFigur: {
      A: "belahketupat",
      B: "belahketupat#penuh",
      C: "panah#penuh",
      D: "belahketupat#separuh",
    },
    kunci: "B",
    pembahasan:
      "Baris menentukan bentuk dan kolom menentukan isi. Sel yang ditanyakan berada di baris belah ketupat dan kolom terisi penuh.",
  },
  {
    nomor: 19,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["bintang", "bintang@72", "bintang@144", "?"],
    },
    opsi: {
      A: "Bintang diputar 216 derajat",
      B: "Bintang pada kedudukan semula",
      C: "Bintang diputar 180 derajat",
      D: "Bintang terisi penuh",
    },
    opsiFigur: {
      A: "bintang@216",
      B: "bintang",
      C: "bintang@180",
      D: "bintang#penuh",
    },
    kunci: "A",
    pembahasan:
      "Perputarannya tetap 72 derajat setiap langkah: 0, 72, 144, lalu 216 derajat. Pilihan 180 derajat memakai besar putaran yang lain.",
  },
  {
    nomor: 20,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: ["silang", "silang*2", "silang*3", "silang*4", "?"],
    },
    opsi: {
      A: "Satu silang",
      B: "Empat silang",
      C: "Tiga silang",
      D: "Empat garis",
    },
    opsiFigur: {
      A: "silang",
      B: "silang*4",
      C: "silang*3",
      D: "garis*4",
    },
    kunci: "A",
    pembahasan:
      "Jumlahnya bertambah sampai empat, lalu deret berputar kembali ke awal karena satu sel paling banyak memuat empat lambang. Pola berputar dikenali dari kembalinya deret ke bentuk semula.",
  },
  {
    nomor: 21,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["panah@45", "panah@135", "panah@225", "?"],
    },
    opsi: {
      A: "Panah serong ke kanan-atas",
      B: "Panah serong ke kanan-bawah",
      C: "Panah mengarah ke atas",
      D: "Panah mengarah ke kiri",
    },
    opsiFigur: {
      A: "panah@315",
      B: "panah@45",
      C: "panah@270",
      D: "panah@180",
    },
    kunci: "A",
    pembahasan:
      "Sudutnya bertambah 90 derajat setiap langkah: 45, 135, 225, lalu 315 derajat — yaitu serong ke kanan-atas. Pilihan serong kanan-bawah hanya mengulang gambar pertama.",
  },
  {
    nomor: 22,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "garis",
        "silang",
        "belahketupat",
        "silang",
        "belahketupat",
        "garis",
        "belahketupat",
        "garis",
        "?",
      ],
    },
    opsi: { A: "Garis", B: "Silang", C: "Belah ketupat", D: "Persegi" },
    opsiFigur: {
      A: "garis",
      B: "silang",
      C: "belahketupat",
      D: "persegi",
    },
    kunci: "B",
    pembahasan:
      "Setiap baris memuat ketiga lambang tepat satu kali, demikian pula setiap kolom. Baris ketiga sudah memuat belah ketupat dan garis, sehingga tersisa silang.",
  },
  {
    nomor: 23,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "lingkaran",
        "lingkaran#penuh",
        "segienam",
        "segienam#penuh",
        "bintang",
        "?",
      ],
    },
    opsi: {
      A: "Bintang terisi penuh",
      B: "Bintang bergaris",
      C: "Segi enam terisi penuh",
      D: "Lingkaran terisi penuh",
    },
    opsiFigur: {
      A: "bintang#penuh",
      B: "bintang",
      C: "segienam#penuh",
      D: "lingkaran#penuh",
    },
    kunci: "A",
    pembahasan:
      "Setiap bentuk muncul dua kali berturut-turut: sekali bergaris, sekali terisi penuh. Bintang baru muncul sekali dalam keadaan bergaris.",
  },
  {
    nomor: 24,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "persegi",
        "persegi*2",
        "persegi*4",
        "lingkaran",
        "lingkaran*2",
        "lingkaran*4",
        "silang",
        "silang*2",
        "?",
      ],
    },
    opsi: {
      A: "Tiga silang",
      B: "Empat silang",
      C: "Dua silang",
      D: "Empat lingkaran",
    },
    opsiFigur: {
      A: "silang*3",
      B: "silang*4",
      C: "silang*2",
      D: "lingkaran*4",
    },
    kunci: "B",
    pembahasan:
      "Jumlahnya berlipat dua pada setiap kolom: satu, dua, empat. Sel yang ditanyakan berada di baris silang dan kolom ketiga.",
  },
];

/* -------------------------------------------------------------------------- */
/*                  Sesi 2 — Tes Logika dan Penalaran Visual                  */
/* -------------------------------------------------------------------------- */

const VISUAL_8: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "belahketupat",
        "belahketupat@45",
        "belahketupat@90",
        "segilima",
        "segilima@45",
        "segilima@90",
        "bintang",
        "bintang@45",
        "?",
      ],
    },
    opsi: {
      A: "Bintang diputar 90 derajat",
      B: "Bintang pada kedudukan semula",
      C: "Bintang diputar 135 derajat",
      D: "Segi lima diputar 90 derajat",
    },
    opsiFigur: {
      A: "bintang@90",
      B: "bintang",
      C: "bintang@135",
      D: "segilima@90",
    },
    kunci: "A",
    pembahasan:
      "Bentuk ditentukan barisnya dan sudut putaran ditentukan kolomnya: 0, 45, lalu 90 derajat.",
  },
  {
    nomor: 2,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "segitiga",
        "segitiga@180",
        "segitiga",
        "segitiga@180",
        "?",
      ],
    },
    opsi: {
      A: "Segitiga tegak",
      B: "Segitiga terbalik",
      C: "Segitiga terisi penuh",
      D: "Persegi tegak",
    },
    opsiFigur: {
      A: "segitiga",
      B: "segitiga@180",
      C: "segitiga#penuh",
      D: "persegi",
    },
    kunci: "A",
    pembahasan:
      "Segitiga berbalik-balik setiap langkah. Kedudukan ganjil tegak dan kedudukan genap terbalik, sehingga kedudukan kelima kembali tegak.",
  },
  {
    nomor: 3,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["panah@180", "panah@90", "panah", "?"],
    },
    opsi: {
      A: "Panah mengarah ke atas",
      B: "Panah mengarah ke kiri",
      C: "Panah mengarah ke bawah",
      D: "Panah mengarah ke kanan",
    },
    opsiFigur: {
      A: "panah@270",
      B: "panah@180",
      C: "panah@90",
      D: "panah",
    },
    kunci: "A",
    pembahasan:
      "Sudutnya berkurang 90 derajat setiap langkah: 180, 90, 0, lalu -90 derajat — yang sama artinya dengan 270 derajat, yaitu mengarah ke atas.",
  },
  {
    nomor: 4,
    kategori: "Pencerminan",
    pertanyaan:
      "Sebuah panah serong kiri-bawah dicerminkan terhadap garis mendatar. Ke arah manakah bayangannya menghadap?",
    stimulus: { kolom: 2, sel: ["panah@135", "?"] },
    opsi: {
      A: "Serong kiri-atas",
      B: "Serong kanan-bawah",
      C: "Serong kanan-atas",
      D: "Tetap serong kiri-bawah",
    },
    opsiFigur: {
      A: "panah@225",
      B: "panah@45",
      C: "panah@315",
      D: "panah@135",
    },
    kunci: "A",
    pembahasan:
      "Cermin mendatar menukar atas dengan bawah sementara kiri-kanan tidak tersentuh. Panah yang serong ke kiri-bawah karena itu menjadi serong ke kiri-atas.",
  },
  {
    nomor: 5,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segitiga#penuh",
        "segitiga#separuh",
        "segitiga",
        "persegi#penuh",
        "persegi#separuh",
        "persegi",
        "bintang#penuh",
        "bintang#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Bintang bergaris",
      B: "Bintang terisi penuh",
      C: "Persegi bergaris",
      D: "Bintang terisi separuh",
    },
    opsiFigur: {
      A: "bintang",
      B: "bintang#penuh",
      C: "persegi",
      D: "bintang#separuh",
    },
    kunci: "A",
    pembahasan:
      "Isinya berkurang dari kiri ke kanan: penuh, separuh, lalu bergaris. Bentuknya ditentukan barisnya dan tidak berubah di dalam satu baris.",
  },
  {
    nomor: 6,
    kategori: "Analogi",
    pertanyaan:
      "Dua lingkaran berbanding empat lingkaran, sebagaimana dua segitiga berbanding ...",
    stimulus: {
      kolom: 4,
      sel: ["lingkaran*2", "lingkaran*4", "segitiga*2", "?"],
    },
    opsi: {
      A: "Tiga segitiga",
      B: "Empat segitiga",
      C: "Dua segitiga terisi penuh",
      D: "Empat lingkaran",
    },
    opsiFigur: {
      A: "segitiga*3",
      B: "segitiga*4",
      C: "segitiga*2#penuh",
      D: "lingkaran*4",
    },
    kunci: "B",
    pembahasan:
      "Perubahan dari gambar pertama ke kedua adalah pelipatgandaan jumlah menjadi dua kali, tanpa mengganti bentuk maupun isi. Perubahan yang sama diterapkan pada segitiga.",
  },
  {
    nomor: 7,
    kategori: "Ketidaksamaan",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan tiga lainnya?",
    stimulus: {
      kolom: 4,
      sel: ["segitiga@90", "persegi@90", "segilima@90", "bintang"],
    },
    opsi: {
      A: "Segitiga diputar",
      B: "Persegi diputar",
      C: "Segi lima diputar",
      D: "Bintang tidak diputar",
    },
    opsiFigur: {
      A: "segitiga@90",
      B: "persegi@90",
      C: "segilima@90",
      D: "bintang",
    },
    kunci: "D",
    pembahasan:
      "Tiga gambar lainnya sama-sama diputar 90 derajat; hanya bintang yang dibiarkan pada kedudukan semula. Bentuknya berbeda-beda, jadi bentuk bukan pembedanya.",
  },
  {
    nomor: 8,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "garis",
        "garis@45",
        "garis@90",
        "garis@135",
        "?",
      ],
    },
    opsi: {
      A: "Garis mendatar",
      B: "Garis tegak",
      C: "Garis serong kanan",
      D: "Garis serong kiri",
    },
    opsiFigur: {
      A: "garis",
      B: "garis@90",
      C: "garis@45",
      D: "garis@135",
    },
    kunci: "A",
    pembahasan:
      "Garis berputar 45 derajat setiap langkah sampai 180 derajat. Garis yang diputar setengah lingkaran kembali tampak mendatar seperti semula karena garis tidak berujung arah.",
  },
  {
    nomor: 9,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "lingkaran*3",
        "lingkaran*2",
        "persegi*2",
        "persegi",
        "persegi*3",
        "bintang*3",
        "bintang*2",
        "?",
      ],
    },
    opsi: {
      A: "Satu bintang",
      B: "Dua bintang",
      C: "Tiga bintang",
      D: "Empat bintang",
    },
    opsiFigur: {
      A: "bintang",
      B: "bintang*2",
      C: "bintang*3",
      D: "bintang*4",
    },
    kunci: "A",
    pembahasan:
      "Setiap baris memuat jumlah satu, dua, dan tiga tepat satu kali, demikian pula setiap kolom. Baris ketiga sudah memuat tiga dan dua, sehingga tersisa satu.",
  },
  {
    nomor: 10,
    kategori: "Rotasi",
    pertanyaan:
      "Sebuah bangun diputar 45 derajat searah jarum jam sebanyak empat kali. Berapa derajat perputaran seluruhnya?",
    opsi: { A: "90°", B: "135°", C: "180°", D: "360°" },
    kunci: "C",
    pembahasan:
      "Empat kali 45 derajat berjumlah 180 derajat, yaitu setengah putaran. Jawaban 360 derajat baru tercapai setelah delapan kali.",
  },
  {
    nomor: 11,
    kategori: "Pencerminan",
    pertanyaan:
      "Manakah bentuk yang bayangannya TETAP SAMA ketika dicerminkan terhadap garis mendatar?",
    stimulus: {
      kolom: 4,
      sel: ["segitiga", "belahketupat", "panah@270", "panah@45"],
    },
    opsi: {
      A: "Segitiga tegak",
      B: "Belah ketupat",
      C: "Panah ke atas",
      D: "Panah serong",
    },
    opsiFigur: {
      A: "segitiga",
      B: "belahketupat",
      C: "panah@270",
      D: "panah@45",
    },
    kunci: "B",
    pembahasan:
      "Belah ketupat memiliki sumbu simetri mendatar, sehingga bagian atas dan bawahnya sama dan bayangannya tidak berubah. Segitiga tegak berbalik menjadi terbalik, dan kedua panah berbalik arah.",
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
        "panah@45",
        "panah@90",
        "panah@45",
        "panah@90",
        "panah@135",
        "panah@90",
        "panah@135",
        "?",
      ],
    },
    opsi: {
      A: "Panah mengarah ke kiri",
      B: "Panah serong ke kiri-bawah",
      C: "Panah mengarah ke bawah",
      D: "Panah mengarah ke kanan",
    },
    opsiFigur: {
      A: "panah@180",
      B: "panah@135",
      C: "panah@90",
      D: "panah",
    },
    kunci: "A",
    pembahasan:
      "Sudutnya bertambah 45 derajat ke arah kanan maupun ke arah bawah, sehingga baris ketiga berjalan 90, 135, lalu 180 derajat. Kedua arah pembacaan memberi jawaban yang sama.",
  },
];

/* -------------------------------------------------------------------------- */
/*                   Sesi 4 — Tes Kepribadian dan Emosi                       */
/* -------------------------------------------------------------------------- */

const EMOSI_8: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Anda ditempatkan pada regu yang seluruh anggotanya belum Anda kenal, dan kegiatan dimulai besok. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menunggu sampai ada yang mengajak berkenalan",
      B: "Memperkenalkan diri lebih dahulu dan menanyakan pembagian tugasnya",
      C: "Meminta dipindahkan ke regu yang ada teman Anda",
      D: "Bekerja sendiri agar tidak merepotkan orang lain",
    },
    kunci: "B",
    pembahasan:
      "Memperkenalkan diri lebih dahulu memperpendek waktu yang biasanya terbuang pada hari pertama. Pilihan A menunggu, C menghindari penyesuaian, dan D menutup diri dari kerja sama yang justru menjadi tujuan pembentukan regu.",
  },
  {
    nomor: 2,
    kategori: "Kejujuran",
    pertanyaan:
      "Anda menyadari nilai tugas Anda diperoleh dari pekerjaan yang sebagian besar dikerjakan teman. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menerima nilainya karena nama Anda memang tercantum",
      B: "Menyampaikan kepada guru bagian mana yang benar-benar Anda kerjakan",
      C: "Berjanji mengerjakan lebih banyak pada tugas berikutnya",
      D: "Memberi hadiah kepada teman itu sebagai ucapan terima kasih",
    },
    kunci: "B",
    pembahasan:
      "Nilai seharusnya mencerminkan pekerjaan yang benar-benar dilakukan. Pilihan A menerima yang bukan hak, C menukar dengan janji, dan D menyelesaikan urusan pribadi tanpa memperbaiki penilaian yang keliru.",
  },
  {
    nomor: 3,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Anda ditegur di depan barisan atas kesalahan yang sebenarnya dilakukan orang lain. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membantah saat itu juga di depan barisan",
      B: "Menerima teguran saat itu, lalu menjelaskan duduk perkaranya seusai kegiatan",
      C: "Diam dan menyimpan kekesalan",
      D: "Menunjuk siapa pelakunya di depan semua orang",
    },
    kunci: "B",
    pembahasan:
      "Menahan diri saat itu menjaga jalannya kegiatan, dan menjelaskan sesudahnya memastikan kebenarannya tetap tersampaikan. Pilihan A dan D memperkeruh suasana di depan orang banyak, sedangkan C membiarkan kekeliruan itu tetap melekat pada Anda.",
  },
  {
    nomor: 4,
    kategori: "Tanggung Jawab",
    pertanyaan:
      "Anda memegang kunci ruang alat dan lupa menguncinya semalam. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Melapor pagi ini juga dan ikut memeriksa kelengkapan alat",
      B: "Menguncinya sekarang dan tidak mengatakan apa-apa",
      C: "Menunggu apakah ada alat yang hilang",
      D: "Menyerahkan kunci kepada orang lain",
    },
    kunci: "A",
    pembahasan:
      "Melapor dan memeriksa memungkinkan kehilangan diketahui selagi masih dapat ditelusuri. Pilihan B menutupi, C menunda sampai kerugiannya nyata, dan D melepaskan tanggung jawab tanpa menyelesaikan akibat kelalaian.",
  },
  {
    nomor: 5,
    kategori: "Kepemimpinan",
    pertanyaan:
      "Regu Anda tertinggal jauh dalam lomba dan anggotanya mulai kehilangan semangat. Sebagai ketua, langkah yang paling tepat adalah ...",
    opsi: {
      A: "Menyalahkan anggota yang paling lambat",
      B: "Menetapkan satu sasaran kecil yang masih dapat dicapai dan mengerjakannya bersama",
      C: "Mengatakan bahwa kemenangan tidak penting",
      D: "Menyerah agar tidak menghabiskan tenaga",
    },
    kunci: "B",
    pembahasan:
      "Sasaran kecil yang masih terjangkau mengembalikan rasa mampu dan menjaga regu tetap bergerak. Pilihan A melemahkan lebih jauh, C menyangkal tujuan yang sedang diperjuangkan, dan D menutup kemungkinan yang masih ada.",
  },
  {
    nomor: 6,
    kategori: "Menerima Otoritas",
    pertanyaan:
      "Anda diberi tugas yang menurut Anda seharusnya dikerjakan orang lain. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menolak dan meminta tugas itu dialihkan",
      B: "Mengerjakannya, lalu menyampaikan pertimbangan mengenai pembagian tugas kepada yang berwenang",
      C: "Mengerjakannya asal-asalan sebagai tanda keberatan",
      D: "Meminta teman mengerjakannya untuk Anda",
    },
    kunci: "B",
    pembahasan:
      "Mengerjakan lebih dahulu menjaga pekerjaan tetap berjalan, dan menyampaikan pertimbangan membuka kemungkinan pembagian diperbaiki. Pilihan A dan D menolak dengan cara berbeda, sedangkan C merugikan pekerjaan sekaligus nama sendiri.",
  },
  {
    nomor: 7,
    kategori: "Hubungan Sosial",
    pertanyaan:
      "Anda mengetahui seorang teman menceritakan hal buruk tentang Anda kepada orang lain. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menanyakan langsung kepadanya dengan tenang",
      B: "Menceritakan hal buruk tentangnya juga",
      C: "Memutuskan hubungan tanpa penjelasan",
      D: "Mendiamkannya sampai ia menyadari kesalahannya",
    },
    kunci: "A",
    pembahasan:
      "Bertanya langsung memberi kesempatan memeriksa kebenaran kabar itu sebelum bertindak. Pilihan B membalas dengan perbuatan yang sama, sedangkan C dan D menghukum tanpa memastikan apa yang sebenarnya terjadi.",
  },
  {
    nomor: 8,
    kategori: "Pengelolaan Waktu",
    pertanyaan:
      "Anda menyanggupi tiga kegiatan yang jadwalnya ternyata bertabrakan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menghadiri semuanya sebentar-sebentar",
      B: "Menimbang mana yang paling terikat janji, memenuhinya, dan memberi tahu yang lain sedini mungkin",
      C: "Menghadiri yang paling menyenangkan",
      D: "Tidak menghadiri semuanya agar adil",
    },
    kunci: "B",
    pembahasan:
      "Ketika janji bertabrakan, yang menentukan adalah seberapa terikat janji itu dan seberapa cepat pihak lain diberi tahu. Pilihan A tidak memenuhi satu pun dengan sungguh-sungguh, C memilih menurut kesenangan, dan D merugikan semua pihak sekaligus.",
  },
  {
    nomor: 9,
    kategori: "Menghadapi Kegagalan",
    pertanyaan:
      "Hasil kerja Anda dikembalikan dengan banyak catatan perbaikan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membaca seluruh catatan, mengelompokkannya, lalu memperbaiki dari yang paling mendasar",
      B: "Memperbaiki hanya bagian yang mudah",
      C: "Mengulang pekerjaan dari awal tanpa membaca catatannya",
      D: "Menganggap penilai terlalu berlebihan",
    },
    kunci: "A",
    pembahasan:
      "Catatan yang banyak biasanya berakar pada beberapa kekeliruan mendasar; mengelompokkannya membuat perbaikan menjadi jauh lebih ringan. Pilihan B menyisakan kekeliruan yang penting, C membuang keterangan yang sudah tersedia, dan D menolak sebelum memeriksa.",
  },
  {
    nomor: 10,
    kategori: "Kepedulian",
    pertanyaan:
      "Seorang teman sekamar sering terbangun karena mimpi buruk dan tampak tidak nyenyak berhari-hari. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membiarkannya karena itu urusan pribadi",
      B: "Menanyakan keadaannya dan menyarankan berbicara dengan pengasuh atau petugas kesehatan",
      C: "Menceritakannya kepada teman-teman agar ramai-ramai menghiburnya",
      D: "Memindahkan tempat tidur Anda agar tidak terganggu",
    },
    kunci: "B",
    pembahasan:
      "Gangguan tidur yang berhari-hari melampaui yang dapat ditangani teman sekamar, sehingga mengarahkannya kepada pihak yang tepat adalah bantuan yang sesungguhnya. Pilihan A membiarkan, C membuka keadaannya tanpa izin, dan D mengurus kenyamanan diri sendiri.",
  },
  {
    nomor: 11,
    kategori: "Integritas",
    pertanyaan:
      "Anda diminta mengisi daftar kegiatan, dan menambahkan satu kegiatan yang tidak Anda ikuti akan membuat daftar Anda terlihat lebih baik. Sikap Anda ...",
    opsi: {
      A: "Menambahkannya karena tidak ada yang memeriksa",
      B: "Mengisinya apa adanya",
      C: "Menambahkannya lalu berusaha mengikuti kegiatan serupa kemudian",
      D: "Mengosongkan daftar agar tidak perlu memilih",
    },
    kunci: "B",
    pembahasan:
      "Daftar kegiatan hanya berguna bila isinya benar. Pilihan A dan C sama-sama mencantumkan yang belum terjadi, sedangkan D menghindari persoalan dengan menghilangkan keterangan yang justru diminta.",
  },
  {
    nomor: 12,
    kategori: "Kemauan Belajar",
    pertanyaan:
      "Anda selalu kesulitan pada satu jenis soal meskipun sudah banyak berlatih. Langkah yang paling tepat adalah ...",
    opsi: {
      A: "Menambah jumlah latihan soal jenis itu",
      B: "Meminta seseorang menjelaskan ulang konsep dasarnya sebelum menambah latihan",
      C: "Melewati jenis soal itu pada setiap ujian",
      D: "Menghafal jawaban soal-soal yang pernah keluar",
    },
    kunci: "B",
    pembahasan:
      "Latihan yang banyak tetapi tidak juga membuahkan hasil biasanya menandakan konsep dasarnya belum terpasang. Pilihan A menambah takaran tanpa memperbaiki dasarnya, C menyerah, dan D bergantung pada soal yang persis sama muncul kembali.",
  },
];

/* -------------------------------------------------------------------------- */

export const PAKET_PSIKOTES_8: PaketPsikotes = {
  id: "psi-8",
  nomor: 8,
  nama: "Try Out Psikotes 8",
  deskripsi:
    "Simulasi awal. Butir mudah dan berat berselang-seling seperti pada pelaksanaan seleksi, sehingga melatih pemilihan urutan pengerjaan.",
  sesi: [
    {
      id: "tiu",
      jenis: "skor",
      nama: "Tes Intelegensi Umum (TIU)",
      ringkas: "Verbal, numerik, dan figural",
      petunjuk:
        "Kerjakan soal yang Anda yakini lebih dahulu, lalu kembali ke soal yang sulit. Tidak ada pengurangan nilai untuk jawaban salah, jadi tidak ada gunanya membiarkan soal kosong pada menit-menit terakhir.",
      durasiMenit: 20,
      soal: TIU_8,
    },
    {
      id: "visual",
      jenis: "skor",
      nama: "Tes Logika dan Penalaran Visual",
      ringkas: "Pola gambar dan simbol geometris",
      petunjuk:
        "Cari satu aturan yang berlaku untuk seluruh gambar, bukan yang hanya cocok untuk dua gambar pertama. Pada soal matriks, periksa polanya dari arah baris dan dari arah kolom — jawaban yang benar cocok dari kedua arah.",
      durasiMenit: 10,
      soal: VISUAL_8,
    },
    {
      id: "epps",
      jenis: "epps",
      nama: "Tes EPPS (Kecenderungan Pribadi)",
      ringkas: "Pasangan pernyataan, pilih yang paling menggambarkan diri",
      petunjuk:
        "Pilih pernyataan yang paling menggambarkan diri Anda apa adanya, bukan yang terdengar paling baik. Kedua pernyataan memang sama-sama positif — itu memang disengaja. Jawablah cepat sesuai kesan pertama.",
      durasiMenit: 18,
      pasangan: EPPS_PAKET_8,
    },
    {
      id: "emosi",
      jenis: "skor",
      nama: "Tes Kepribadian dan Emosi",
      ringkas: "Sikap menghadapi tekanan dan situasi sulit",
      petunjuk:
        "Setiap butir menggambarkan keadaan yang mungkin Anda temui di asrama atau di sekolah. Pilih tindakan yang paling tepat — bukan yang paling mudah, dan bukan pula yang paling keras.",
      durasiMenit: 10,
      soal: EMOSI_8,
    },
  ],
};
