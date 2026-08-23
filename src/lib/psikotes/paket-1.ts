import { EPPS_PAKET_1 } from "@/lib/psikotes/epps";
import type { PaketPsikotes, SoalSkor } from "@/lib/psikotes/tipe";

/**
 * Try Out Psikotes — Paket 1.
 *
 * Tingkat pengenalan: bentuk soalnya sudah menyerupai seleksi sesungguhnya,
 * tetapi langkah penyelesaiannya masih pendek. Dipakai untuk membiasakan diri
 * dengan empat jenis alat ukur sekaligus sebelum masuk paket yang lebih berat.
 */

/* -------------------------------------------------------------------------- */
/*                    Sesi 1 — Tes Intelegensi Umum (TIU)                     */
/* -------------------------------------------------------------------------- */

const TIU_1: SoalSkor[] = [
  /* ------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari KREDIBEL adalah ...",
    opsi: {
      A: "Dapat dipercaya",
      B: "Dapat diubah",
      C: "Dapat diukur",
      D: "Dapat dilihat",
    },
    kunci: "A",
    pembahasan:
      "Kredibel berarti dapat dipercaya atau dapat dipertanggungjawabkan; kata bendanya kredibilitas. Pilihan lain memakai imbuhan yang mirip tetapi maknanya berbeda: dapat diubah adalah fleksibel, dapat diukur adalah terukur, dan dapat dilihat adalah kasatmata.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Lawan kata SPORADIS adalah ...",
    opsi: {
      A: "Sesekali",
      B: "Menyebar luas",
      C: "Kerap dan teratur",
      D: "Tiba-tiba",
    },
    kunci: "C",
    pembahasan:
      "Sporadis berarti terjadi sesekali, tidak tentu waktunya, dan tersebar tidak merata. Lawannya adalah kejadian yang kerap dan teratur. Sesekali dan tiba-tiba justru sejalan dengan sporadis, bukan lawannya.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "TENTARA : SENJATA = PENULIS : ...",
    opsi: { A: "Buku", B: "Kertas", C: "Ide", D: "Pena" },
    kunci: "D",
    pembahasan:
      "Hubungannya adalah pelaku dengan alat yang dipakainya bekerja. Senjata adalah alat tentara, pena adalah alat penulis. Buku adalah hasil kerjanya, kertas adalah bahan, dan ide adalah isi pikirannya — ketiganya bukan alat.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "API : ASAP = HUJAN : ...",
    opsi: { A: "Awan", B: "Basah", C: "Payung", D: "Petir" },
    kunci: "B",
    pembahasan:
      "Hubungannya adalah sebab dengan akibat yang ditimbulkannya. Api menimbulkan asap, hujan menimbulkan basah. Awan justru penyebab hujan (arahnya terbalik), payung adalah alat menghadapinya, dan petir adalah gejala yang menyertai, bukan akibat hujan.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan:
      "Semua taruna mengikuti apel pagi. Sebagian taruna adalah anggota drumband. Kesimpulan yang pasti benar adalah ...",
    opsi: {
      A: "Semua anggota drumband mengikuti apel pagi",
      B: "Sebagian anggota drumband mengikuti apel pagi",
      C: "Semua peserta apel pagi adalah anggota drumband",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "B",
    pembahasan:
      "Sebagian taruna adalah anggota drumband, dan seluruh taruna mengikuti apel. Jadi pasti ada anggota drumband yang mengikuti apel — itulah kesimpulan sebagian. Pilihan A terlalu jauh: pernyataan tidak menjamin seluruh anggota drumband adalah taruna, sehingga mungkin ada anggota drumband dari luar.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Semua peserta yang lulus tes kesehatan boleh mengikuti tes akademik. Rudi tidak boleh mengikuti tes akademik. Kesimpulannya ...",
    opsi: {
      A: "Rudi lulus tes kesehatan",
      B: "Rudi belum mengikuti tes kesehatan",
      C: "Rudi tidak lulus tes kesehatan",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "C",
    pembahasan:
      "Lulus tes kesehatan selalu berakibat boleh ikut tes akademik. Karena akibat itu tidak terjadi pada Rudi, sebabnya juga tidak terjadi: Rudi tidak lulus tes kesehatan. Pilihan B menambahkan keterangan yang tidak ada di dalam soal — tidak lulus belum tentu berarti belum mengikuti.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Nakhoda", B: "Pilot", C: "Masinis", D: "Kapal" },
    kunci: "D",
    pembahasan:
      "Nakhoda, pilot, dan masinis adalah orang yang mengemudikan kendaraan. Kapal adalah kendaraannya, bukan pengemudinya, sehingga ia yang keluar dari kelompok. Perhatikan bahwa jenis kendaraannya berbeda-beda — itu bukan pembedanya.",
  },
  {
    nomor: 8,
    kategori: "Verbal",
    pertanyaan:
      'Makna ungkapan KAMBING HITAM dalam kalimat "Ia dijadikan kambing hitam atas kegagalan regunya" adalah ...',
    opsi: {
      A: "Orang yang dipersalahkan atas kesalahan orang lain",
      B: "Orang yang paling berjasa dalam kelompok",
      C: "Orang yang pendiam dan menyendiri",
      D: "Orang yang paling muda di dalam kelompok",
    },
    kunci: "A",
    pembahasan:
      "Kambing hitam adalah ungkapan untuk pihak yang dipersalahkan padahal kesalahannya bukan miliknya, atau bukan miliknya sendiri. Maknanya tidak ada hubungannya dengan warna, hewan, sifat pendiam, maupun usia.",
  },

  /* ------------------------------- Numerik ------------------------------- */
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 7, 10, 16, 28, ...",
    opsi: { A: "40", B: "46", C: "52", D: "56" },
    kunci: "C",
    pembahasan:
      "Selisih antarsuku adalah +3, +6, +12 — setiap selisih dua kali selisih sebelumnya. Selisih berikutnya +24, sehingga 28 + 24 = 52. Jawaban 40 muncul bila selisihnya dikira tetap +12.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 3, 7, 15, 31, ...",
    opsi: { A: "47", B: "63", C: "55", D: "65" },
    kunci: "B",
    pembahasan:
      "Setiap suku adalah suku sebelumnya dikali 2 lalu ditambah 1: 3 x 2 + 1 = 7, 7 x 2 + 1 = 15, 15 x 2 + 1 = 31. Maka 31 x 2 + 1 = 63. Cara lain: setiap suku adalah pangkat dua dikurangi 1, yaitu 4-1, 8-1, 16-1, 32-1, lalu 64-1.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Deret berikut tersusun dari dua deret berselang-seling: 5, 8, 6, 12, 7, 16, 8, ... Berapakah bilangan berikutnya?",
    opsi: { A: "20", B: "18", C: "24", D: "9" },
    kunci: "A",
    pembahasan:
      "Suku pada urutan ganjil membentuk 5, 6, 7, 8 yang bertambah 1. Suku pada urutan genap membentuk 8, 12, 16, ... yang bertambah 4. Bilangan yang diminta menempati urutan genap, jadi nilainya 16 + 4 = 20. Jawaban 9 keliru karena membaca deret ganjilnya.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Harga sebuah tas Rp150.000 dan mendapat potongan 20%. Berapa yang harus dibayar?",
    opsi: {
      A: "Rp110.000",
      B: "Rp120.000",
      C: "Rp125.000",
      D: "Rp130.000",
    },
    kunci: "B",
    pembahasan:
      "Potongan 20% berarti yang dibayar 80% dari harga: 80/100 x Rp150.000 = Rp120.000. Menghitung potongannya lebih dahulu memberi hasil yang sama: Rp150.000 - Rp30.000 = Rp120.000.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah pekerjaan selesai dalam 8 hari bila dikerjakan 6 orang. Bila dikerjakan 12 orang dengan kecepatan yang sama, berapa hari pekerjaan itu selesai?",
    opsi: { A: "4 hari", B: "3 hari", C: "6 hari", D: "16 hari" },
    kunci: "A",
    pembahasan:
      "Ini perbandingan berbalik nilai: pekerjanya bertambah, waktunya berkurang. Total pekerjaan 6 x 8 = 48 hari-orang, sehingga 48 : 12 = 4 hari. Jawaban 16 hari muncul bila perbandingannya dikira senilai.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Umur ayah tiga kali umur anaknya. Selisih umur keduanya 30 tahun. Berapa umur anak?",
    opsi: { A: "10 tahun", B: "12 tahun", C: "15 tahun", D: "20 tahun" },
    kunci: "C",
    pembahasan:
      "Misalkan umur anak x, maka umur ayah 3x. Selisihnya 3x - x = 2x = 30, sehingga x = 15. Periksa kembali: anak 15 tahun, ayah 45 tahun, selisihnya 30 tahun dan ayah tepat tiga kali umur anak.",
  },
  {
    nomor: 15,
    kategori: "Numerik",
    pertanyaan:
      "Nilai rata-rata empat ulangan adalah 78. Agar rata-rata lima ulangan menjadi 80, berapa nilai ulangan kelima?",
    opsi: { A: "82", B: "84", C: "86", D: "88" },
    kunci: "D",
    pembahasan:
      "Jumlah nilai empat ulangan adalah 4 x 78 = 312. Jumlah yang dibutuhkan untuk lima ulangan adalah 5 x 80 = 400. Selisihnya 400 - 312 = 88, itulah nilai ulangan kelima.",
  },
  {
    nomor: 16,
    kategori: "Numerik",
    pertanyaan: "Berapakah 35% dari 240?",
    opsi: { A: "72", B: "84", C: "78", D: "96" },
    kunci: "B",
    pembahasan:
      "Pecah menjadi bagian yang mudah dihitung: 10% dari 240 adalah 24, sehingga 30% adalah 72; 5% adalah setengah dari 10%, yaitu 12. Jumlahnya 72 + 12 = 84.",
  },

  /* ------------------------------- Figural ------------------------------- */
  {
    nomor: 17,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 5,
      sel: ["panah", "panah@45", "panah@90", "panah@135", "?"],
    },
    opsi: {
      A: "Panah mengarah ke atas",
      B: "Panah mengarah ke kiri",
      C: "Panah serong ke kiri-atas",
      D: "Panah mengarah ke bawah",
    },
    opsiFigur: { A: "panah@270", B: "panah@180", C: "panah@225", D: "panah@90" },
    kunci: "B",
    pembahasan:
      "Panah berputar 45 derajat searah jarum jam pada setiap langkah: kanan, serong kanan-bawah, bawah, serong kiri-bawah. Langkah berikutnya 45 derajat lagi, yaitu mengarah ke kiri. Jawaban ke atas melompat terlalu jauh, dan ke bawah adalah pengulangan gambar ketiga.",
  },
  {
    nomor: 18,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["bintang", "bintang*2", "bintang*3", "?"],
    },
    opsi: {
      A: "Tiga bintang bergaris",
      B: "Empat bintang terisi penuh",
      C: "Empat bintang bergaris",
      D: "Empat lingkaran bergaris",
    },
    opsiFigur: {
      A: "bintang*3",
      B: "bintang*4#penuh",
      C: "bintang*4",
      D: "lingkaran*4",
    },
    kunci: "C",
    pembahasan:
      "Yang berubah hanya jumlahnya: satu, dua, tiga, lalu empat. Bentuk dan cara pengisiannya tetap sama sepanjang deret. Karena itu jawaban yang mengubah isi menjadi penuh atau mengganti bentuk menjadi lingkaran ikut mengubah hal yang seharusnya tetap.",
  },
  {
    nomor: 19,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "segitiga",
        "segitiga#separuh",
        "segitiga#penuh",
        "lingkaran",
        "lingkaran#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Lingkaran bergaris",
      B: "Segitiga terisi penuh",
      C: "Persegi terisi penuh",
      D: "Lingkaran terisi penuh",
    },
    opsiFigur: {
      A: "lingkaran",
      B: "segitiga#penuh",
      C: "persegi#penuh",
      D: "lingkaran#penuh",
    },
    kunci: "D",
    pembahasan:
      "Deret ini berjalan dalam dua kelompok bertiga. Pada tiap kelompok, satu bentuk yang sama diisi bertahap: bergaris, terisi separuh, lalu terisi penuh. Kelompok kedua memakai lingkaran dan baru sampai separuh, jadi langkah berikutnya adalah lingkaran terisi penuh.",
  },
  {
    nomor: 20,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: { kolom: 4, sel: ["segienam", "segilima", "persegi", "?"] },
    opsi: { A: "Lingkaran", B: "Segitiga", C: "Segi enam", D: "Persegi" },
    opsiFigur: {
      A: "lingkaran",
      B: "segitiga",
      C: "segienam",
      D: "persegi",
    },
    kunci: "B",
    pembahasan:
      "Hitung jumlah sisinya: 6, 5, 4, sehingga bangun berikutnya bersisi 3, yaitu segitiga. Lingkaran keliru karena ia tidak bersisi lurus sama sekali — bukan bangun bersisi 3.",
  },
  {
    nomor: 21,
    kategori: "Figural",
    pertanyaan:
      "Gambar pertama berubah menjadi gambar kedua. Dengan perubahan yang sama, gambar ketiga akan menjadi ...",
    stimulus: {
      kolom: 4,
      sel: ["lingkaran", "lingkaran#penuh", "belahketupat", "?"],
    },
    opsi: {
      A: "Belah ketupat terisi separuh",
      B: "Persegi terisi penuh",
      C: "Belah ketupat terisi penuh",
      D: "Lingkaran terisi penuh",
    },
    opsiFigur: {
      A: "belahketupat#separuh",
      B: "persegi#penuh",
      C: "belahketupat#penuh",
      D: "lingkaran#penuh",
    },
    kunci: "C",
    pembahasan:
      "Perubahan dari gambar pertama ke kedua hanyalah pengisian: bentuknya tetap lingkaran, isinya berubah dari bergaris menjadi penuh. Perubahan yang sama pada belah ketupat menghasilkan belah ketupat terisi penuh. Jawaban B keliru karena ikut mengganti bentuknya.",
  },
  {
    nomor: 22,
    kategori: "Figural",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan ketiga lainnya?",
    opsi: {
      A: "Segitiga terisi penuh",
      B: "Segi lima bergaris",
      C: "Persegi terisi penuh",
      D: "Lingkaran terisi penuh",
    },
    opsiFigur: {
      A: "segitiga#penuh",
      B: "segilima",
      C: "persegi#penuh",
      D: "lingkaran#penuh",
    },
    kunci: "B",
    pembahasan:
      "Tiga gambar lainnya sama-sama terisi penuh; hanya segi lima yang dibiarkan bergaris. Jumlah sisi bukan pembedanya, sebab ketiga gambar lain pun berbeda-beda jumlah sisinya — bahkan salah satunya lingkaran yang tidak bersisi.",
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
    opsi: { A: "Persegi", B: "Lingkaran", C: "Belah ketupat", D: "Segitiga" },
    opsiFigur: {
      A: "persegi",
      B: "lingkaran",
      C: "belahketupat",
      D: "segitiga",
    },
    kunci: "D",
    pembahasan:
      "Setiap baris memuat lingkaran, segitiga, dan persegi dengan urutan yang digeser satu langkah ke kiri. Baris ketiga sudah memakai persegi dan lingkaran, jadi yang tersisa adalah segitiga. Pemeriksaan silang: dengan jawaban itu setiap kolom pun berisi ketiga bentuk tepat satu kali.",
  },
  {
    nomor: 24,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: [
        "segitiga#penuh",
        "segitiga@90#penuh",
        "segitiga@180#penuh",
        "?",
      ],
    },
    opsi: {
      A: "Segitiga penuh menghadap kanan",
      B: "Segitiga penuh menghadap atas",
      C: "Segitiga bergaris menghadap bawah",
      D: "Segitiga penuh menghadap bawah",
    },
    opsiFigur: {
      A: "segitiga@270#penuh",
      B: "segitiga#penuh",
      C: "segitiga@90",
      D: "segitiga@180#penuh",
    },
    kunci: "A",
    pembahasan:
      "Segitiga berputar 90 derajat searah jarum jam setiap langkah, sementara isinya tetap penuh. Setelah 180 derajat, langkah berikutnya adalah 270 derajat. Jawaban B adalah kembali ke gambar pertama, dan jawaban C mengubah isi yang seharusnya tidak berubah.",
  },
];

/* -------------------------------------------------------------------------- */
/*                  Sesi 2 — Tes Logika dan Penalaran Visual                  */
/* -------------------------------------------------------------------------- */

const VISUAL_1: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "lingkaran#separuh",
        "lingkaran#penuh",
        "segitiga",
        "segitiga#separuh",
        "segitiga#penuh",
        "persegi",
        "persegi#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Persegi bergaris",
      B: "Persegi terisi penuh",
      C: "Segitiga terisi penuh",
      D: "Persegi terisi separuh",
    },
    opsiFigur: {
      A: "persegi",
      B: "persegi#penuh",
      C: "segitiga#penuh",
      D: "persegi#separuh",
    },
    kunci: "B",
    pembahasan:
      "Dua aturan berjalan bersamaan: bentuk ditentukan barisnya (lingkaran, segitiga, persegi), sedangkan isi ditentukan kolomnya (bergaris, separuh, penuh). Sel yang ditanyakan berada di baris persegi dan kolom penuh, jadi jawabannya persegi terisi penuh.",
  },
  {
    nomor: 2,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: { kolom: 4, sel: ["panah", "panah@315", "panah@270", "?"] },
    opsi: {
      A: "Panah mengarah ke kiri",
      B: "Panah serong ke kiri-atas",
      C: "Panah serong ke kanan-bawah",
      D: "Panah mengarah ke atas",
    },
    opsiFigur: {
      A: "panah@180",
      B: "panah@225",
      C: "panah@45",
      D: "panah@270",
    },
    kunci: "B",
    pembahasan:
      "Panah berputar 45 derajat berlawanan arah jarum jam setiap langkah: kanan, serong kanan-atas, atas. Langkah berikutnya serong ke kiri-atas. Perhatikan arah putarannya — bila dikira searah jarum jam, jawabannya akan meleset ke sisi yang berlawanan.",
  },
  {
    nomor: 3,
    kategori: "Pencerminan",
    pertanyaan:
      "Gambar berikut dicerminkan terhadap garis MENDATAR di bawahnya. Bagaimana bayangannya?",
    stimulus: { kolom: 1, sel: ["panah@45"] },
    opsi: {
      A: "Panah serong ke kiri-bawah",
      B: "Panah serong ke kiri-atas",
      C: "Panah serong ke kanan-atas",
      D: "Panah serong ke kanan-bawah",
    },
    opsiFigur: {
      A: "panah@135",
      B: "panah@225",
      C: "panah@315",
      D: "panah@45",
    },
    kunci: "C",
    pembahasan:
      "Cermin mendatar menukar atas dengan bawah, sedangkan kiri dan kanan tetap. Panah yang semula serong ke kanan-bawah menjadi serong ke kanan-atas. Jawaban A dan B keliru karena ikut menukar kiri-kanan, itu pekerjaan cermin tegak.",
  },
  {
    nomor: 4,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["persegi", "persegi*2#penuh", "persegi*3", "?"],
    },
    opsi: {
      A: "Empat persegi bergaris",
      B: "Empat lingkaran terisi penuh",
      C: "Tiga persegi terisi penuh",
      D: "Empat persegi terisi penuh",
    },
    opsiFigur: {
      A: "persegi*4",
      B: "lingkaran*4#penuh",
      C: "persegi*3#penuh",
      D: "persegi*4#penuh",
    },
    kunci: "D",
    pembahasan:
      "Ada dua aturan sekaligus. Jumlahnya bertambah satu setiap langkah: 1, 2, 3, lalu 4. Isinya berselang-seling: bergaris, penuh, bergaris, sehingga giliran berikutnya penuh. Jawaban A benar jumlahnya tetapi salah isinya, jawaban C sebaliknya.",
  },
  {
    nomor: 5,
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
      "Panah berputar 90 derajat searah jarum jam setiap kali bergeser ke kanan, dan juga setiap kali turun satu baris. Dari panah ke atas (270 derajat), satu langkah lagi menjadi 360 derajat — yang sama artinya dengan kembali menghadap kanan.",
  },
  {
    nomor: 6,
    kategori: "Ketidaksamaan",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan ketiga lainnya?",
    opsi: {
      A: "Lingkaran terisi separuh",
      B: "Segitiga terisi separuh",
      C: "Segi lima terisi penuh",
      D: "Persegi terisi separuh",
    },
    opsiFigur: {
      A: "lingkaran#separuh",
      B: "segitiga#separuh",
      C: "segilima#penuh",
      D: "persegi#separuh",
    },
    kunci: "C",
    pembahasan:
      "Tiga gambar lainnya terisi tepat separuh; hanya segi lima yang terisi seluruhnya. Godaannya adalah memilih lingkaran karena ia satu-satunya yang tidak bersudut, tetapi bentuk memang sengaja dibuat berbeda-beda pada keempat pilihan sehingga ia bukan pembeda.",
  },
  {
    nomor: 7,
    kategori: "Analogi",
    pertanyaan:
      "Gambar pertama berubah menjadi gambar kedua. Dengan perubahan yang sama, gambar ketiga akan menjadi ...",
    stimulus: {
      kolom: 4,
      sel: ["segitiga", "segitiga*2", "lingkaran", "?"],
    },
    opsi: {
      A: "Tiga lingkaran",
      B: "Lingkaran terisi penuh",
      C: "Dua segitiga",
      D: "Dua lingkaran",
    },
    opsiFigur: {
      A: "lingkaran*3",
      B: "lingkaran#penuh",
      C: "segitiga*2",
      D: "lingkaran*2",
    },
    kunci: "D",
    pembahasan:
      "Perubahannya adalah penggandaan jumlah: satu segitiga menjadi dua segitiga, tanpa mengubah bentuk maupun isinya. Diterapkan pada lingkaran, hasilnya dua lingkaran. Jawaban A menambah terlalu banyak dan jawaban B mengubah isi yang seharusnya tetap.",
  },
  {
    nomor: 8,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: { kolom: 4, sel: ["garis", "garis@45", "garis@90", "?"] },
    opsi: {
      A: "Garis miring dari kiri-bawah ke kanan-atas",
      B: "Garis mendatar",
      C: "Garis tegak",
      D: "Garis miring dari kiri-atas ke kanan-bawah",
    },
    opsiFigur: {
      A: "garis@135",
      B: "garis",
      C: "garis@90",
      D: "garis@45",
    },
    kunci: "A",
    pembahasan:
      "Garis berputar 45 derajat searah jarum jam setiap langkah: mendatar, miring turun ke kanan, tegak. Langkah berikutnya menjadi miring naik ke kanan. Jawaban B dan C adalah pengulangan gambar yang sudah ada di dalam deret.",
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
        "lingkaran*2",
        "segitiga*2",
        "persegi*2",
        "lingkaran*3",
        "segitiga*3",
        "?",
      ],
    },
    opsi: {
      A: "Dua persegi",
      B: "Tiga persegi",
      C: "Tiga segitiga",
      D: "Tiga lingkaran",
    },
    opsiFigur: {
      A: "persegi*2",
      B: "persegi*3",
      C: "segitiga*3",
      D: "lingkaran*3",
    },
    kunci: "B",
    pembahasan:
      "Kolom menentukan bentuknya — lingkaran, segitiga, persegi — sedangkan baris menentukan jumlahnya, yaitu satu, dua, lalu tiga. Sel yang ditanyakan berada di kolom persegi dan baris ketiga, jadi jawabannya tiga persegi.",
  },
  {
    nomor: 10,
    kategori: "Pencerminan",
    pertanyaan:
      "Gambar berikut dicerminkan terhadap garis TEGAK di sampingnya. Bagaimana bayangannya?",
    stimulus: { kolom: 1, sel: ["panah@315"] },
    opsi: {
      A: "Panah serong ke kanan-bawah",
      B: "Panah serong ke kiri-bawah",
      C: "Panah serong ke kiri-atas",
      D: "Panah serong ke kanan-atas",
    },
    opsiFigur: {
      A: "panah@45",
      B: "panah@135",
      C: "panah@225",
      D: "panah@315",
    },
    kunci: "C",
    pembahasan:
      "Cermin tegak menukar kiri dengan kanan, sedangkan atas dan bawah tetap. Panah yang semula serong ke kanan-atas menjadi serong ke kiri-atas. Jawaban A dan B keliru karena ikut membalik atas-bawah, itu pekerjaan cermin mendatar.",
  },
  {
    nomor: 11,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "segienam#penuh",
        "segienam#separuh",
        "segienam",
        "segilima#penuh",
        "segilima#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Segi lima bergaris",
      B: "Segi enam bergaris",
      C: "Segi lima terisi penuh",
      D: "Persegi bergaris",
    },
    opsiFigur: {
      A: "segilima",
      B: "segienam",
      C: "segilima#penuh",
      D: "persegi",
    },
    kunci: "A",
    pembahasan:
      "Deret berjalan dalam dua kelompok bertiga, dan isinya berkurang bertahap: penuh, separuh, lalu bergaris. Kelompok kedua memakai segi lima dan baru sampai separuh, jadi langkah berikutnya adalah segi lima bergaris. Perhatikan bahwa arahnya berkurang, kebalikan dari pola yang biasa dijumpai.",
  },
  {
    nomor: 12,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "segitiga#separuh",
        "persegi#penuh",
        "segitiga",
        "persegi#separuh",
        "lingkaran#penuh",
        "persegi",
        "lingkaran#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Persegi terisi penuh",
      B: "Segitiga terisi separuh",
      C: "Lingkaran terisi penuh",
      D: "Segitiga terisi penuh",
    },
    opsiFigur: {
      A: "persegi#penuh",
      B: "segitiga#separuh",
      C: "lingkaran#penuh",
      D: "segitiga#penuh",
    },
    kunci: "D",
    pembahasan:
      "Dua aturan berjalan pada arah yang berbeda. Bentuk bergeser satu langkah pada setiap baris — baris ketiga berurutan persegi, lingkaran, segitiga. Isi ditentukan kolomnya: bergaris, separuh, penuh. Sel yang ditanyakan berada di kolom ketiga, jadi jawabannya segitiga terisi penuh.",
  },
];

/* -------------------------------------------------------------------------- */
/*                   Sesi 4 — Tes Kepribadian dan Emosi                       */
/* -------------------------------------------------------------------------- */

const EMOSI_1: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Penyesuaian Diri",
    pertanyaan:
      "Baru sepekan tinggal di asrama, Anda sangat rindu rumah sampai sulit tidur dan tidak berselera makan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Meminta izin pulang sampai perasaan itu membaik",
      B: "Memendamnya sendiri agar tidak dianggap lemah oleh teman",
      C: "Menceritakannya kepada pengasuh dan tetap menjalani seluruh kegiatan seperti biasa",
      D: "Menghubungi orang tua setiap malam supaya hati menjadi lega",
    },
    kunci: "C",
    pembahasan:
      "Rindu rumah pada pekan-pekan pertama adalah hal wajar, bukan tanda kelemahan. Yang dinilai adalah kemampuan mencari dukungan yang tepat tanpa meninggalkan kewajiban. Pilihan A menghindari sumber tekanan sehingga penyesuaian justru tertunda; B memendam beban dan menutup jalan bantuan sampai keluhannya membesar; D melegakan sesaat tetapi memperkuat ketergantungan sehingga proses menyesuaikan diri tidak pernah selesai.",
  },
  {
    nomor: 2,
    kategori: "Tanggung Jawab",
    pertanyaan:
      "Regu Anda kalah dalam lomba karena kesalahan yang Anda perbuat. Beberapa teman terlihat kecewa. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Meminta maaf, mengakui kesalahan itu, dan mengusulkan cara agar tidak terulang",
      B: "Menjelaskan bahwa kesalahan itu tidak sepenuhnya salah Anda",
      C: "Diam saja sampai suasana mereda dengan sendirinya",
      D: "Menunjukkan bahwa aturan lomba dari panitia memang membingungkan",
    },
    kunci: "A",
    pembahasan:
      "Mengakui kesalahan lalu menawarkan perbaikan menunjukkan tanggung jawab sekaligus menjaga keutuhan regu. Pilihan B dan D memindahkan beban ke pihak lain sehingga kepercayaan regu berkurang, sedangkan C membiarkan kekecewaan mengendap tanpa penyelesaian. Perhatikan bahwa yang dinilai bukan seberapa besar kesalahannya, melainkan bagaimana Anda menanggungnya.",
  },
  {
    nomor: 3,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Anda dihukum lari keliling lapangan karena regu terlambat berkumpul, padahal keterlambatan itu bukan karena Anda. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menolak menjalankan hukuman karena tidak adil bagi Anda",
      B: "Menjalankan hukuman sambil menggerutu kepada teman-teman",
      C: "Menjalankan hukuman dan memendam kekesalan itu sendirian",
      D: "Menjalankan hukuman, lalu menyampaikan duduk perkaranya kepada pembina setelah selesai",
    },
    kunci: "D",
    pembahasan:
      "Hukuman regu memang ditanggung bersama; menjalankannya lebih dahulu menunjukkan kesiapan menerima aturan. Setelah itu, menjelaskan duduk perkara pada waktu yang tepat adalah cara sehat menyalurkan keberatan. Pilihan A menantang aturan di saat yang salah, B menularkan kekesalan tanpa menyelesaikan apa pun, dan C menumpuk perasaan yang seharusnya bisa disampaikan baik-baik.",
  },
  {
    nomor: 4,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Menjelang ujian penting, Anda merasa cemas berlebihan sampai sulit berkonsentrasi membaca. Cara paling sehat menanganinya adalah ...",
    opsi: {
      A: "Berhenti belajar sampai perasaan tenang dengan sendirinya",
      B: "Memecah bahan menjadi bagian-bagian kecil, mengatur napas, lalu mulai dari yang paling mudah",
      C: "Belajar semalam suntuk supaya rasa cemasnya hilang",
      D: "Meyakinkan diri bahwa ujian itu sebenarnya tidak penting",
    },
    kunci: "B",
    pembahasan:
      "Cemas berlebihan mereda ketika tugas terasa dapat dikerjakan, dan memulai dari bagian termudah mengembalikan rasa mampu itu. Pilihan A menunggu sesuatu yang belum tentu datang; C menambah kelelahan sehingga cemasnya justru naik keesokan hari; D meredakan perasaan dengan mengecilkan kenyataan, yang membuat persiapan makin tertinggal.",
  },
  {
    nomor: 5,
    kategori: "Kejujuran",
    pertanyaan:
      "Anda mengetahui teman sekamar menyimpan telepon genggam yang dilarang dibawa ke asrama. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Membiarkannya karena itu urusan pribadi dia",
      B: "Ikut memakainya sesekali selama tidak ketahuan",
      C: "Mengingatkannya lebih dahulu, dan bila ia tetap melanggar, melaporkannya kepada pembina",
      D: "Menyebarkannya kepada teman-teman lain agar dia malu sendiri",
    },
    kunci: "C",
    pembahasan:
      "Pilihan C menegakkan aturan tanpa mengorbankan hubungan: teman diberi kesempatan memperbaiki diri, tetapi pelanggarannya tidak dibiarkan. Pilihan A dan B menjadikan Anda ikut menanggung pelanggaran itu, sedangkan D mempermalukan tanpa menyelesaikan masalah. Melapor langsung tanpa menegur bukanlah tindakan salah, hanya saja ia melewatkan cara yang lebih baik lebih dahulu.",
  },
  {
    nomor: 6,
    kategori: "Kepemimpinan",
    pertanyaan:
      "Anda ditunjuk memimpin regu, tetapi ada anggota yang lebih senior dan enggan menuruti pembagian tugas dari Anda. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menyerahkan kepemimpinan kepadanya agar tidak ada pertentangan",
      B: "Melaporkannya kepada pembina supaya ia ditegur",
      C: "Membiarkannya bekerja sendiri di luar pembagian tugas",
      D: "Mengajaknya bicara empat mata, meminta masukannya, lalu menegaskan kembali pembagian tugas",
    },
    kunci: "D",
    pembahasan:
      "Kepemimpinan yang dinilai adalah kemampuan merangkul tanpa kehilangan ketegasan. Berbicara empat mata menjaga wibawa kedua pihak, meminta masukan mengakui pengalamannya, dan penegasan tugas menjaga agar kepemimpinan tidak hilang. Pilihan A menyerahkan tanggung jawab yang sudah dipercayakan, B melompati penyelesaian yang bisa dilakukan sendiri, dan C membiarkan regu berjalan tanpa aturan.",
  },
  {
    nomor: 7,
    kategori: "Menghadapi Kegagalan",
    pertanyaan:
      "Anda gagal pada seleksi tahap pertama padahal sudah berlatih keras berbulan-bulan. Reaksi yang paling sehat adalah ...",
    opsi: {
      A: "Menerima rasa kecewa itu, mencari tahu bagian mana yang lemah, lalu menyusun latihan baru",
      B: "Berhenti mencoba karena mungkin memang tidak berbakat di bidang itu",
      C: "Menyalahkan penyelenggara yang dianggap tidak adil",
      D: "Berpura-pura tidak kecewa agar terlihat kuat di depan orang lain",
    },
    kunci: "A",
    pembahasan:
      "Ketahanan bukan berarti tidak merasa kecewa, melainkan tetap dapat bertindak meski kecewa. Pilihan A mengakui perasaan itu lalu mengubahnya menjadi langkah nyata. Pilihan B menyimpulkan bakat dari satu kegagalan; C memindahkan sebab ke luar diri sehingga tidak ada yang bisa diperbaiki; D menekan perasaan, dan perasaan yang ditekan biasanya muncul kembali dalam bentuk lain.",
  },
  {
    nomor: 8,
    kategori: "Pengelolaan Waktu",
    pertanyaan:
      "Tugas sekolah menumpuk sementara waktu yang tersisa tinggal sedikit. Langkah yang paling tepat adalah ...",
    opsi: {
      A: "Mengerjakan seluruh tugas yang paling mudah lebih dahulu",
      B: "Menyusun urutan berdasarkan tenggat dan bobotnya, lalu mengerjakan berurutan",
      C: "Begadang mengerjakan apa saja yang teringat lebih dahulu",
      D: "Meminta perpanjangan waktu untuk seluruh tugas sekaligus",
    },
    kunci: "B",
    pembahasan:
      "Ketika waktu terbatas, yang menentukan adalah urutan, bukan kecepatan. Menimbang tenggat sekaligus bobot memastikan tugas yang paling mendesak dan paling berpengaruh tidak terlewat. Pilihan A terasa melegakan tetapi menyisakan yang berat di saat tenaga sudah habis; C bekerja tanpa arah; D memindahkan masalah dan biasanya tidak dikabulkan seluruhnya.",
  },
  {
    nomor: 9,
    kategori: "Hubungan Sosial",
    pertanyaan:
      "Seorang teman menuduh Anda mengambil barangnya di depan teman-teman lain, padahal Anda tidak melakukannya. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Balik menuduh dia agar tahu rasanya dituduh",
      B: "Marah lalu tidak lagi menegurnya",
      C: "Menjelaskan dengan tenang bahwa Anda tidak melakukannya, lalu mengajaknya mencari barang itu bersama",
      D: "Diam saja karena menjelaskan pun percuma",
    },
    kunci: "C",
    pembahasan:
      "Menjawab tuduhan dengan tenang menunjukkan penguasaan diri, dan mengajak mencari bersama mengalihkan urusan dari saling menyalahkan menjadi menyelesaikan masalah. Pilihan A dan B membalas dengan sikap yang sama buruknya sehingga perselisihan meluas, sedangkan D membiarkan tuduhan itu dipercaya orang lain tanpa perlawanan.",
  },
  {
    nomor: 10,
    kategori: "Tanggung Jawab",
    pertanyaan:
      "Pembina meminta Anda mengerjakan tugas tambahan, padahal jadwal Anda sudah padat. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menerima tanpa berkata apa-apa lalu mengerjakannya seadanya",
      B: "Menolak karena jadwal Anda memang sudah penuh",
      C: "Menerima lalu diam-diam meminta teman mengerjakannya",
      D: "Menyampaikan jadwal Anda dengan sopan, menanyakan mana yang lebih didahulukan, lalu mengerjakan sesuai kesepakatan",
    },
    kunci: "D",
    pembahasan:
      "Menyanggupi sesuatu yang tidak dapat dikerjakan dengan baik bukanlah tanggung jawab, melainkan janji yang akan meleset. Menyampaikan keadaan sebenarnya lalu menanyakan prioritas menjaga agar hasilnya tetap layak. Pilihan A menghasilkan pekerjaan asal jadi, B menutup pintu tanpa mencari jalan tengah, dan C mengalihkan tanggung jawab kepada orang yang tidak diminta.",
  },
  {
    nomor: 11,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Pada latihan fisik yang berat, Anda merasa hampir tidak sanggup melanjutkan. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Berhenti diam-diam ketika pelatih sedang tidak melihat",
      B: "Melanjutkan sambil mengatur napas dan langkah, serta segera melapor bila muncul tanda bahaya seperti nyeri dada atau pandangan gelap",
      C: "Memaksakan diri sampai pingsan supaya dinilai kuat",
      D: "Berhenti dan menyatakan bahwa Anda memang tidak sanggup",
    },
    kunci: "B",
    pembahasan:
      "Ketahanan yang dinilai adalah bertahan sambil tetap mengenali batas tubuh sendiri. Pilihan A mengelabui, dan kebiasaan itu jauh lebih merugikan daripada rasa lelahnya. Pilihan C mengabaikan tanda bahaya sehingga membahayakan diri, bukan tanda kuat. Pilihan D menyerah sebelum benar-benar mencoba mengatur diri.",
  },
  {
    nomor: 12,
    kategori: "Menghadapi Kegagalan",
    pertanyaan:
      "Nilai Anda jauh di bawah rata-rata teman seangkatan. Sikap yang paling membangun adalah ...",
    opsi: {
      A: "Meminta penjelasan guru tentang letak kesalahan Anda, lalu menyusun rencana perbaikan",
      B: "Menghindari membicarakan nilai itu dengan siapa pun",
      C: "Terus membandingkan diri dengan teman yang nilainya tertinggi",
      D: "Menganggap nilai bukan hal yang penting",
    },
    kunci: "A",
    pembahasan:
      "Nilai rendah paling berguna bila diubah menjadi keterangan: bagian mana yang belum dikuasai. Pilihan B menutup jalan mendapatkan keterangan itu; C mengubah perbandingan menjadi tekanan tanpa memberi tahu apa yang harus diperbaiki; D meredakan perasaan dengan menyangkal kenyataan sehingga tidak ada perbaikan yang terjadi.",
  },
];

/* -------------------------------------------------------------------------- */

export const PAKET_PSIKOTES_1: PaketPsikotes = {
  id: "psi-1",
  nomor: 1,
  nama: "Try Out Psikotes 1",
  deskripsi:
    "Paket pengenalan. Bentuk soalnya sudah menyerupai seleksi sesungguhnya, tetapi langkah penyelesaiannya masih pendek sehingga cocok dikerjakan lebih dahulu.",
  sesi: [
    {
      id: "tiu",
      jenis: "skor",
      nama: "Tes Intelegensi Umum (TIU)",
      ringkas: "Verbal, numerik, dan figural",
      petunjuk:
        "Kerjakan soal yang Anda yakini lebih dahulu, lalu kembali ke soal yang sulit. Tidak ada pengurangan nilai untuk jawaban salah, jadi tidak ada gunanya membiarkan soal kosong pada menit-menit terakhir.",
      durasiMenit: 20,
      soal: TIU_1,
    },
    {
      id: "visual",
      jenis: "skor",
      nama: "Tes Logika dan Penalaran Visual",
      ringkas: "Pola gambar dan simbol geometris",
      petunjuk:
        "Cari satu aturan yang berlaku untuk seluruh gambar, bukan yang hanya cocok untuk dua gambar pertama. Pada soal matriks, periksa polanya dari arah baris dan dari arah kolom — jawaban yang benar cocok dari kedua arah.",
      durasiMenit: 10,
      soal: VISUAL_1,
    },
    {
      id: "epps",
      jenis: "epps",
      nama: "Tes EPPS (Kecenderungan Pribadi)",
      ringkas: "Pasangan pernyataan, pilih yang paling menggambarkan diri",
      petunjuk:
        "Pilih pernyataan yang paling menggambarkan diri Anda apa adanya, bukan yang terdengar paling baik. Kedua pernyataan memang sama-sama positif — itu memang disengaja. Jawablah cepat sesuai kesan pertama; jawaban yang terlalu lama dipikirkan justru menjauh dari keadaan sebenarnya.",
      durasiMenit: 18,
      pasangan: EPPS_PAKET_1,
    },
    {
      id: "emosi",
      jenis: "skor",
      nama: "Tes Kepribadian dan Emosi",
      ringkas: "Sikap menghadapi tekanan dan situasi sulit",
      petunjuk:
        "Setiap butir menggambarkan keadaan yang mungkin Anda temui di asrama atau di sekolah. Pilih tindakan yang paling tepat — bukan yang paling mudah, dan bukan pula yang paling keras.",
      durasiMenit: 10,
      soal: EMOSI_1,
    },
  ],
};
