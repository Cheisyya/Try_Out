import { EPPS_PAKET_4 } from "@/lib/psikotes/epps-lanjutan";
import type { PaketPsikotes, SoalSkor } from "@/lib/psikotes/tipe";

/**
 * Try Out Psikotes — Paket 4.
 *
 * Penguatan setelah tiga paket pertama: bentuk soalnya sudah dikenal, tetapi
 * pengecohnya dibuat lebih dekat dengan jawaban benar sehingga peserta dituntut
 * membaca pilihan sampai habis sebelum memutuskan.
 */

/* -------------------------------------------------------------------------- */
/*                    Sesi 1 — Tes Intelegensi Umum (TIU)                     */
/* -------------------------------------------------------------------------- */

const TIU_4: SoalSkor[] = [
  /* ------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari TANGGUH adalah ...",
    opsi: { A: "Kukuh", B: "Kaku", C: "Keras", D: "Berat" },
    kunci: "A",
    pembahasan:
      "Tangguh berarti sukar dikalahkan dan kuat menahan keadaan berat; kukuh menyatakan hal yang sama. Kaku dan keras menyangkut sifat benda, sedangkan berat menyangkut bobot — ketiganya menyentuh kesan kuat tetapi bukan maknanya.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Lawan kata LAZIM adalah ...",
    opsi: { A: "Umum", B: "Ganjil", C: "Wajar", D: "Biasa" },
    kunci: "B",
    pembahasan:
      "Lazim berarti sudah biasa dan umum dijumpai, sehingga lawannya adalah ganjil dalam arti tidak biasa. Umum, wajar, dan biasa justru bersinonim dengan lazim.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "PADI : LUMBUNG = BUKU : ...",
    opsi: { A: "Penulis", B: "Rak", C: "Kertas", D: "Bacaan" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah benda dengan tempat penyimpanannya. Padi disimpan di lumbung, buku disimpan di rak. Penulis adalah pembuatnya, kertas bahannya, dan bacaan adalah jenisnya.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "OBAT : SEMBUH = PUPUK : ...",
    opsi: { A: "Tanah", B: "Petani", C: "Subur", D: "Tanaman" },
    kunci: "C",
    pembahasan:
      "Hubungannya adalah sarana dengan keadaan yang hendak dicapainya. Obat mengantar pada sembuh, pupuk mengantar pada subur. Tanah dan tanaman adalah sasaran pemakaiannya, bukan hasilnya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan:
      "Semua anggota regu inti mengikuti latihan tambahan. Rian tidak mengikuti latihan tambahan. Kesimpulannya ...",
    opsi: {
      A: "Rian anggota regu inti",
      B: "Rian bukan anggota regu inti",
      C: "Rian sedang sakit",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "B",
    pembahasan:
      "Menjadi anggota regu inti selalu berakibat mengikuti latihan tambahan. Karena akibat itu tidak berlaku pada Rian, sebabnya juga tidak berlaku. Pilihan C menambahkan alasan yang sama sekali tidak disebutkan.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Sebagian pengurus OSIS adalah anggota paskibra. Semua anggota paskibra pandai berbaris. Kesimpulan yang pasti benar adalah ...",
    opsi: {
      A: "Semua pengurus OSIS pandai berbaris",
      B: "Sebagian pengurus OSIS pandai berbaris",
      C: "Semua yang pandai berbaris adalah pengurus OSIS",
      D: "Tidak ada pengurus OSIS yang pandai berbaris",
    },
    kunci: "B",
    pembahasan:
      "Sebagian pengurus OSIS berada di dalam kelompok paskibra, dan seluruh anggota paskibra pandai berbaris. Maka sebagian pengurus OSIS itu pasti pandai berbaris. Pilihan A melompat karena pengurus OSIS di luar paskibra tidak dibicarakan.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Cangkul", B: "Sabit", C: "Sawah", D: "Bajak" },
    kunci: "C",
    pembahasan:
      "Cangkul, sabit, dan bajak adalah alat pertanian. Sawah adalah tempat alat-alat itu dipakai, bukan alatnya, sehingga ia yang keluar dari kelompok.",
  },
  {
    nomor: 8,
    kategori: "Verbal",
    pertanyaan:
      'Makna ungkapan "Naik daun" dalam kalimat "Namanya sedang naik daun" adalah ...',
    opsi: {
      A: "Sedang terkenal dan disukai orang banyak",
      B: "Sedang naik jabatan di tempat kerja",
      C: "Sedang beruntung dalam keuangan",
      D: "Sedang berada di tempat yang tinggi",
    },
    kunci: "A",
    pembahasan:
      "Naik daun berarti sedang menanjak ketenarannya dan banyak dibicarakan orang. Pilihan B menunjuk 'naik pangkat', dan C menunjuk 'sedang di atas angin' — keduanya ungkapan lain.",
  },

  /* ------------------------------- Numerik ------------------------------- */
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 4, 9, 16, 25, 36, ...",
    opsi: { A: "45", B: "47", C: "49", D: "56" },
    kunci: "C",
    pembahasan:
      "Deret ini adalah kuadrat 2, 3, 4, 5, 6 sehingga suku berikutnya 7² = 49. Dapat pula diperiksa lewat selisihnya: 5, 7, 9, 11 — bertambah dua tiap langkah — sehingga selisih berikutnya 13 dan 36 + 13 = 49.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 3, 6, 4, 12, 5, 24, 6, ...",
    opsi: { A: "7", B: "36", C: "48", D: "12" },
    kunci: "C",
    pembahasan:
      "Ada dua deret yang berselang. Suku ganjil 3, 4, 5, 6 bertambah satu; suku genap 6, 12, 24 dikalikan dua. Yang ditanyakan menempati urutan genap, jadi 24 × 2 = 48.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah kaus dijual Rp68.000 setelah potongan 15%. Berapa harga sebelum potongan?",
    opsi: { A: "Rp78.200", B: "Rp80.000", C: "Rp81.600", D: "Rp85.000" },
    kunci: "B",
    pembahasan:
      "Harga yang dibayar adalah 85% dari harga awal, sehingga harga awal = 68.000 ÷ 0,85 = 80.000. Menambahkan 15% pada 68.000 menghasilkan 78.200 dan itu keliru, sebab persentase potongan dihitung dari harga awal.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Perbandingan banyak siswa putra dan putri 4 : 5. Bila jumlah seluruhnya 216 orang, berapa siswa putri?",
    opsi: { A: "96", B: "108", C: "112", D: "120" },
    kunci: "D",
    pembahasan:
      "Jumlah bagiannya 4 + 5 = 9, sehingga satu bagian bernilai 216 ÷ 9 = 24 orang. Siswa putri menempati 5 bagian, yaitu 5 × 24 = 120 orang.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Empat orang menyelesaikan pekerjaan dalam 15 hari. Berapa hari yang diperlukan enam orang untuk pekerjaan yang sama?",
    opsi: { A: "8 hari", B: "10 hari", C: "12 hari", D: "22 hari" },
    kunci: "B",
    pembahasan:
      "Seluruh pekerjaan bernilai 4 × 15 = 60 hari-orang. Dengan enam orang, waktunya 60 ÷ 6 = 10 hari. Banyak pekerja dan lama pengerjaan berbanding terbalik.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Rata-rata nilai sepuluh siswa 72. Bila nilai seorang siswa yang mendapat 45 diperbaiki menjadi 85, berapa rata-rata yang baru?",
    opsi: { A: "74", B: "75", C: "76", D: "78" },
    kunci: "C",
    pembahasan:
      "Jumlah nilai bertambah 85 - 45 = 40. Dibagi sepuluh siswa, rata-rata naik 4, sehingga menjadi 72 + 4 = 76. Tidak perlu menghitung ulang seluruh jumlah nilainya.",
  },
  {
    nomor: 15,
    kategori: "Numerik",
    pertanyaan: "Berapakah 45% dari 180?",
    opsi: { A: "72", B: "76", C: "81", D: "90" },
    kunci: "C",
    pembahasan:
      "Pecah menjadi bagian yang mudah: 10% dari 180 adalah 18, sehingga 40% adalah 72; 5% adalah separuh dari 10%, yaitu 9. Maka 45% = 72 + 9 = 81.",
  },
  {
    nomor: 16,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah bak terisi 2/5 bagian. Setelah ditambah 36 liter, bak terisi 4/5 bagian. Berapa isi penuh bak itu?",
    opsi: { A: "60 liter", B: "75 liter", C: "90 liter", D: "120 liter" },
    kunci: "C",
    pembahasan:
      "Selisih bagiannya 4/5 - 2/5 = 2/5 dan itu senilai 36 liter, sehingga 1/5 bagian = 18 liter. Isi penuhnya 5 × 18 = 90 liter.",
  },

  /* ------------------------------- Figural ------------------------------- */
  {
    nomor: 17,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: ["panah@90", "panah@135", "panah@180", "panah@225", "?"],
    },
    opsi: {
      A: "Panah mengarah ke atas",
      B: "Panah serong ke kanan-atas",
      C: "Panah mengarah ke bawah",
      D: "Panah mengarah ke kanan",
    },
    opsiFigur: {
      A: "panah@270",
      B: "panah@315",
      C: "panah@90",
      D: "panah",
    },
    kunci: "A",
    pembahasan:
      "Panah berputar 45 derajat pada setiap langkah dengan arah yang tetap. Setelah 225 derajat, langkah berikutnya 270 derajat, yaitu mengarah ke atas. Pilihan ke bawah hanya mengulang gambar pertama.",
  },
  {
    nomor: 18,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["lingkaran*4", "lingkaran*3", "lingkaran*2", "?"],
    },
    opsi: {
      A: "Satu lingkaran bergaris",
      B: "Dua lingkaran bergaris",
      C: "Satu lingkaran terisi penuh",
      D: "Satu persegi bergaris",
    },
    opsiFigur: {
      A: "lingkaran",
      B: "lingkaran*2",
      C: "lingkaran#penuh",
      D: "persegi",
    },
    kunci: "A",
    pembahasan:
      "Yang berubah hanya jumlahnya, dan arahnya berkurang: empat, tiga, dua, lalu satu. Bentuk dan cara pengisian tetap, sehingga jawaban yang mengubah isi atau bentuk ikut mengubah hal yang seharusnya tidak berubah.",
  },
  {
    nomor: 19,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "persegi",
        "persegi#separuh",
        "persegi#penuh",
        "bintang",
        "bintang#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Bintang bergaris",
      B: "Bintang terisi penuh",
      C: "Persegi terisi penuh",
      D: "Lingkaran terisi penuh",
    },
    opsiFigur: {
      A: "bintang",
      B: "bintang#penuh",
      C: "persegi#penuh",
      D: "lingkaran#penuh",
    },
    kunci: "B",
    pembahasan:
      "Deret berjalan dalam dua kelompok bertiga. Pada tiap kelompok, satu bentuk diisi bertahap: bergaris, separuh, lalu penuh. Kelompok kedua memakai bintang dan baru sampai separuh, jadi langkah berikutnya bintang terisi penuh.",
  },
  {
    nomor: 20,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: { kolom: 4, sel: ["segitiga", "persegi", "segilima", "?"] },
    opsi: { A: "Segi enam", B: "Lingkaran", C: "Segitiga", D: "Bintang" },
    opsiFigur: {
      A: "segienam",
      B: "lingkaran",
      C: "segitiga",
      D: "bintang",
    },
    kunci: "A",
    pembahasan:
      "Banyak sisinya bertambah satu pada setiap langkah: 3, 4, 5, lalu 6. Karena itu jawabannya segi enam. Lingkaran tidak bersisi sehingga tidak dapat melanjutkan pola cacah sisi.",
  },
  {
    nomor: 21,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["segitiga", "segitiga@90", "segitiga@180", "?"],
    },
    opsi: {
      A: "Segitiga pada kedudukan semula",
      B: "Segitiga diputar 270 derajat",
      C: "Segitiga terisi penuh",
      D: "Persegi diputar 270 derajat",
    },
    opsiFigur: {
      A: "segitiga",
      B: "segitiga@270",
      C: "segitiga#penuh",
      D: "persegi@270",
    },
    kunci: "B",
    pembahasan:
      "Segitiga berputar 90 derajat pada setiap langkah: 0, 90, 180, lalu 270. Pilihan A akan berarti kembali ke awal, yang baru terjadi satu langkah sesudahnya.",
  },
  {
    nomor: 22,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["silang", "silang*2", "silang*3", "?"],
    },
    opsi: {
      A: "Empat silang",
      B: "Tiga silang terisi penuh",
      C: "Empat garis",
      D: "Dua silang",
    },
    opsiFigur: { A: "silang*4", B: "silang*3#penuh", C: "garis*4", D: "silang*2" },
    kunci: "A",
    pembahasan:
      "Jumlah lambang bertambah satu setiap langkah sementara bentuknya tidak berubah, sehingga langkah keempat berisi empat silang. Mengganti bentuk menjadi garis mengubah hal yang seharusnya tetap.",
  },
  {
    nomor: 23,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "lingkaran#separuh",
        "lingkaran#penuh",
        "bintang",
        "bintang#separuh",
        "bintang#penuh",
        "segienam",
        "segienam#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Segi enam bergaris",
      B: "Segi enam terisi penuh",
      C: "Bintang terisi penuh",
      D: "Segi enam terisi separuh",
    },
    opsiFigur: {
      A: "segienam",
      B: "segienam#penuh",
      C: "bintang#penuh",
      D: "segienam#separuh",
    },
    kunci: "B",
    pembahasan:
      "Bentuk ditentukan barisnya dan isi ditentukan kolomnya. Sel yang ditanyakan berada di baris segi enam dan kolom terisi penuh, sehingga jawabannya segi enam terisi penuh.",
  },
  {
    nomor: 24,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: ["garis", "garis@45", "garis@90", "garis@135", "?"],
    },
    opsi: {
      A: "Garis mendatar",
      B: "Garis tegak",
      C: "Garis serong kanan",
      D: "Garis serong kiri",
    },
    opsiFigur: { A: "garis", B: "garis@90", C: "garis@45", D: "garis@135" },
    kunci: "A",
    pembahasan:
      "Garis berputar 45 derajat setiap langkah. Setelah 135 derajat, langkah berikutnya 180 derajat — dan garis yang diputar 180 derajat kembali tampak mendatar seperti semula, karena garis tidak berujung arah.",
  },
];

/* -------------------------------------------------------------------------- */
/*                  Sesi 2 — Tes Logika dan Penalaran Visual                  */
/* -------------------------------------------------------------------------- */

const VISUAL_4: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "persegi",
        "persegi#separuh",
        "persegi#penuh",
        "belahketupat",
        "belahketupat#separuh",
        "belahketupat#penuh",
        "segilima",
        "segilima#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Segi lima bergaris",
      B: "Segi lima terisi separuh",
      C: "Segi lima terisi penuh",
      D: "Belah ketupat terisi penuh",
    },
    opsiFigur: {
      A: "segilima",
      B: "segilima#separuh",
      C: "segilima#penuh",
      D: "belahketupat#penuh",
    },
    kunci: "C",
    pembahasan:
      "Baris menentukan bentuk, kolom menentukan isi. Sel yang ditanyakan berada di baris segi lima dan kolom terisi penuh.",
  },
  {
    nomor: 2,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: { kolom: 4, sel: ["panah@45", "panah@90", "panah@135", "?"] },
    opsi: {
      A: "Panah mengarah ke kiri",
      B: "Panah serong ke kiri-bawah",
      C: "Panah mengarah ke kanan",
      D: "Panah mengarah ke atas",
    },
    opsiFigur: {
      A: "panah@180",
      B: "panah@135",
      C: "panah",
      D: "panah@270",
    },
    kunci: "A",
    pembahasan:
      "Panah berputar 45 derajat pada setiap langkah dengan arah tetap: 45, 90, 135, lalu 180 derajat — yaitu mengarah ke kiri. Pilihan serong kiri-bawah hanya mengulang gambar ketiga.",
  },
  {
    nomor: 3,
    kategori: "Pencerminan",
    pertanyaan:
      "Sebuah bangun dicerminkan terhadap garis tegak. Manakah yang PASTI berubah?",
    opsi: {
      A: "Luas bangun",
      B: "Sisi kiri dan sisi kanan bertukar",
      C: "Banyak sisi bangun",
      D: "Panjang setiap sisinya",
    },
    kunci: "B",
    pembahasan:
      "Pencerminan tidak mengubah ukuran, panjang sisi, maupun banyak sisi — ia hanya menukar kedudukan kiri dengan kanan. Karena itu hanya pilihan B yang pasti berubah.",
  },
  {
    nomor: 4,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: [
        "segienam",
        "segienam#separuh",
        "segienam#penuh",
        "segienam#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Segi enam bergaris",
      B: "Segi enam terisi separuh",
      C: "Segi enam terisi penuh",
      D: "Lingkaran bergaris",
    },
    opsiFigur: {
      A: "segienam",
      B: "segienam#separuh",
      C: "segienam#penuh",
      D: "lingkaran",
    },
    kunci: "A",
    pembahasan:
      "Isinya bertambah lalu berkurang kembali seperti gerak bolak-balik: bergaris, separuh, penuh, separuh, lalu bergaris lagi. Bentuknya tidak pernah berganti sepanjang deret, sehingga pilihan yang mengganti bentuk langsung gugur.",
  },
  {
    nomor: 5,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "persegi",
        "segilima",
        "segienam",
        "segilima",
        "segienam",
        "persegi",
        "segienam",
        "persegi",
        "?",
      ],
    },
    opsi: { A: "Segi lima", B: "Segi enam", C: "Persegi", D: "Segitiga" },
    opsiFigur: {
      A: "segilima",
      B: "segienam",
      C: "persegi",
      D: "segitiga",
    },
    kunci: "A",
    pembahasan:
      "Setiap baris memuat ketiga bangun tepat satu kali, dan urutannya bergeser satu langkah ke kiri pada baris berikutnya. Baris ketiga sudah memuat segi enam dan persegi, sehingga yang tersisa adalah segi lima; kolom ketiga memberi jawaban yang sama.",
  },
  {
    nomor: 6,
    kategori: "Analogi",
    pertanyaan:
      "Lingkaran berbanding lingkaran terisi penuh, sebagaimana segitiga berbanding ...",
    stimulus: {
      kolom: 4,
      sel: ["lingkaran", "lingkaran#penuh", "segitiga", "?"],
    },
    opsi: {
      A: "Segitiga terisi separuh",
      B: "Segitiga terisi penuh",
      C: "Segitiga diputar",
      D: "Persegi terisi penuh",
    },
    opsiFigur: {
      A: "segitiga#separuh",
      B: "segitiga#penuh",
      C: "segitiga@180",
      D: "persegi#penuh",
    },
    kunci: "B",
    pembahasan:
      "Perubahan dari gambar pertama ke gambar kedua hanyalah pengisian penuh; bentuknya tidak diganti dan tidak diputar. Perubahan yang sama diterapkan pada segitiga.",
  },
  {
    nomor: 7,
    kategori: "Ketidaksamaan",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan tiga lainnya?",
    stimulus: {
      kolom: 4,
      sel: ["segitiga", "persegi", "segilima", "lingkaran"],
    },
    opsi: { A: "Segitiga", B: "Persegi", C: "Segi lima", D: "Lingkaran" },
    opsiFigur: {
      A: "segitiga",
      B: "persegi",
      C: "segilima",
      D: "lingkaran",
    },
    kunci: "D",
    pembahasan:
      "Segitiga, persegi, dan segi lima sama-sama bersisi lurus. Lingkaran tidak punya sisi maupun sudut, sehingga ia yang keluar dari kelompok. Banyak sisinya berbeda-beda, jadi cacah sisi bukan pembedanya.",
  },
  {
    nomor: 8,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["belahketupat", "belahketupat@45", "belahketupat@90", "?"],
    },
    opsi: {
      A: "Belah ketupat diputar 135 derajat",
      B: "Belah ketupat pada kedudukan semula",
      C: "Belah ketupat terisi penuh",
      D: "Persegi diputar 135 derajat",
    },
    opsiFigur: {
      A: "belahketupat@135",
      B: "belahketupat",
      C: "belahketupat#penuh",
      D: "persegi@135",
    },
    kunci: "A",
    pembahasan:
      "Perputarannya tetap 45 derajat setiap langkah, sehingga sesudah 90 derajat menyusul 135 derajat. Bentuk dan isinya tidak boleh ikut berubah.",
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
        "segitiga",
        "persegi",
        "segitiga",
        "persegi",
        "lingkaran",
        "persegi",
        "lingkaran",
        "?",
      ],
    },
    opsi: { A: "Lingkaran", B: "Segitiga", C: "Persegi", D: "Bintang" },
    opsiFigur: {
      A: "lingkaran",
      B: "segitiga",
      C: "persegi",
      D: "bintang",
    },
    kunci: "B",
    pembahasan:
      "Setiap baris memuat ketiga bentuk tepat satu kali, demikian pula setiap kolom. Baris ketiga sudah memuat persegi dan lingkaran, sehingga yang tersisa adalah segitiga — dan kolom ketiga pun memberi jawaban yang sama.",
  },
  {
    nomor: 10,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "lingkaran#penuh",
        "lingkaran#separuh",
        "lingkaran",
        "segienam#penuh",
        "segienam#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Segi enam bergaris",
      B: "Segi enam terisi penuh",
      C: "Lingkaran bergaris",
      D: "Segi enam terisi separuh",
    },
    opsiFigur: {
      A: "segienam",
      B: "segienam#penuh",
      C: "lingkaran",
      D: "segienam#separuh",
    },
    kunci: "A",
    pembahasan:
      "Deret berjalan dalam dua kelompok bertiga, dan isinya berkurang bertahap: penuh, separuh, lalu bergaris. Kelompok kedua memakai segi enam dan baru sampai separuh, jadi langkah berikutnya segi enam bergaris.",
  },
  {
    nomor: 11,
    kategori: "Pencerminan",
    pertanyaan:
      "Panah mengarah ke kanan dicerminkan terhadap garis tegak. Ke arah manakah bayangannya menghadap?",
    stimulus: { kolom: 2, sel: ["panah", "?"] },
    opsi: {
      A: "Ke kanan",
      B: "Ke kiri",
      C: "Ke atas",
      D: "Ke bawah",
    },
    opsiFigur: {
      A: "panah",
      B: "panah@180",
      C: "panah@270",
      D: "panah@90",
    },
    kunci: "B",
    pembahasan:
      "Cermin tegak menukar kiri dengan kanan, sehingga panah yang menghadap kanan berbalik menghadap kiri. Arah atas dan bawah tidak tersentuh oleh pencerminan terhadap garis tegak.",
  },
  {
    nomor: 12,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "segitiga",
        "segitiga*2",
        "segitiga*3",
        "persegi",
        "persegi*2",
        "persegi*3",
        "bintang",
        "bintang*2",
        "?",
      ],
    },
    opsi: {
      A: "Dua bintang",
      B: "Tiga bintang",
      C: "Tiga persegi",
      D: "Empat bintang",
    },
    opsiFigur: {
      A: "bintang*2",
      B: "bintang*3",
      C: "persegi*3",
      D: "bintang*4",
    },
    kunci: "B",
    pembahasan:
      "Bentuk ditentukan barisnya dan jumlah ditentukan kolomnya: satu, dua, tiga. Sel yang ditanyakan berada di baris bintang dan kolom ketiga, sehingga jawabannya tiga bintang.",
  },
];

/* -------------------------------------------------------------------------- */
/*                   Sesi 4 — Tes Kepribadian dan Emosi                       */
/* -------------------------------------------------------------------------- */

const EMOSI_4: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Tanggung Jawab",
    pertanyaan:
      "Anda ditunjuk menjaga perlengkapan regu, tetapi sebuah alat hilang saat Anda meninggalkannya sebentar. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Melapor kepada pembina, menjelaskan kejadiannya, dan ikut mengganti",
      B: "Menunggu sampai ada yang menanyakan alat itu",
      C: "Menyalahkan teman yang mengajak Anda pergi",
      D: "Mengganti diam-diam agar tidak ada yang tahu",
    },
    kunci: "A",
    pembahasan:
      "Melapor lebih dahulu memungkinkan alat dicari selagi masih mungkin ditemukan, sekaligus menunjukkan kesediaan menanggung akibat. Pilihan B menunda sampai kerugiannya membesar, C memindahkan kesalahan, dan D menutupi kejadian sehingga pembina kehilangan keterangan yang ia perlukan.",
  },
  {
    nomor: 2,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Tiga tugas jatuh tempo pada hari yang sama dan Anda mulai panik. Langkah pertama yang paling tepat adalah ...",
    opsi: {
      A: "Mengerjakan yang paling mudah agar cepat merasa lega",
      B: "Menuliskan ketiganya, menaksir waktunya, lalu menentukan urutan pengerjaan",
      C: "Meminta penundaan untuk ketiga-tiganya",
      D: "Mengerjakan semuanya sekaligus secara bergantian",
    },
    kunci: "B",
    pembahasan:
      "Kepanikan biasanya bersumber dari beban yang belum terpetakan. Menuliskan dan menaksirnya mengubah beban itu menjadi rencana yang dapat dijalankan. Pilihan A memberi rasa lega sesaat tanpa menyentuh yang mendesak, C menyerahkan seluruh persoalan kepada orang lain, dan D memecah perhatian sehingga tidak ada yang tuntas.",
  },
  {
    nomor: 3,
    kategori: "Kejujuran",
    pertanyaan:
      "Anda menemukan lembar kunci jawaban yang tertinggal di meja guru sehari sebelum ujian. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengembalikannya kepada guru tanpa membacanya",
      B: "Membacanya sekilas lalu mengembalikannya",
      C: "Membiarkannya di tempat semula",
      D: "Memberitahukannya kepada teman sekelas",
    },
    kunci: "A",
    pembahasan:
      "Mengembalikan tanpa membaca menjaga keadilan ujian bagi semua peserta sekaligus memastikan lembar itu tidak jatuh ke tangan lain. Pilihan B sudah melanggar meski hanya sekilas, C membiarkan risikonya tetap terbuka, dan D menyebarkan pelanggaran.",
  },
  {
    nomor: 4,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Seorang teman berkali-kali memotong pembicaraan Anda dalam rapat. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Diam saja dan tidak lagi berbicara sepanjang rapat",
      B: "Memotong pembicaraannya balik agar ia merasakannya",
      C: "Menyampaikan dengan tenang bahwa Anda ingin menyelesaikan kalimat lebih dahulu",
      D: "Melaporkannya kepada pembina setelah rapat selesai",
    },
    kunci: "C",
    pembahasan:
      "Menyatakan keberatan dengan tenang menyelesaikan persoalan pada saat dan tempatnya, tanpa merusak jalannya rapat. Pilihan A membuang kesempatan menyampaikan pendapat, B membalas dengan perbuatan yang sama, dan D melompati langkah yang sebenarnya masih dapat diselesaikan sendiri.",
  },
  {
    nomor: 5,
    kategori: "Menghadapi Kegagalan",
    pertanyaan:
      "Anda tidak lolos seleksi tingkat sekolah padahal sudah berlatih berbulan-bulan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Meminta penilaian rinci agar tahu bagian mana yang perlu diperbaiki",
      B: "Berhenti mengikuti seleksi apa pun untuk sementara",
      C: "Menganggap penilaiannya tidak adil",
      D: "Berlatih dua kali lebih keras tanpa mengubah caranya",
    },
    kunci: "A",
    pembahasan:
      "Kegagalan menjadi berguna hanya bila diubah menjadi keterangan yang jelas. Pilihan B menutup kesempatan berikutnya, C menghentikan proses belajar sebelum dimulai, dan D menambah takaran tanpa memperbaiki arah — sehingga kekeliruan yang sama justru diperkuat.",
  },
  {
    nomor: 6,
    kategori: "Hubungan Sosial",
    pertanyaan:
      "Seorang teman baru di asrama selalu menyendiri dan jarang diajak bicara. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membiarkannya sampai ia sendiri yang mendekat",
      B: "Mengajaknya ikut kegiatan kecil bersama tanpa memaksanya",
      C: "Menanyakan di depan orang banyak mengapa ia menyendiri",
      D: "Melaporkan kepada pengasuh bahwa ia bermasalah",
    },
    kunci: "B",
    pembahasan:
      "Ajakan yang ringan dan tanpa paksaan membuka pintu tanpa membuatnya merasa disorot. Pilihan A membiarkan keadaan berlarut, C mempermalukannya di depan orang, dan D memberi label bermasalah pada sesuatu yang mungkin sekadar butuh waktu menyesuaikan diri.",
  },
  {
    nomor: 7,
    kategori: "Kepemimpinan",
    pertanyaan:
      "Sebagai ketua regu, Anda melihat satu anggota terus-menerus tidak menyelesaikan bagiannya. Langkah yang paling tepat adalah ...",
    opsi: {
      A: "Mengambil alih pekerjaannya agar tugas regu selesai",
      B: "Menegurnya di depan seluruh anggota agar jera",
      C: "Berbicara empat mata untuk mengetahui penyebabnya lalu menyepakati jalan keluar",
      D: "Mengeluarkannya dari pembagian tugas berikutnya",
    },
    kunci: "C",
    pembahasan:
      "Mencari sebab lebih dahulu memungkinkan penyelesaian yang tepat sasaran, dan berbicara empat mata menjaga harga dirinya. Pilihan A membuat persoalan berulang, B mempermalukan tanpa menyelesaikan sebab, dan D membuang anggota alih-alih memperbaikinya.",
  },
  {
    nomor: 8,
    kategori: "Kepatuhan",
    pertanyaan:
      "Aturan asrama melarang membawa alat masak ke kamar, tetapi banyak teman melanggarnya tanpa ketahuan. Sikap Anda ...",
    opsi: {
      A: "Ikut membawa karena semua orang melakukannya",
      B: "Tidak membawa, dan menyampaikan keberatan atas aturan itu melalui jalur yang tersedia bila memang memberatkan",
      C: "Tidak membawa tetapi ikut memakai milik teman",
      D: "Melaporkan seluruh teman yang membawa kepada pengasuh",
    },
    kunci: "B",
    pembahasan:
      "Menaati aturan sambil menyampaikan keberatan lewat jalur resmi menjaga ketertiban sekaligus membuka kemungkinan perbaikan. Pilihan A dan C sama-sama melanggar — memakai milik teman tidak membuat aturannya berubah — sedangkan D melompat ke pelaporan tanpa lebih dahulu menegur atau mengingatkan.",
  },
  {
    nomor: 9,
    kategori: "Pengelolaan Waktu",
    pertanyaan:
      "Anda terbiasa mengerjakan tugas pada malam sebelum dikumpulkan dan hasilnya sering kurang rapi. Langkah perbaikan yang paling tepat adalah ...",
    opsi: {
      A: "Tidur lebih larut agar waktu mengerjakan bertambah",
      B: "Memecah tugas menjadi bagian kecil dan menjadwalkannya sejak hari pertama",
      C: "Meminta bantuan teman untuk mengerjakan sebagian",
      D: "Mengurangi kegiatan lain sampai tugas selesai",
    },
    kunci: "B",
    pembahasan:
      "Persoalannya bukan kurangnya waktu melainkan penumpukan di akhir; memecah dan menjadwalkan menyentuh sebab itu langsung. Pilihan A menambah waktu dengan mengorbankan kesehatan, C memindahkan pekerjaan, dan D mengorbankan hal lain tanpa memperbaiki kebiasaannya.",
  },
  {
    nomor: 10,
    kategori: "Menerima Kritik",
    pertanyaan:
      "Guru menyebut tulisan Anda berbelit dan sulit dipahami. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Meminta contoh bagian yang berbelit lalu memperbaikinya",
      B: "Menjelaskan bahwa maksud Anda sebenarnya sudah jelas",
      C: "Berhenti menulis panjang agar tidak dikritik lagi",
      D: "Membandingkan tulisan Anda dengan tulisan teman yang juga berbelit",
    },
    kunci: "A",
    pembahasan:
      "Meminta contoh mengubah kritik yang umum menjadi bahan perbaikan yang jelas. Pilihan B menolak kritik dengan pembelaan, C menghindari persoalan dengan mengecilkan pekerjaan, dan D mengalihkan perhatian kepada orang lain.",
  },
  {
    nomor: 11,
    kategori: "Integritas",
    pertanyaan:
      "Teman satu regu mengajak Anda menandatangani daftar hadir untuknya karena ia terlambat. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menandatanganinya karena ia teman dekat",
      B: "Menolak, dan menyarankan ia menjelaskan keterlambatannya kepada petugas",
      C: "Menandatanganinya lalu memberitahukannya kepada petugas",
      D: "Berpura-pura tidak mendengar ajakannya",
    },
    kunci: "B",
    pembahasan:
      "Menolak sambil menunjukkan jalan yang benar menjaga kejujuran tanpa meninggalkan teman tanpa bantuan. Pilihan A dan C sama-sama memalsukan kehadiran, dan D menghindari persoalan tanpa menyelesaikannya.",
  },
  {
    nomor: 12,
    kategori: "Kepedulian",
    pertanyaan:
      "Anda melihat teman sekamar tidak makan sejak pagi dan tampak murung. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membiarkannya karena mungkin ia ingin sendiri",
      B: "Menanyakan keadaannya dan menawarkan menemani ke ruang makan",
      C: "Menceritakan keadaannya kepada teman-teman sekamar lain",
      D: "Memaksanya makan agar tidak sakit",
    },
    kunci: "B",
    pembahasan:
      "Bertanya dan menawarkan menemani menunjukkan kepedulian tanpa memaksa dan tanpa membuka keadaannya kepada orang lain. Pilihan A membiarkan tanda yang sudah terlihat, C membicarakannya di belakang, dan D memaksakan kehendak yang justru dapat menutup pembicaraan.",
  },
];

/* -------------------------------------------------------------------------- */

export const PAKET_PSIKOTES_4: PaketPsikotes = {
  id: "psi-4",
  nomor: 4,
  nama: "Try Out Psikotes 4",
  deskripsi:
    "Paket penguatan. Bentuk soalnya sudah dikenal, tetapi pengecohnya dibuat lebih dekat dengan jawaban benar sehingga setiap pilihan perlu dibaca sampai habis.",
  sesi: [
    {
      id: "tiu",
      jenis: "skor",
      nama: "Tes Intelegensi Umum (TIU)",
      ringkas: "Verbal, numerik, dan figural",
      petunjuk:
        "Kerjakan soal yang Anda yakini lebih dahulu, lalu kembali ke soal yang sulit. Tidak ada pengurangan nilai untuk jawaban salah, jadi tidak ada gunanya membiarkan soal kosong pada menit-menit terakhir.",
      durasiMenit: 20,
      soal: TIU_4,
    },
    {
      id: "visual",
      jenis: "skor",
      nama: "Tes Logika dan Penalaran Visual",
      ringkas: "Pola gambar dan simbol geometris",
      petunjuk:
        "Cari satu aturan yang berlaku untuk seluruh gambar, bukan yang hanya cocok untuk dua gambar pertama. Pada soal matriks, periksa polanya dari arah baris dan dari arah kolom — jawaban yang benar cocok dari kedua arah.",
      durasiMenit: 10,
      soal: VISUAL_4,
    },
    {
      id: "epps",
      jenis: "epps",
      nama: "Tes EPPS (Kecenderungan Pribadi)",
      ringkas: "Pasangan pernyataan, pilih yang paling menggambarkan diri",
      petunjuk:
        "Pilih pernyataan yang paling menggambarkan diri Anda apa adanya, bukan yang terdengar paling baik. Kedua pernyataan memang sama-sama positif — itu memang disengaja. Jawablah cepat sesuai kesan pertama.",
      durasiMenit: 18,
      pasangan: EPPS_PAKET_4,
    },
    {
      id: "emosi",
      jenis: "skor",
      nama: "Tes Kepribadian dan Emosi",
      ringkas: "Sikap menghadapi tekanan dan situasi sulit",
      petunjuk:
        "Setiap butir menggambarkan keadaan yang mungkin Anda temui di asrama atau di sekolah. Pilih tindakan yang paling tepat — bukan yang paling mudah, dan bukan pula yang paling keras.",
      durasiMenit: 10,
      soal: EMOSI_4,
    },
  ],
};
