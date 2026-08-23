import { EPPS_PAKET_3 } from "@/lib/psikotes/epps";
import type { PaketPsikotes, SoalSkor } from "@/lib/psikotes/tipe";

/**
 * Try Out Psikotes — Paket 3.
 *
 * Tingkat paling berat. Deret numeriknya memakai perkalian bertingkat, soal
 * verbalnya menuntut ketelitian pada kata "jika dan hanya jika" serta ingkaran,
 * dan sebagian soal figuralnya menjalankan tiga sifat yang berubah bersamaan.
 */

/* -------------------------------------------------------------------------- */
/*                    Sesi 1 — Tes Intelegensi Umum (TIU)                     */
/* -------------------------------------------------------------------------- */

const TIU_3: SoalSkor[] = [
  /* ------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari EKSPLISIT adalah ...",
    opsi: {
      A: "Tersirat",
      B: "Rumit",
      C: "Tegas dan jelas",
      D: "Tersembunyi",
    },
    kunci: "C",
    pembahasan:
      "Eksplisit berarti dinyatakan secara tegas dan jelas, tanpa perlu ditafsirkan lagi. Lawannya adalah implisit, yang berarti tersirat. Pilihan A dan D justru mengarah ke makna implisit, sedangkan rumit tidak berkaitan dengan jelas atau tidaknya suatu pernyataan.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Lawan kata PROGRESIF adalah ...",
    opsi: { A: "Maju", B: "Modern", C: "Cepat", D: "Konservatif" },
    kunci: "D",
    pembahasan:
      "Progresif berarti cenderung berubah dan maju ke arah pembaruan. Lawannya adalah konservatif, yaitu cenderung mempertahankan keadaan yang sudah ada. Maju dan modern justru sejalan dengan progresif, sedangkan cepat berbicara tentang kecepatan, bukan arah perubahan.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "BENIH : TANAMAN = TELUR : ...",
    opsi: { A: "Ayam", B: "Cangkang", C: "Sarang", D: "Kandang" },
    kunci: "A",
    pembahasan:
      "Hubungannya adalah bakal dengan wujud dewasanya. Benih tumbuh menjadi tanaman, telur menetas menjadi ayam. Cangkang adalah bagian dari telur, sedangkan sarang dan kandang adalah tempat — bukan wujud yang dituju.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "KAMUS : KATA = ATLAS : ...",
    opsi: { A: "Buku", B: "Bumi", C: "Peta", D: "Negara" },
    kunci: "C",
    pembahasan:
      "Hubungannya adalah kumpulan dengan satuan yang dikumpulkannya. Kamus adalah kumpulan kata, atlas adalah kumpulan peta. Negara memang tergambar di dalam atlas, tetapi yang dikumpulkan atlas adalah petanya, bukan negaranya. Buku adalah bentuk fisiknya, bukan isinya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan:
      "Tidak ada taruna yang diperbolehkan merokok. Semua anggota tim basket adalah taruna. Kesimpulan yang pasti benar adalah ...",
    opsi: {
      A: "Semua anggota tim basket diperbolehkan merokok",
      B: "Tidak ada anggota tim basket yang diperbolehkan merokok",
      C: "Sebagian anggota tim basket diperbolehkan merokok",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "B",
    pembahasan:
      "Larangan itu berlaku bagi seluruh taruna tanpa kecuali, dan seluruh anggota tim basket termasuk taruna. Karena itu larangannya menurun utuh kepada mereka. Berbeda dengan soal berpola sebagian, di sini kata semua pada pernyataan kedua membuat kesimpulan boleh sekuat pernyataan pertamanya.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Seorang peserta diterima JIKA DAN HANYA JIKA ia lulus tes fisik dan lulus tes akademik. Doni lulus tes fisik tetapi tidak lulus tes akademik. Kesimpulannya ...",
    opsi: {
      A: "Doni diterima",
      B: "Doni mungkin diterima",
      C: "Tidak dapat ditarik kesimpulan",
      D: "Doni tidak diterima",
    },
    kunci: "D",
    pembahasan:
      "Syaratnya menuntut kedua hal terpenuhi sekaligus. Satu saja tidak terpenuhi, seluruh syaratnya gugur, sehingga Doni tidak diterima. Perhatikan kata jika dan hanya jika: ia menutup kemungkinan diterima lewat jalan lain, sehingga jawaban mungkin diterima tidak berlaku di sini.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Manakah kata yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Menyusut", B: "Meluas", C: "Mengecil", D: "Menciut" },
    kunci: "B",
    pembahasan:
      "Menyusut, mengecil, dan menciut sama-sama berarti berkurang ukurannya. Meluas berarti sebaliknya, yaitu bertambah besar, sehingga ia yang keluar dari kelompok. Kemiripan bunyi awalan me- pada keempat kata sengaja dipakai untuk mengaburkan perbedaan maknanya.",
  },
  {
    nomor: 8,
    kategori: "Verbal",
    pertanyaan: "Peribahasa AIR BERIAK TANDA TAK DALAM berarti ...",
    opsi: {
      A: "Masalah kecil dapat menimbulkan keributan besar",
      B: "Orang yang pendiam sulit dipercaya",
      C: "Orang yang banyak bicara biasanya dangkal ilmunya",
      D: "Air yang mengalir lebih bersih daripada air yang diam",
    },
    kunci: "C",
    pembahasan:
      "Air dangkal mudah beriak, air dalam justru tenang. Kiasannya: orang yang banyak bicara dan suka menonjolkan diri biasanya tidak dalam ilmunya. Pilihan D membacanya secara harfiah, padahal peribahasa selalu bermakna kiasan.",
  },

  /* ------------------------------- Numerik ------------------------------- */
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 1, 2, 6, 24, 120, ...",
    opsi: { A: "480", B: "600", C: "720", D: "840" },
    kunci: "C",
    pembahasan:
      "Pengalinya bertambah satu setiap langkah: 1 x 2 = 2, 2 x 3 = 6, 6 x 4 = 24, 24 x 5 = 120. Maka suku berikutnya adalah 120 x 6 = 720. Jawaban 480 muncul bila pengalinya dikira tetap 4.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 2, 5, 11, 23, 47, ...",
    opsi: { A: "94", B: "95", C: "93", D: "96" },
    kunci: "B",
    pembahasan:
      "Setiap suku adalah suku sebelumnya dikali 2 lalu ditambah 1: 2 x 2 + 1 = 5, 5 x 2 + 1 = 11, 11 x 2 + 1 = 23, 23 x 2 + 1 = 47. Maka 47 x 2 + 1 = 95. Jawaban 94 lupa menambahkan satu di akhir.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan:
      "Deret berikut tersusun dari dua deret berselang-seling: 100, 3, 90, 6, 80, 12, 70, ... Berapakah bilangan berikutnya?",
    opsi: { A: "24", B: "14", C: "18", D: "60" },
    kunci: "A",
    pembahasan:
      "Suku pada urutan ganjil berkurang 10 setiap langkah: 100, 90, 80, 70. Suku pada urutan genap justru berlipat dua: 3, 6, 12, lalu 24. Bilangan yang diminta menempati urutan genap. Jawaban 60 keliru karena melanjutkan deret ganjilnya.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 1, 8, 27, 64, ...",
    opsi: { A: "100", B: "216", C: "125", D: "81" },
    kunci: "C",
    pembahasan:
      "Deret ini adalah bilangan pangkat tiga: 1 x 1 x 1, 2 x 2 x 2, 3 x 3 x 3, 4 x 4 x 4. Suku kelima adalah 5 x 5 x 5 = 125. Jawaban 216 adalah pangkat tiga dari 6, melompat satu langkah terlalu jauh, sedangkan 81 adalah bilangan pangkat empat.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebanyak 40 liter larutan mengandung 25% garam. Berapa liter air murni yang harus ditambahkan agar kadar garamnya menjadi 20%?",
    opsi: { A: "10 liter", B: "5 liter", C: "8 liter", D: "12 liter" },
    kunci: "A",
    pembahasan:
      "Kuncinya: yang bertambah hanya airnya, jumlah garam tetap. Garam mula-mula 25% x 40 = 10 liter. Agar 10 liter itu menjadi 20% dari larutan, seluruh larutan harus 10 : 0,20 = 50 liter. Jadi air yang ditambahkan 50 - 40 = 10 liter.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah kendaraan berangkat dengan kecepatan 60 km/jam dan kembali melalui jalan yang sama dengan kecepatan 40 km/jam. Berapa kecepatan rata-rata untuk seluruh perjalanan?",
    opsi: {
      A: "50 km/jam",
      B: "48 km/jam",
      C: "45 km/jam",
      D: "52 km/jam",
    },
    kunci: "B",
    pembahasan:
      "Kecepatan rata-rata bukan rata-rata kedua kecepatan, melainkan jarak total dibagi waktu total. Ambil jarak sekali jalan 120 km: berangkat memakan 2 jam, pulang 3 jam. Jarak total 240 km dalam 5 jam, sehingga rata-ratanya 48 km/jam. Jawaban 50 km/jam adalah jebakan yang muncul bila kedua kecepatan langsung dirata-ratakan.",
  },
  {
    nomor: 15,
    kategori: "Numerik",
    pertanyaan:
      "Penduduk sebuah desa berjumlah 8.000 jiwa dan bertambah 5% setiap tahun. Berapa jumlah penduduknya setelah dua tahun?",
    opsi: { A: "8.400", B: "8.800", C: "8.820", D: "9.000" },
    kunci: "C",
    pembahasan:
      "Tahun pertama bertambah 5% dari 8.000, yaitu 400, sehingga menjadi 8.400. Tahun kedua bertambah 5% dari 8.400 — bukan dari 8.000 — yaitu 420, sehingga menjadi 8.820. Jawaban 8.800 muncul bila kenaikan tahun kedua tetap dihitung dari jumlah awal.",
  },
  {
    nomor: 16,
    kategori: "Numerik",
    pertanyaan:
      "Dari 8 orang calon akan dipilih seorang ketua dan seorang wakil ketua. Ada berapa cara pemilihan yang mungkin?",
    opsi: { A: "28 cara", B: "16 cara", C: "64 cara", D: "56 cara" },
    kunci: "D",
    pembahasan:
      "Ketua dapat dipilih dengan 8 cara, dan untuk setiap pilihan itu wakilnya tinggal 7 orang, sehingga 8 x 7 = 56 cara. Urutan berpengaruh di sini karena ketua dan wakil adalah jabatan yang berbeda. Jawaban 28 berlaku bila keduanya menduduki jabatan yang sama sehingga urutannya tidak dibedakan.",
  },

  /* ------------------------------- Figural ------------------------------- */
  {
    nomor: 17,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["panah#penuh", "panah@90", "panah@180#penuh", "?"],
    },
    opsi: {
      A: "Panah ke atas, terisi penuh",
      B: "Panah ke atas, bergaris",
      C: "Panah ke kiri, bergaris",
      D: "Panah ke kanan, terisi penuh",
    },
    opsiFigur: {
      A: "panah@270#penuh",
      B: "panah@270",
      C: "panah@180",
      D: "panah#penuh",
    },
    kunci: "B",
    pembahasan:
      "Dua aturan berjalan bersamaan: arah panah berputar 90 derajat searah jarum jam setiap langkah, sedangkan isinya berselang-seling penuh dan bergaris. Setelah panah kiri yang terisi penuh, giliran berikutnya adalah panah ke atas yang bergaris. Jawaban A benar arahnya tetapi salah isinya.",
  },
  {
    nomor: 18,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["bintang", "lingkaran*2", "bintang*3", "?"],
    },
    opsi: {
      A: "Empat bintang",
      B: "Tiga lingkaran",
      C: "Empat lingkaran",
      D: "Dua bintang",
    },
    opsiFigur: {
      A: "bintang*4",
      B: "lingkaran*3",
      C: "lingkaran*4",
      D: "bintang*2",
    },
    kunci: "C",
    pembahasan:
      "Bentuknya berselang-seling antara bintang dan lingkaran, sementara cacahnya bertambah satu setiap langkah: 1, 2, 3, lalu 4. Giliran bentuk berikutnya adalah lingkaran, jadi jawabannya empat lingkaran. Jawaban A benar cacahnya tetapi salah bentuknya.",
  },
  {
    nomor: 19,
    kategori: "Figural",
    pertanyaan:
      "Gambar pertama berubah menjadi gambar kedua. Dengan perubahan yang sama, gambar ketiga akan menjadi ...",
    stimulus: {
      kolom: 4,
      sel: ["panah", "panah@180*2", "segitiga", "?"],
    },
    opsi: {
      A: "Dua segitiga menghadap bawah",
      B: "Dua segitiga menghadap atas",
      C: "Satu segitiga menghadap bawah",
      D: "Tiga segitiga menghadap bawah",
    },
    opsiFigur: {
      A: "segitiga@180*2",
      B: "segitiga*2",
      C: "segitiga@180",
      D: "segitiga@180*3",
    },
    kunci: "A",
    pembahasan:
      "Ada dua perubahan sekaligus dari gambar pertama ke kedua: bentuknya diputar 180 derajat dan cacahnya digandakan menjadi dua. Diterapkan pada segitiga yang menghadap atas, hasilnya dua segitiga yang menghadap bawah. Jawaban B hanya menggandakan, jawaban C hanya memutar.",
  },
  {
    nomor: 20,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["segitiga", "persegi#penuh", "segilima", "?"],
    },
    opsi: {
      A: "Segi enam bergaris",
      B: "Segi enam terisi penuh",
      C: "Segi lima terisi penuh",
      D: "Persegi terisi penuh",
    },
    opsiFigur: {
      A: "segienam",
      B: "segienam#penuh",
      C: "segilima#penuh",
      D: "persegi#penuh",
    },
    kunci: "B",
    pembahasan:
      "Jumlah sisi bertambah satu setiap langkah — 3, 4, 5, lalu 6 — sedangkan isinya berselang-seling bergaris dan penuh. Gambar ketiga bergaris, jadi giliran berikutnya terisi penuh. Jawaban A benar bentuknya tetapi meneruskan isi yang salah.",
  },
  {
    nomor: 21,
    kategori: "Figural",
    pertanyaan:
      "Gambar pertama berubah menjadi gambar kedua. Dengan perubahan yang sama, gambar ketiga akan menjadi ...",
    stimulus: {
      kolom: 4,
      sel: ["lingkaran*2", "lingkaran*4", "segitiga", "?"],
    },
    opsi: {
      A: "Empat segitiga",
      B: "Dua lingkaran",
      C: "Tiga segitiga",
      D: "Dua segitiga",
    },
    opsiFigur: {
      A: "segitiga*4",
      B: "lingkaran*2",
      C: "segitiga*3",
      D: "segitiga*2",
    },
    kunci: "D",
    pembahasan:
      "Perubahannya adalah penggandaan: dua lingkaran menjadi empat lingkaran. Diterapkan pada satu segitiga, hasilnya dua segitiga. Jawaban A keliru karena mengira yang dilakukan adalah penambahan dua, padahal contohnya menunjukkan perkalian dua.",
  },
  {
    nomor: 22,
    kategori: "Figural",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan ketiga lainnya?",
    opsi: {
      A: "Panah serong ke kanan-bawah",
      B: "Panah serong ke kiri-bawah",
      C: "Panah serong ke kiri-atas",
      D: "Panah mengarah ke bawah",
    },
    opsiFigur: {
      A: "panah@45",
      B: "panah@135",
      C: "panah@225",
      D: "panah@90",
    },
    kunci: "D",
    pembahasan:
      "Tiga panah lainnya menunjuk arah serong, yaitu kelipatan ganjil dari 45 derajat. Hanya satu panah yang menunjuk arah lurus ke bawah. Perhatikan bahwa banyaknya panah dan bentuknya sama pada keempat pilihan, sehingga pembedanya hanya arah.",
  },
  {
    nomor: 23,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "panah",
        "panah*2",
        "panah*3",
        "panah@90",
        "panah@90*2",
        "panah@90*3",
        "panah@180",
        "panah@180*2",
        "?",
      ],
    },
    opsi: {
      A: "Tiga panah ke kiri",
      B: "Dua panah ke kiri",
      C: "Tiga panah ke atas",
      D: "Tiga panah ke kanan",
    },
    opsiFigur: {
      A: "panah@180*3",
      B: "panah@180*2",
      C: "panah@270*3",
      D: "panah*3",
    },
    kunci: "A",
    pembahasan:
      "Arah panah ditentukan barisnya — kanan, bawah, kiri — sedangkan cacahnya ditentukan kolomnya, yaitu satu, dua, tiga. Sel yang ditanyakan berada di baris ketiga dan kolom ketiga, jadi jawabannya tiga panah yang menghadap kiri.",
  },
  {
    nomor: 24,
    kategori: "Figural",
    pertanyaan:
      "Pada deret berikut, TIGA sifat berubah bersamaan: bentuk, isi, dan cacahnya. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: [
        "lingkaran",
        "segitiga#separuh*2",
        "persegi#penuh*3",
        "?",
      ],
    },
    opsi: {
      A: "Empat segi lima terisi penuh",
      B: "Empat segi lima bergaris",
      C: "Empat segi enam bergaris",
      D: "Tiga segi lima bergaris",
    },
    opsiFigur: {
      A: "segilima#penuh*4",
      B: "segilima*4",
      C: "segienam*4",
      D: "segilima*3",
    },
    kunci: "B",
    pembahasan:
      "Telusuri ketiga sifat satu per satu. Bentuk: lingkaran, segitiga, persegi, lalu segi lima. Cacah: 1, 2, 3, lalu 4. Isi: bergaris, separuh, penuh — ketiganya sudah terpakai, sehingga urutannya berulang kembali ke bergaris. Hanya satu pilihan yang memenuhi ketiganya sekaligus.",
  },
];

/* -------------------------------------------------------------------------- */
/*                  Sesi 2 — Tes Logika dan Penalaran Visual                  */
/* -------------------------------------------------------------------------- */

const VISUAL_3: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran#penuh",
        "lingkaran#separuh",
        "lingkaran",
        "segitiga",
        "segitiga#penuh",
        "segitiga#separuh",
        "persegi#separuh",
        "persegi",
        "?",
      ],
    },
    opsi: {
      A: "Persegi bergaris",
      B: "Persegi terisi separuh",
      C: "Persegi terisi penuh",
      D: "Segitiga terisi penuh",
    },
    opsiFigur: {
      A: "persegi",
      B: "persegi#separuh",
      C: "persegi#penuh",
      D: "segitiga#penuh",
    },
    kunci: "C",
    pembahasan:
      "Bentuk ditentukan barisnya. Cara pengisiannya disusun agar setiap baris dan setiap kolom memuat penuh, separuh, dan bergaris masing-masing tepat satu kali. Baris ketiga sudah memakai separuh dan bergaris, jadi tersisa penuh — dan kolom ketiga pun sudah memakai bergaris dan separuh, memberi jawaban yang sama.",
  },
  {
    nomor: 2,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Besar putarannya TIDAK tetap. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: { kolom: 4, sel: ["panah", "panah@45", "panah@135", "?"] },
    opsi: {
      A: "Panah mengarah ke kiri",
      B: "Panah mengarah ke atas",
      C: "Panah serong ke kiri-atas",
      D: "Panah serong ke kanan-atas",
    },
    opsiFigur: {
      A: "panah@180",
      B: "panah@270",
      C: "panah@225",
      D: "panah@315",
    },
    kunci: "B",
    pembahasan:
      "Besar putarannya bertambah: dari 0 ke 45 berputar 45 derajat, dari 45 ke 135 berputar 90 derajat. Putaran berikutnya 135 derajat, sehingga 135 + 135 = 270 derajat, yaitu menghadap atas. Jawaban A adalah jebakan bagi yang mengira putarannya tetap 45 derajat.",
  },
  {
    nomor: 3,
    kategori: "Pencerminan",
    pertanyaan:
      "Gambar berikut dicerminkan terhadap garis TEGAK, lalu hasilnya dicerminkan lagi terhadap garis MENDATAR. Bagaimana bentuk akhirnya?",
    stimulus: { kolom: 1, sel: ["panah@45"] },
    opsi: {
      A: "Panah serong ke kiri-atas",
      B: "Panah serong ke kiri-bawah",
      C: "Panah serong ke kanan-atas",
      D: "Panah serong ke kanan-bawah",
    },
    opsiFigur: {
      A: "panah@225",
      B: "panah@135",
      C: "panah@315",
      D: "panah@45",
    },
    kunci: "A",
    pembahasan:
      "Cermin tegak menukar kiri-kanan, cermin mendatar menukar atas-bawah. Dua pencerminan pada dua sumbu yang tegak lurus sama hasilnya dengan satu putaran 180 derajat. Panah yang semula serong ke kanan-bawah berakhir serong ke kiri-atas. Jawaban B dan C masing-masing hanya hasil satu kali pencerminan.",
  },
  {
    nomor: 4,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: { kolom: 4, sel: ["garis", "garis@30", "garis@60", "?"] },
    opsi: {
      A: "Garis miring landai",
      B: "Garis tegak",
      C: "Garis miring curam",
      D: "Garis mendatar",
    },
    opsiFigur: {
      A: "garis@120",
      B: "garis@90",
      C: "garis@60",
      D: "garis",
    },
    kunci: "B",
    pembahasan:
      "Garis berputar 30 derajat searah jarum jam setiap langkah: 0, 30, 60. Langkah berikutnya 90 derajat, yaitu garis tegak. Jawaban C mengulang gambar terakhir, dan jawaban D kembali ke gambar pertama.",
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
        "segitiga*2",
        "persegi*3",
        "persegi*2",
        "lingkaran*3",
        "segitiga",
        "segitiga*3",
        "persegi",
        "?",
      ],
    },
    opsi: {
      A: "Tiga lingkaran",
      B: "Satu lingkaran",
      C: "Dua lingkaran",
      D: "Dua segitiga",
    },
    opsiFigur: {
      A: "lingkaran*3",
      B: "lingkaran",
      C: "lingkaran*2",
      D: "segitiga*2",
    },
    kunci: "C",
    pembahasan:
      "Dua hal disusun serentak seperti teka-teki angka. Setiap baris dan setiap kolom memuat lingkaran, segitiga, dan persegi tepat satu kali; begitu pula cacah satu, dua, dan tiga. Baris ketiga sudah memakai segitiga dan persegi dengan cacah tiga dan satu, sehingga tersisa lingkaran dengan cacah dua.",
  },
  {
    nomor: 6,
    kategori: "Ketidaksamaan",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan ketiga lainnya?",
    opsi: {
      A: "Dua panah ke kanan",
      B: "Dua panah ke bawah",
      C: "Dua panah ke kiri",
      D: "Tiga panah ke bawah",
    },
    opsiFigur: {
      A: "panah*2",
      B: "panah@90*2",
      C: "panah@180*2",
      D: "panah@90*3",
    },
    kunci: "D",
    pembahasan:
      "Tiga pilihan lainnya sama-sama terdiri atas dua panah; hanya satu yang terdiri atas tiga. Arah panah sengaja dibuat berbeda-beda pada keempat pilihan sehingga arah bukan pembedanya — godaan terbesarnya adalah memilih berdasarkan arah yang berulang.",
  },
  {
    nomor: 7,
    kategori: "Analogi",
    pertanyaan:
      "Gambar pertama berubah menjadi gambar kedua. Dengan perubahan yang sama, gambar ketiga akan menjadi ...",
    stimulus: {
      kolom: 4,
      sel: ["lingkaran*3", "lingkaran", "segitiga*3", "?"],
    },
    opsi: {
      A: "Dua segitiga",
      B: "Satu segitiga",
      C: "Satu lingkaran",
      D: "Tiga segitiga",
    },
    opsiFigur: {
      A: "segitiga*2",
      B: "segitiga",
      C: "lingkaran",
      D: "segitiga*3",
    },
    kunci: "B",
    pembahasan:
      "Perubahannya adalah penyusutan cacah menjadi satu, tanpa mengubah bentuk maupun isinya. Diterapkan pada tiga segitiga, hasilnya satu segitiga. Jawaban C keliru karena ikut membawa bentuk dari contoh, padahal yang dipinjam seharusnya hanya aturan perubahannya.",
  },
  {
    nomor: 8,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Arah dan isi sama-sama berpindah. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "panah",
        "panah@90#separuh",
        "panah@180#penuh",
        "panah@90#penuh",
        "panah@180",
        "panah#separuh",
        "panah@180#separuh",
        "panah#penuh",
        "?",
      ],
    },
    opsi: {
      A: "Panah ke bawah, terisi penuh",
      B: "Panah ke bawah, bergaris",
      C: "Panah ke kanan, terisi separuh",
      D: "Panah ke kiri, bergaris",
    },
    opsiFigur: {
      A: "panah@90#penuh",
      B: "panah@90",
      C: "panah#separuh",
      D: "panah@180",
    },
    kunci: "B",
    pembahasan:
      "Perlakukan arah dan isi sebagai dua teka-teki terpisah. Arah: setiap baris dan kolom memuat kanan, bawah, dan kiri tepat satu kali — baris ketiga sudah memakai kiri dan kanan, jadi tersisa bawah. Isi: setiap baris dan kolom memuat bergaris, separuh, dan penuh tepat satu kali — baris ketiga sudah memakai separuh dan penuh, jadi tersisa bergaris.",
  },
  {
    nomor: 9,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["segienam", "segilima#separuh", "persegi#penuh", "?"],
    },
    opsi: {
      A: "Segitiga bergaris",
      B: "Segitiga terisi penuh",
      C: "Segitiga terisi separuh",
      D: "Persegi bergaris",
    },
    opsiFigur: {
      A: "segitiga",
      B: "segitiga#penuh",
      C: "segitiga#separuh",
      D: "persegi",
    },
    kunci: "A",
    pembahasan:
      "Jumlah sisi berkurang satu setiap langkah: 6, 5, 4, lalu 3. Isinya berputar dalam urutan bergaris, separuh, penuh, sehingga setelah penuh ia kembali ke bergaris. Kedua aturan itu harus dipenuhi sekaligus, dan hanya segitiga bergaris yang memenuhinya.",
  },
  {
    nomor: 10,
    kategori: "Rotasi",
    pertanyaan:
      "Gambar berikut diputar 180 derajat. Bagaimana bentuk akhirnya?",
    stimulus: { kolom: 1, sel: ["segitiga@90"] },
    opsi: {
      A: "Segitiga menghadap atas",
      B: "Segitiga menghadap bawah",
      C: "Segitiga menghadap kiri",
      D: "Segitiga menghadap kanan",
    },
    opsiFigur: {
      A: "segitiga",
      B: "segitiga@180",
      C: "segitiga@270",
      D: "segitiga@90",
    },
    kunci: "C",
    pembahasan:
      "Putaran 180 derajat membalikkan arah sepenuhnya. Puncak segitiga yang semula menunjuk ke kanan berpindah menunjuk ke kiri. Perhatikan bahwa hasilnya kebetulan sama dengan pencerminan terhadap garis tegak — kesamaan itu hanya berlaku untuk bentuk yang simetris seperti ini, tidak berlaku umum.",
  },
  {
    nomor: 11,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "silang",
        "garis",
        "lingkaran",
        "garis",
        "lingkaran",
        "silang",
        "lingkaran",
        "silang",
        "?",
      ],
    },
    opsi: {
      A: "Lingkaran",
      B: "Tanda silang",
      C: "Garis mendatar",
      D: "Persegi",
    },
    opsiFigur: {
      A: "lingkaran",
      B: "silang",
      C: "garis",
      D: "persegi",
    },
    kunci: "C",
    pembahasan:
      "Ketiga lambang bergeser satu langkah pada setiap baris. Baris ketiga sudah memuat lingkaran dan tanda silang, sehingga yang tersisa adalah garis. Pemeriksaan silang: dengan jawaban itu setiap kolom pun memuat ketiga lambang tepat satu kali.",
  },
  {
    nomor: 12,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Bentuk dan isinya selalu berpasangan tetap. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran#penuh",
        "segitiga#separuh",
        "persegi",
        "segitiga#separuh",
        "persegi",
        "lingkaran#penuh",
        "persegi",
        "lingkaran#penuh",
        "?",
      ],
    },
    opsi: {
      A: "Segitiga terisi separuh",
      B: "Segitiga terisi penuh",
      C: "Lingkaran terisi penuh",
      D: "Persegi bergaris",
    },
    opsiFigur: {
      A: "segitiga#separuh",
      B: "segitiga#penuh",
      C: "lingkaran#penuh",
      D: "persegi",
    },
    kunci: "A",
    pembahasan:
      "Setiap bentuk selalu membawa isinya sendiri: lingkaran selalu penuh, segitiga selalu separuh, persegi selalu bergaris. Karena itu soal ini sesungguhnya hanya soal pergeseran tiga lambang. Baris ketiga sudah memuat persegi dan lingkaran, sehingga tersisa segitiga — beserta isinya yang separuh. Jawaban B memasangkan segitiga dengan isi yang bukan miliknya.",
  },
];

/* -------------------------------------------------------------------------- */
/*                   Sesi 4 — Tes Kepribadian dan Emosi                       */
/* -------------------------------------------------------------------------- */

const EMOSI_3: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Kejujuran",
    pertanyaan:
      "Sahabat dekat Anda melakukan pelanggaran berat dan meminta Anda mengatakan kepada pembina bahwa ia bersama Anda saat kejadian. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menuruti permintaannya karena ia sahabat Anda",
      B: "Menolak berbohong, dan mendorongnya mengakui sendiri perbuatannya kepada pembina",
      C: "Diam dan menghindar bila ditanya pembina",
      D: "Mengatakan bahwa Anda tidak ingat apa-apa",
    },
    kunci: "B",
    pembahasan:
      "Kesetiakawanan tidak pernah menjadi alasan yang sah untuk berbohong kepada pihak berwenang; berbohong justru menyeret Anda menjadi pelaku kedua. Mendorongnya mengaku adalah bentuk pertolongan yang sesungguhnya. Pilihan C dan D pada dasarnya sama dengan A, hanya dilakukan dengan cara yang lebih halus — dan keduanya tetap menutupi kebenaran.",
  },
  {
    nomor: 2,
    kategori: "Hubungan Sosial",
    pertanyaan:
      "Dua teman dekat Anda sedang berselisih, dan masing-masing meminta Anda memihaknya. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Memihak yang menurut Anda paling benar agar perselisihannya cepat selesai",
      B: "Menjauhi keduanya sampai mereka berdamai sendiri",
      C: "Menyampaikan kepada masing-masing keburukan pihak lain agar mereka sadar",
      D: "Menolak memihak, mendengarkan keduanya, lalu mempertemukan mereka untuk berbicara langsung",
    },
    kunci: "D",
    pembahasan:
      "Perselisihan selesai ketika kedua pihak berbicara, bukan ketika ada yang menang. Menolak memihak menjaga kepercayaan keduanya sehingga Anda masih dapat menjadi penghubung. Pilihan A menambah satu pihak yang kalah, B membiarkan masalah membesar, dan C memperkeruh keadaan sambil merusak kepercayaan mereka kepada Anda.",
  },
  {
    nomor: 3,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Sudah beberapa pekan Anda merasa lelah berkepanjangan, mudah tersinggung, dan sulit berkonsentrasi. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menambah kegiatan agar tidak sempat memikirkannya",
      B: "Menganggapnya biasa dan menunggu sampai hilang sendiri",
      C: "Mengakui bahwa Anda sedang kelelahan, memperbaiki pola tidur dan makan, serta berbicara dengan pengasuh atau petugas kesehatan",
      D: "Mengurangi seluruh kegiatan tanpa memberi tahu siapa pun",
    },
    kunci: "C",
    pembahasan:
      "Lelah yang berlangsung berpekan-pekan disertai mudah tersinggung bukan lagi kelelahan biasa, dan mengabaikannya justru membuatnya menumpuk. Langkah yang tepat adalah mengenali tandanya, memperbaiki hal mendasar seperti tidur dan makan, lalu meminta bantuan. Pilihan A menambah beban pada tubuh yang sudah kepayahan, B menunda tanpa dasar, dan D menarik diri tanpa sepengetahuan siapa pun sehingga tidak ada yang dapat menolong.",
  },
  {
    nomor: 4,
    kategori: "Kerendahan Hati",
    pertanyaan:
      "Anda dipuji pembina sebagai penyebab utama kemenangan regu, padahal sebenarnya teman Anda yang paling berjasa. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menerima pujian itu dan menyebutkan peran teman Anda yang sebenarnya",
      B: "Menerima pujian itu tanpa berkata apa-apa",
      C: "Menolak pujian itu dan menyatakan bahwa Anda tidak berbuat apa-apa",
      D: "Menceritakan kepada teman-teman bahwa pembina salah menilai",
    },
    kunci: "A",
    pembahasan:
      "Menerima pujian dengan sopan sambil meluruskan siapa yang sebenarnya berjasa menjaga dua hal sekaligus: kejujuran dan penghargaan kepada rekan. Pilihan B membiarkan penilaian keliru berlanjut sehingga teman Anda dirugikan; C merendahkan diri secara berlebihan sampai menyimpang dari kenyataan; dan D membicarakan koreksi di belakang, bukan kepada orang yang perlu mengetahuinya.",
  },
  {
    nomor: 5,
    kategori: "Menghadapi Kegagalan",
    pertanyaan:
      "Anda sudah tiga kali gagal pada bidang yang menjadi cita-cita Anda. Sikap yang paling matang adalah ...",
    opsi: {
      A: "Terus mencoba dengan cara yang persis sama karena ketekunan pasti berbuah",
      B: "Meminta penilaian jujur dari orang yang lebih ahli tentang kekuatan dan kelemahan Anda, lalu memutuskan apakah memperbaiki cara atau mempertimbangkan jalan lain",
      C: "Berhenti sekarang juga sebelum kecewa lebih dalam",
      D: "Menyalahkan keadaan yang selalu tidak berpihak kepada Anda",
    },
    kunci: "B",
    pembahasan:
      "Kematangan bukan sekadar bertahan, melainkan tahu kapan cara harus diubah. Penilaian jujur dari orang yang lebih ahli memberi dasar untuk memutuskan, sehingga keputusan apa pun yang diambil bukan lahir dari kecewa sesaat. Pilihan A mengulang cara yang sudah terbukti tidak berhasil, C menyerah tanpa keterangan, dan D menutup semua kemungkinan perbaikan.",
  },
  {
    nomor: 6,
    kategori: "Kepemimpinan",
    pertanyaan:
      "Seorang anggota regu Anda selalu mengerjakan tugasnya asal-asalan sehingga hasil regu ikut jelek. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengerjakan ulang pekerjaannya diam-diam agar hasil regu tetap baik",
      B: "Melaporkannya kepada pembina sejak awal",
      C: "Berbicara langsung dengannya untuk mencari tahu sebabnya, membantu bila ia kesulitan, dan melaporkan bila tetap tidak berubah",
      D: "Mengeluarkannya dari pembagian tugas",
    },
    kunci: "C",
    pembahasan:
      "Pekerjaan yang buruk bisa berasal dari tidak mampu, tidak paham, atau tidak mau — dan ketiganya butuh penanganan berbeda. Bertanya lebih dahulu adalah cara mengetahuinya. Pilihan A menutupi masalah sehingga ia tidak pernah belajar dan beban Anda menumpuk; B melompati penyelesaian yang bisa dilakukan sendiri; dan D membuang anggota, bukan memperbaikinya.",
  },
  {
    nomor: 7,
    kategori: "Integritas",
    pertanyaan:
      "Seseorang menawarkan bantuan agar Anda diloloskan dalam seleksi dengan imbalan sejumlah uang. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menolak halus dan melupakan tawaran itu",
      B: "Menanyakan lebih dahulu apakah caranya aman",
      C: "Menolak, lalu berunding dengan orang tua tentang jumlahnya",
      D: "Menolak dengan tegas dan melaporkan tawaran itu kepada panitia seleksi",
    },
    kunci: "D",
    pembahasan:
      "Tawaran semacam ini merugikan seluruh peserta lain, bukan hanya menguji Anda seorang. Karena itu menolak saja belum cukup — melaporkannya memutus praktik yang mungkin juga ditawarkan kepada orang lain. Pilihan B sudah membuka pintu tawar-menawar, dan C hanya memindahkan keputusannya, bukan menolaknya.",
  },
  {
    nomor: 8,
    kategori: "Menerima Otoritas",
    pertanyaan:
      "Anda yakin cara latihan yang Anda ketahui lebih baik daripada yang diperintahkan pelatih. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menjalankan perintah pelatih, lalu menyampaikan usul Anda beserta alasannya pada waktu yang tepat",
      B: "Menjalankan cara Anda sendiri karena hasilnya lebih baik",
      C: "Menjalankan perintah pelatih sambil menganggapnya keliru",
      D: "Mengajak teman-teman ikut memakai cara Anda",
    },
    kunci: "A",
    pembahasan:
      "Usul yang baik tetap perlu disampaikan lewat jalan yang benar, dan latihan berkelompok menuntut satu aba-aba agar tidak kacau. Menjalankan lebih dahulu menunjukkan kesediaan diatur, sementara menyampaikan usul menjaga agar pikiran Anda tidak hilang percuma. Pilihan B dan D memecah barisan, sedangkan C patuh di luar tetapi menolak di dalam — sikap yang tidak menyelesaikan apa pun.",
  },
  {
    nomor: 9,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Anda merasa iri kepada teman sekelas yang selalu unggul dalam segala hal. Sikap yang paling sehat adalah ...",
    opsi: {
      A: "Menjauhinya agar perasaan itu tidak muncul",
      B: "Mencari-cari kekurangannya untuk menenangkan hati",
      C: "Mengakui perasaan itu, lalu mengubahnya menjadi dorongan dengan mempelajari cara belajarnya",
      D: "Berpura-pura tidak peduli pada prestasi siapa pun",
    },
    kunci: "C",
    pembahasan:
      "Iri adalah tanda bahwa Anda menginginkan sesuatu, dan itu dapat menjadi tenaga bila diarahkan. Mengakuinya lebih dahulu mencegahnya berubah menjadi permusuhan. Pilihan A dan D menghindari perasaan tanpa mengubah apa pun, sedangkan B meredakan hati dengan merendahkan orang lain — cara yang tidak menambah kemampuan Anda sedikit pun.",
  },
  {
    nomor: 10,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Saat kegiatan di lapangan terbuka, Anda terpisah dari rombongan dan tidak tahu arah kembali. Langkah pertama yang paling tepat adalah ...",
    opsi: {
      A: "Berjalan cepat ke segala arah untuk mencari rombongan",
      B: "Berhenti, menenangkan diri, mengingat jalur terakhir yang dilalui, lalu memberi tanda atau bunyi agar mudah ditemukan",
      C: "Berteriak sekencang-kencangnya sampai tenaga habis",
      D: "Beristirahat sampai hari gelap baru mencari jalan",
    },
    kunci: "B",
    pembahasan:
      "Bergerak tanpa arah membuat jarak dari rombongan makin jauh dan mempersulit pencarian. Berhenti lalu menenangkan diri mengembalikan kemampuan berpikir, dan memberi tanda membuat regu penolong mendekat kepada Anda. Pilihan A dan C menghabiskan tenaga yang justru paling dibutuhkan, sedangkan D menunda sampai keadaan bertambah sulit.",
  },
  {
    nomor: 11,
    kategori: "Tanggung Jawab",
    pertanyaan:
      "Anda dipercaya memegang uang kas kelas. Seorang teman mendesak meminjam sebagian untuk keperluan mendesaknya. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menolak meminjamkan uang kas, menjelaskan bahwa itu bukan milik Anda, lalu membantu mencarikan jalan lain baginya",
      B: "Meminjamkan sebentar asal dicatat dan segera dikembalikan",
      C: "Meminjamkan karena keadaannya memang mendesak",
      D: "Meminjamkan uang pribadi Anda tanpa memberi tahu siapa pun",
    },
    kunci: "A",
    pembahasan:
      "Uang titipan tidak boleh dipakai untuk keperluan apa pun di luar peruntukannya, sebesar apa pun alasannya — sekali dilanggar, batasnya hilang. Pilihan B dan C tetap memakai uang yang bukan hak Anda, hanya dengan pembenaran yang terdengar rapi. Pilihan D memang memakai uang sendiri, tetapi menyembunyikannya menyisakan kesan tidak terbuka; membantu mencarikan jalan lain lebih menolong tanpa menimbulkan masalah baru.",
  },
  {
    nomor: 12,
    kategori: "Kejujuran",
    pertanyaan:
      "Saat ujian berlangsung, teman di sebelah Anda berbisik meminta jawaban. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Memberikan jawaban karena kasihan kepadanya",
      B: "Memberikan sebagian saja agar tidak terlalu mencolok",
      C: "Menegurnya keras-keras agar pengawas mengetahuinya",
      D: "Tidak memberikan jawaban dan tetap mengerjakan soal Anda sendiri",
    },
    kunci: "D",
    pembahasan:
      "Memberi jawaban menjadikan Anda ikut melanggar, dan kasihan bukan alasan yang meringankan — pilihan B hanya memperkecil ukuran pelanggaran, bukan menghapusnya. Pilihan C memang menolak, tetapi caranya justru mengganggu peserta lain dan menarik perhatian kepada diri sendiri; menolak dengan diam sudah cukup, dan bila teman itu terus mendesak, pengawas dapat diberi tahu setelah ujian selesai.",
  },
];

/* -------------------------------------------------------------------------- */

export const PAKET_PSIKOTES_3: PaketPsikotes = {
  id: "psi-3",
  nomor: 3,
  nama: "Try Out Psikotes 3",
  deskripsi:
    "Tingkat paling berat. Deret numeriknya memakai perkalian bertingkat, soal verbalnya menuntut ketelitian pada ingkaran dan syarat ganda, dan sebagian soal figuralnya menjalankan tiga sifat sekaligus.",
  sesi: [
    {
      id: "tiu",
      jenis: "skor",
      nama: "Tes Intelegensi Umum (TIU)",
      ringkas: "Verbal, numerik, dan figural",
      petunjuk:
        "Bacalah kata kunci pada soal verbal dengan cermat — kata seperti tidak ada, semua, serta jika dan hanya jika mengubah kesimpulan sepenuhnya. Pada soal numerik, waspadai persentase bertingkat dan rata-rata yang tidak boleh dihitung dengan cara biasa.",
      durasiMenit: 20,
      soal: TIU_3,
    },
    {
      id: "visual",
      jenis: "skor",
      nama: "Tes Logika dan Penalaran Visual",
      ringkas: "Pola gambar dan simbol geometris",
      petunjuk:
        "Sebagian soal menjalankan tiga sifat sekaligus: bentuk, isi, dan cacahnya. Telusuri satu sifat pada satu waktu, lalu pilih gambar yang memenuhi ketiganya. Pada matriks, jawaban yang benar selalu cocok dibaca dari arah baris maupun kolom.",
      durasiMenit: 10,
      soal: VISUAL_3,
    },
    {
      id: "epps",
      jenis: "epps",
      nama: "Tes EPPS (Kecenderungan Pribadi)",
      ringkas: "Pasangan pernyataan, pilih yang paling menggambarkan diri",
      petunjuk:
        "Pilih pernyataan yang paling menggambarkan diri Anda apa adanya, bukan yang terdengar paling baik. Kedua pernyataan memang sama-sama positif — itu memang disengaja. Jawablah cepat sesuai kesan pertama; jawaban yang terlalu lama dipikirkan justru menjauh dari keadaan sebenarnya.",
      durasiMenit: 18,
      pasangan: EPPS_PAKET_3,
    },
    {
      id: "emosi",
      jenis: "skor",
      nama: "Tes Kepribadian dan Emosi",
      ringkas: "Sikap menghadapi tekanan dan situasi sulit",
      petunjuk:
        "Butir pada paket ini sengaja dibuat bercabang: sering kali ada dua pilihan yang sama-sama terdengar benar. Bedanya terletak pada akibat jangka panjang bagi diri Anda, bagi orang lain, dan bagi aturan yang berlaku.",
      durasiMenit: 10,
      soal: EMOSI_3,
    },
  ],
};
