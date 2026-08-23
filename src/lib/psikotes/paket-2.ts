import { EPPS_PAKET_2 } from "@/lib/psikotes/epps";
import type { PaketPsikotes, SoalSkor } from "@/lib/psikotes/tipe";

/**
 * Try Out Psikotes — Paket 2.
 *
 * Tingkat menengah. Deretnya berlapis, penalaran verbalnya melibatkan ingkaran
 * dan rantai sebab-akibat, dan soal figuralnya menggabungkan dua aturan yang
 * berjalan bersamaan. Tidak ada butir yang mengulang Paket 1.
 */

/* -------------------------------------------------------------------------- */
/*                    Sesi 1 — Tes Intelegensi Umum (TIU)                     */
/* -------------------------------------------------------------------------- */

const TIU_2: SoalSkor[] = [
  /* ------------------------------- Verbal -------------------------------- */
  {
    nomor: 1,
    kategori: "Verbal",
    pertanyaan: "Sinonim dari RENOVASI adalah ...",
    opsi: {
      A: "Pembongkaran",
      B: "Penambahan",
      C: "Perbaikan",
      D: "Pemindahan",
    },
    kunci: "C",
    pembahasan:
      "Renovasi berarti pembaruan atau perbaikan sesuatu yang sudah rusak agar kembali baik. Pembongkaran hanya salah satu tahapnya dan belum tentu berujung perbaikan, penambahan adalah ekspansi, dan pemindahan adalah relokasi.",
  },
  {
    nomor: 2,
    kategori: "Verbal",
    pertanyaan: "Lawan kata ANTIPATI adalah ...",
    opsi: {
      A: "Simpati",
      B: "Apatis",
      C: "Benci",
      D: "Acuh tak acuh",
    },
    kunci: "A",
    pembahasan:
      "Antipati adalah perasaan menolak atau tidak suka terhadap seseorang; lawannya adalah simpati, yaitu perasaan tertarik dan ikut merasakan. Benci justru sejalan dengan antipati, sedangkan apatis dan acuh tak acuh menyatakan ketidakpedulian — sikap netral, bukan lawan.",
  },
  {
    nomor: 3,
    kategori: "Verbal",
    pertanyaan: "BUKU : PENGARANG = LUKISAN : ...",
    opsi: { A: "Pelukis", B: "Kanvas", C: "Kuas", D: "Warna" },
    kunci: "A",
    pembahasan:
      "Hubungannya adalah karya dengan orang yang membuatnya. Buku dibuat pengarang, lukisan dibuat pelukis. Kanvas adalah alasnya, kuas adalah alatnya, dan warna adalah bahannya — ketiganya bukan pembuat karya.",
  },
  {
    nomor: 4,
    kategori: "Verbal",
    pertanyaan: "DINGIN : BEKU = PANAS : ...",
    opsi: { A: "Hangat", B: "Api", C: "Mendidih", D: "Cair" },
    kunci: "C",
    pembahasan:
      "Hubungannya adalah keadaan dengan akibatnya pada tingkat paling ekstrem. Dingin yang sangat menyebabkan beku; panas yang sangat menyebabkan mendidih. Hangat justru tingkat yang lebih rendah dari panas, dan api adalah sumber panas, bukan akibatnya.",
  },
  {
    nomor: 5,
    kategori: "Verbal",
    pertanyaan:
      "Semua yang rajin membaca berwawasan luas. Semua yang berwawasan luas mudah menyesuaikan diri. Andi rajin membaca. Kesimpulan yang pasti benar adalah ...",
    opsi: {
      A: "Andi berwawasan luas tetapi belum tentu mudah menyesuaikan diri",
      B: "Andi mudah menyesuaikan diri",
      C: "Andi belum tentu berwawasan luas",
      D: "Tidak dapat ditarik kesimpulan",
    },
    kunci: "B",
    pembahasan:
      "Dua pernyataan bersyarat itu dapat disambung menjadi satu rantai: rajin membaca membawa ke wawasan luas, dan wawasan luas membawa ke mudah menyesuaikan diri. Karena Andi berada di pangkal rantai, ia sampai ke ujungnya. Pilihan A memutus rantai di tengah tanpa alasan.",
  },
  {
    nomor: 6,
    kategori: "Verbal",
    pertanyaan:
      "Ingkaran dari pernyataan Beberapa peserta terlambat adalah ...",
    opsi: {
      A: "Semua peserta terlambat",
      B: "Beberapa peserta tidak terlambat",
      C: "Tidak ada peserta yang terlambat",
      D: "Sebagian besar peserta terlambat",
    },
    kunci: "C",
    pembahasan:
      "Pernyataan beberapa berarti sekurang-kurangnya ada satu. Untuk membantahnya, harus dipastikan tidak ada satu pun — jadi ingkarannya adalah tidak ada peserta yang terlambat. Pilihan B keliru karena ia dapat benar bersamaan dengan pernyataan aslinya: mungkin saja beberapa terlambat dan beberapa lainnya tidak.",
  },
  {
    nomor: 7,
    kategori: "Verbal",
    pertanyaan: "Manakah yang TIDAK sekelompok dengan yang lain?",
    opsi: { A: "Meter", B: "Liter", C: "Kilogram", D: "Termometer" },
    kunci: "D",
    pembahasan:
      "Meter, liter, dan kilogram adalah satuan ukuran. Termometer adalah alat ukur, bukan satuannya — satuan untuk suhu adalah derajat. Perhatikan bahwa besaran yang diukur ketiga satuan itu berbeda-beda, jadi itu bukan pembedanya.",
  },
  {
    nomor: 8,
    kategori: "Verbal",
    pertanyaan: "Peribahasa SEDIA PAYUNG SEBELUM HUJAN berarti ...",
    opsi: {
      A: "Menunda pekerjaan sampai keadaan mendesak",
      B: "Bersiap sebelum terjadi hal yang tidak diinginkan",
      C: "Menghindari tanggung jawab dengan berbagai alasan",
      D: "Bekerja dengan giat hanya ketika sedang diawasi",
    },
    kunci: "B",
    pembahasan:
      "Peribahasa ini menganjurkan persiapan sebelum kesulitan datang, bukan setelahnya. Pilihan A justru kebalikannya. Ingat bahwa peribahasa tidak dimaknai secara harfiah — ia tidak sedang membicarakan payung maupun hujan.",
  },

  /* ------------------------------- Numerik ------------------------------- */
  {
    nomor: 9,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 2, 3, 5, 8, 13, 21, ...",
    opsi: { A: "29", B: "34", C: "32", D: "42" },
    kunci: "B",
    pembahasan:
      "Setiap suku adalah jumlah dua suku sebelumnya: 2 + 3 = 5, 3 + 5 = 8, 5 + 8 = 13, 8 + 13 = 21. Maka suku berikutnya adalah 13 + 21 = 34. Jawaban 42 keliru karena mengira suku terakhir dikalikan dua.",
  },
  {
    nomor: 10,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 96, 48, 24, 12, ...",
    opsi: { A: "8", B: "4", C: "6", D: "10" },
    kunci: "C",
    pembahasan:
      "Setiap suku adalah setengah dari suku sebelumnya: 96 : 2 = 48, 48 : 2 = 24, 24 : 2 = 12. Maka suku berikutnya 12 : 2 = 6. Jawaban 8 dan 10 muncul bila polanya dikira pengurangan tetap.",
  },
  {
    nomor: 11,
    kategori: "Numerik",
    pertanyaan: "Lanjutkan deret berikut: 4, 9, 19, 39, ...",
    opsi: { A: "59", B: "79", C: "69", D: "78" },
    kunci: "B",
    pembahasan:
      "Setiap suku adalah suku sebelumnya dikali 2 lalu ditambah 1: 4 x 2 + 1 = 9, 9 x 2 + 1 = 19, 19 x 2 + 1 = 39. Maka 39 x 2 + 1 = 79. Jawaban 78 lupa menambahkan satu di akhir.",
  },
  {
    nomor: 12,
    kategori: "Numerik",
    pertanyaan:
      "Deret berikut tersusun dari dua deret berselang-seling: 3, 20, 6, 17, 9, 14, 12, ... Berapakah bilangan berikutnya?",
    opsi: { A: "11", B: "15", C: "9", D: "18" },
    kunci: "A",
    pembahasan:
      "Suku pada urutan ganjil naik 3 setiap langkah: 3, 6, 9, 12. Suku pada urutan genap justru turun 3: 20, 17, 14, lalu 11. Bilangan yang diminta menempati urutan genap, jadi jawabannya 11. Kunci soal semacam ini adalah menyadari kedua deret dapat bergerak ke arah yang berlawanan.",
  },
  {
    nomor: 13,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah barang dibeli seharga Rp80.000 lalu dijual Rp92.000. Berapa persen keuntungannya?",
    opsi: { A: "12%", B: "13%", C: "15%", D: "20%" },
    kunci: "C",
    pembahasan:
      "Keuntungannya Rp92.000 - Rp80.000 = Rp12.000. Persentase keuntungan dihitung terhadap harga beli: 12.000/80.000 x 100% = 15%. Jawaban 12% keliru karena mengira selisih dalam ribuan langsung menjadi persentasenya.",
  },
  {
    nomor: 14,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah peta berskala 1 : 500.000. Jarak dua kota pada peta adalah 6 cm. Berapa jarak sebenarnya?",
    opsi: { A: "3 km", B: "30 km", C: "300 km", D: "50 km" },
    kunci: "B",
    pembahasan:
      "Jarak sebenarnya = 6 cm x 500.000 = 3.000.000 cm. Ubah ke kilometer dengan membagi 100.000, sehingga hasilnya 30 km. Kesalahan paling sering terjadi pada pengubahan satuan, bukan pada perkaliannya.",
  },
  {
    nomor: 15,
    kategori: "Numerik",
    pertanyaan:
      "Sebuah keran mengisi penuh sebuah bak dalam 12 menit, keran lain dalam 6 menit. Bila keduanya dibuka bersamaan, berapa menit bak itu penuh?",
    opsi: { A: "4 menit", B: "3 menit", C: "6 menit", D: "9 menit" },
    kunci: "A",
    pembahasan:
      "Dalam satu menit, keran pertama mengisi 1/12 bak dan keran kedua 1/6 bak. Bersama-sama 1/12 + 2/12 = 3/12 = 1/4 bak per menit, sehingga bak penuh dalam 4 menit. Jawaban 9 menit keliru karena mengambil rata-rata kedua waktu.",
  },
  {
    nomor: 16,
    kategori: "Numerik",
    pertanyaan:
      "Harga sebuah barang dinaikkan 20%, kemudian diturunkan 20% dari harga barunya. Dibandingkan harga semula, harga akhirnya ...",
    opsi: {
      A: "Sama dengan harga semula",
      B: "Naik 4%",
      C: "Turun 4%",
      D: "Turun 40%",
    },
    kunci: "C",
    pembahasan:
      "Misalkan harga semula 100. Naik 20% menjadi 120, lalu turun 20% dari 120 yaitu berkurang 24, sehingga menjadi 96. Dibanding 100, harganya turun 4%. Kenaikan dan penurunan dengan persentase yang sama tidak saling meniadakan, sebab keduanya dihitung dari acuan yang berbeda.",
  },

  /* ------------------------------- Figural ------------------------------- */
  {
    nomor: 17,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: { kolom: 4, sel: ["panah", "panah@270", "panah@180", "?"] },
    opsi: {
      A: "Panah mengarah ke bawah",
      B: "Panah mengarah ke kanan",
      C: "Panah mengarah ke atas",
      D: "Panah serong ke kanan-bawah",
    },
    opsiFigur: {
      A: "panah@90",
      B: "panah",
      C: "panah@270",
      D: "panah@45",
    },
    kunci: "A",
    pembahasan:
      "Panah berputar 90 derajat berlawanan arah jarum jam setiap langkah: kanan, atas, kiri. Langkah berikutnya menjadi menghadap bawah. Jawaban B dan C adalah pengulangan gambar yang sudah muncul di dalam deret.",
  },
  {
    nomor: 18,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["persegi*4", "persegi*3", "persegi*2", "?"],
    },
    opsi: {
      A: "Dua persegi",
      B: "Satu persegi",
      C: "Satu lingkaran",
      D: "Tiga persegi",
    },
    opsiFigur: {
      A: "persegi*2",
      B: "persegi",
      C: "lingkaran",
      D: "persegi*3",
    },
    kunci: "B",
    pembahasan:
      "Jumlahnya berkurang satu setiap langkah: empat, tiga, dua, lalu satu. Bentuknya tidak pernah berubah sepanjang deret, sehingga jawaban yang mengganti persegi menjadi lingkaran ikut mengubah hal yang seharusnya tetap.",
  },
  {
    nomor: 19,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 6,
      sel: [
        "lingkaran#penuh",
        "segitiga#penuh",
        "persegi#penuh",
        "lingkaran",
        "segitiga",
        "?",
      ],
    },
    opsi: {
      A: "Persegi terisi penuh",
      B: "Lingkaran bergaris",
      C: "Persegi bergaris",
      D: "Segitiga bergaris",
    },
    opsiFigur: {
      A: "persegi#penuh",
      B: "lingkaran",
      C: "persegi",
      D: "segitiga",
    },
    kunci: "C",
    pembahasan:
      "Urutan bentuknya berulang — lingkaran, segitiga, persegi — sementara isinya berubah per kelompok: tiga gambar pertama terisi penuh, tiga berikutnya bergaris. Sel yang ditanyakan adalah gambar ketiga pada kelompok kedua, jadi persegi bergaris.",
  },
  {
    nomor: 20,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: { kolom: 4, sel: ["segitiga", "persegi", "segilima", "?"] },
    opsi: { A: "Lingkaran", B: "Segi enam", C: "Segi lima", D: "Bintang" },
    opsiFigur: {
      A: "lingkaran",
      B: "segienam",
      C: "segilima",
      D: "bintang",
    },
    kunci: "B",
    pembahasan:
      "Jumlah sisinya bertambah satu setiap langkah: 3, 4, 5, sehingga berikutnya bersisi 6, yaitu segi enam. Bintang memang bersudut banyak tetapi bukan kelanjutan yang teratur dari deret ini, dan lingkaran tidak bersisi lurus sama sekali.",
  },
  {
    nomor: 21,
    kategori: "Figural",
    pertanyaan:
      "Gambar pertama berubah menjadi gambar kedua. Dengan perubahan yang sama, gambar ketiga akan menjadi ...",
    stimulus: { kolom: 4, sel: ["panah", "panah@90", "garis", "?"] },
    opsi: {
      A: "Garis miring turun ke kanan",
      B: "Garis mendatar",
      C: "Garis miring naik ke kanan",
      D: "Garis tegak",
    },
    opsiFigur: {
      A: "garis@45",
      B: "garis",
      C: "garis@135",
      D: "garis@90",
    },
    kunci: "D",
    pembahasan:
      "Perubahannya adalah pemutaran 90 derajat searah jarum jam: panah yang semula mendatar menjadi menghadap bawah. Diterapkan pada garis mendatar, hasilnya garis tegak. Jawaban A dan C hanya berputar 45 derajat, setengah dari yang seharusnya.",
  },
  {
    nomor: 22,
    kategori: "Figural",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan ketiga lainnya?",
    opsi: {
      A: "Dua lingkaran",
      B: "Dua segitiga",
      C: "Tiga persegi",
      D: "Dua bintang",
    },
    opsiFigur: {
      A: "lingkaran*2",
      B: "segitiga*2",
      C: "persegi*3",
      D: "bintang*2",
    },
    kunci: "C",
    pembahasan:
      "Tiga gambar lainnya sama-sama terdiri atas dua bangun; hanya satu yang terdiri atas tiga. Bentuk bangunnya sengaja dibuat berbeda-beda pada keempat pilihan sehingga bentuk bukan pembedanya — yang membedakan adalah cacahnya.",
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
        "lingkaran#separuh",
        "lingkaran#penuh",
        "lingkaran",
        "lingkaran#penuh",
        "lingkaran",
        "?",
      ],
    },
    opsi: {
      A: "Lingkaran bergaris",
      B: "Lingkaran terisi penuh",
      C: "Lingkaran terisi separuh",
      D: "Segitiga terisi separuh",
    },
    opsiFigur: {
      A: "lingkaran",
      B: "lingkaran#penuh",
      C: "lingkaran#separuh",
      D: "segitiga#separuh",
    },
    kunci: "C",
    pembahasan:
      "Bentuknya tetap lingkaran; yang berputar adalah cara pengisiannya — bergaris, separuh, penuh — dan urutan itu digeser satu langkah pada setiap baris. Baris ketiga sudah memakai penuh dan bergaris, jadi yang tersisa adalah separuh. Setiap kolom pun berisi ketiga isian tepat satu kali.",
  },
  {
    nomor: 24,
    kategori: "Figural",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["segitiga#penuh", "persegi", "segilima#penuh", "?"],
    },
    opsi: {
      A: "Segi enam bergaris",
      B: "Segi enam terisi penuh",
      C: "Segi lima bergaris",
      D: "Persegi terisi penuh",
    },
    opsiFigur: {
      A: "segienam",
      B: "segienam#penuh",
      C: "segilima",
      D: "persegi#penuh",
    },
    kunci: "A",
    pembahasan:
      "Dua aturan berjalan bersamaan. Jumlah sisinya bertambah satu: 3, 4, 5, lalu 6. Isinya berselang-seling: penuh, bergaris, penuh, sehingga giliran berikutnya bergaris. Jawaban B benar bentuknya tetapi salah isinya.",
  },
];

/* -------------------------------------------------------------------------- */
/*                  Sesi 2 — Tes Logika dan Penalaran Visual                  */
/* -------------------------------------------------------------------------- */

const VISUAL_2: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "lingkaran",
        "lingkaran*2",
        "lingkaran*3",
        "segitiga*2",
        "segitiga*3",
        "segitiga",
        "persegi*3",
        "persegi",
        "?",
      ],
    },
    opsi: {
      A: "Satu persegi",
      B: "Tiga persegi",
      C: "Dua persegi",
      D: "Dua segitiga",
    },
    opsiFigur: {
      A: "persegi",
      B: "persegi*3",
      C: "persegi*2",
      D: "segitiga*2",
    },
    kunci: "C",
    pembahasan:
      "Bentuk ditentukan barisnya, sedangkan cacahnya disusun seperti teka-teki angka: setiap baris dan setiap kolom memuat satu, dua, dan tiga tepat satu kali. Baris ketiga sudah memakai tiga dan satu, jadi tersisa dua. Kolom ketiga pun sudah memakai tiga dan satu — kedua arah memberi jawaban yang sama.",
  },
  {
    nomor: 2,
    kategori: "Rotasi",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: { kolom: 4, sel: ["panah", "panah@60", "panah@120", "?"] },
    opsi: {
      A: "Panah serong ke kiri-atas",
      B: "Panah mengarah ke kiri",
      C: "Panah serong ke kiri-bawah",
      D: "Panah serong ke kanan-atas",
    },
    opsiFigur: {
      A: "panah@240",
      B: "panah@180",
      C: "panah@120",
      D: "panah@300",
    },
    kunci: "B",
    pembahasan:
      "Panah berputar 60 derajat searah jarum jam setiap langkah: 0, 60, 120. Langkah berikutnya 180 derajat, yaitu tepat menghadap kiri. Jawaban A melompat dua langkah sekaligus, dan jawaban C mengulang gambar terakhir.",
  },
  {
    nomor: 3,
    kategori: "Pencerminan",
    pertanyaan:
      "Gambar berikut dicerminkan terhadap garis MENDATAR di bawahnya. Bagaimana bayangannya?",
    stimulus: { kolom: 1, sel: ["segitiga"] },
    opsi: {
      A: "Segitiga menghadap bawah",
      B: "Segitiga menghadap atas",
      C: "Segitiga menghadap kanan",
      D: "Segitiga menghadap kiri",
    },
    opsiFigur: {
      A: "segitiga@180",
      B: "segitiga",
      C: "segitiga@90",
      D: "segitiga@270",
    },
    kunci: "A",
    pembahasan:
      "Cermin mendatar menukar atas dengan bawah. Puncak segitiga yang semula di atas berpindah ke bawah, sehingga bayangannya adalah segitiga terbalik. Jawaban B keliru karena segitiga sama sisi tampak berubah jelas ketika dibalik atas-bawah — ia hanya tetap sama bila dicerminkan terhadap garis tegak.",
  },
  {
    nomor: 4,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["lingkaran", "segitiga*2", "persegi*3", "?"],
    },
    opsi: {
      A: "Tiga segi lima",
      B: "Empat segi enam",
      C: "Empat segi lima",
      D: "Empat persegi",
    },
    opsiFigur: {
      A: "segilima*3",
      B: "segienam*4",
      C: "segilima*4",
      D: "persegi*4",
    },
    kunci: "C",
    pembahasan:
      "Dua hal bertambah bersamaan. Bentuknya naik satu sisi setiap langkah — lingkaran, segitiga, persegi, lalu segi lima — dan cacahnya bertambah satu: 1, 2, 3, lalu 4. Jawaban B benar cacahnya tetapi melompati segi lima, sedangkan jawaban A benar bentuknya tetapi salah cacahnya.",
  },
  {
    nomor: 5,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: ["segienam", "segilima*2", "persegi*3", "?"],
    },
    opsi: {
      A: "Tiga segitiga",
      B: "Empat segitiga",
      C: "Empat persegi",
      D: "Empat segi lima",
    },
    opsiFigur: {
      A: "segitiga*3",
      B: "segitiga*4",
      C: "persegi*4",
      D: "segilima*4",
    },
    kunci: "B",
    pembahasan:
      "Perhatikan bahwa kedua aturan bergerak berlawanan arah: jumlah sisi berkurang satu (6, 5, 4, lalu 3) sementara cacah bangunnya bertambah satu (1, 2, 3, lalu 4). Jawaban yang benar harus memenuhi keduanya sekaligus, yaitu empat segitiga.",
  },
  {
    nomor: 6,
    kategori: "Ketidaksamaan",
    pertanyaan: "Manakah gambar yang TIDAK sekelompok dengan ketiga lainnya?",
    opsi: {
      A: "Panah mengarah ke kanan",
      B: "Panah mengarah ke bawah",
      C: "Panah mengarah ke kiri",
      D: "Panah serong ke kanan-bawah",
    },
    opsiFigur: {
      A: "panah",
      B: "panah@90",
      C: "panah@180",
      D: "panah@45",
    },
    kunci: "D",
    pembahasan:
      "Tiga panah lainnya menunjuk arah mata angin yang tegak lurus satu sama lain — kanan, bawah, kiri — yaitu kelipatan 90 derajat. Hanya satu panah yang menunjuk arah serong 45 derajat, sehingga ia yang keluar dari kelompok.",
  },
  {
    nomor: 7,
    kategori: "Analogi",
    pertanyaan:
      "Gambar pertama berubah menjadi gambar kedua. Dengan perubahan yang sama, gambar ketiga akan menjadi ...",
    stimulus: {
      kolom: 4,
      sel: ["lingkaran#penuh", "lingkaran", "segitiga#penuh", "?"],
    },
    opsi: {
      A: "Segitiga terisi penuh",
      B: "Segitiga terisi separuh",
      C: "Segitiga bergaris",
      D: "Lingkaran bergaris",
    },
    opsiFigur: {
      A: "segitiga#penuh",
      B: "segitiga#separuh",
      C: "segitiga",
      D: "lingkaran",
    },
    kunci: "C",
    pembahasan:
      "Perubahannya adalah pengosongan isi: dari terisi penuh menjadi bergaris, tanpa mengubah bentuknya. Diterapkan pada segitiga penuh, hasilnya segitiga bergaris. Jawaban B berhenti di tengah jalan, padahal contohnya melangkah langsung dari penuh ke kosong.",
  },
  {
    nomor: 8,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "panah",
        "panah#separuh",
        "panah#penuh",
        "panah@90",
        "panah@90#separuh",
        "panah@90#penuh",
        "panah@180",
        "panah@180#separuh",
        "?",
      ],
    },
    opsi: {
      A: "Panah ke kiri, bergaris",
      B: "Panah ke kiri, terisi penuh",
      C: "Panah ke bawah, terisi penuh",
      D: "Panah ke atas, terisi penuh",
    },
    opsiFigur: {
      A: "panah@180",
      B: "panah@180#penuh",
      C: "panah@90#penuh",
      D: "panah@270#penuh",
    },
    kunci: "B",
    pembahasan:
      "Arah panah ditentukan barisnya — kanan, bawah, kiri — sedangkan cara pengisiannya ditentukan kolomnya: bergaris, separuh, penuh. Sel yang ditanyakan berada di baris ketiga dan kolom ketiga, jadi jawabannya panah ke kiri yang terisi penuh.",
  },
  {
    nomor: 9,
    kategori: "Matriks",
    pertanyaan:
      "Perhatikan matriks berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 3,
      sel: [
        "silang",
        "lingkaran#penuh",
        "silang",
        "lingkaran#penuh",
        "silang",
        "lingkaran#penuh",
        "silang",
        "lingkaran#penuh",
        "?",
      ],
    },
    opsi: {
      A: "Lingkaran terisi penuh",
      B: "Tanda silang",
      C: "Persegi bergaris",
      D: "Sel dibiarkan kosong",
    },
    opsiFigur: {
      A: "lingkaran#penuh",
      B: "silang",
      C: "persegi",
      D: "kosong",
    },
    kunci: "B",
    pembahasan:
      "Kedua lambang berselang-seling seperti papan catur, baik dibaca mendatar maupun menurun. Sel yang ditanyakan bertetangga dengan lingkaran di sebelah kiri dan lingkaran di atasnya, jadi ia harus berisi tanda silang.",
  },
  {
    nomor: 10,
    kategori: "Pencerminan",
    pertanyaan:
      "Gambar berikut dicerminkan terhadap garis TEGAK di sampingnya. Bagaimana bayangannya?",
    stimulus: { kolom: 1, sel: ["segitiga@90"] },
    opsi: {
      A: "Segitiga menghadap kiri",
      B: "Segitiga menghadap kanan",
      C: "Segitiga menghadap atas",
      D: "Segitiga menghadap bawah",
    },
    opsiFigur: {
      A: "segitiga@270",
      B: "segitiga@90",
      C: "segitiga",
      D: "segitiga@180",
    },
    kunci: "A",
    pembahasan:
      "Cermin tegak menukar kiri dengan kanan. Puncak segitiga yang semula menunjuk ke kanan berpindah menunjuk ke kiri, sedangkan posisi atas-bawahnya tidak berubah. Jawaban C dan D adalah hasil pemutaran, bukan pencerminan.",
  },
  {
    nomor: 11,
    kategori: "Deret",
    pertanyaan:
      "Perhatikan deret gambar berikut. Gambar apakah yang tepat menggantikan tanda tanya?",
    stimulus: {
      kolom: 4,
      sel: [
        "segienam#penuh",
        "segilima#penuh",
        "persegi#penuh",
        "?",
      ],
    },
    opsi: {
      A: "Segitiga bergaris",
      B: "Segitiga terisi penuh",
      C: "Lingkaran terisi penuh",
      D: "Persegi terisi penuh",
    },
    opsiFigur: {
      A: "segitiga",
      B: "segitiga#penuh",
      C: "lingkaran#penuh",
      D: "persegi#penuh",
    },
    kunci: "B",
    pembahasan:
      "Jumlah sisinya berkurang satu setiap langkah — 6, 5, 4, lalu 3 — sementara isinya tetap penuh sepanjang deret. Jawaban A benar bentuknya tetapi mengubah isi yang seharusnya tidak berubah, sebuah jebakan yang sering muncul pada soal figural.",
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
        "segitiga*2",
        "persegi*3",
        "segitiga",
        "persegi*2",
        "lingkaran*3",
        "persegi",
        "lingkaran*2",
        "?",
      ],
    },
    opsi: {
      A: "Dua segitiga",
      B: "Tiga persegi",
      C: "Tiga lingkaran",
      D: "Tiga segitiga",
    },
    opsiFigur: {
      A: "segitiga*2",
      B: "persegi*3",
      C: "lingkaran*3",
      D: "segitiga*3",
    },
    kunci: "D",
    pembahasan:
      "Dua aturan berjalan pada arah yang berbeda. Bentuk bergeser satu langkah di setiap baris, sehingga baris ketiga berurutan persegi, lingkaran, segitiga. Cacahnya ditentukan kolomnya: satu, dua, tiga. Sel yang ditanyakan berada di kolom ketiga, jadi jawabannya tiga segitiga.",
  },
];

/* -------------------------------------------------------------------------- */
/*                   Sesi 4 — Tes Kepribadian dan Emosi                       */
/* -------------------------------------------------------------------------- */

const EMOSI_2: SoalSkor[] = [
  {
    nomor: 1,
    kategori: "Integritas",
    pertanyaan:
      "Seorang kakak kelas menyuruh Anda mengambilkan barang dari tempat yang sedang dilarang dimasuki. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menuruti karena ia lebih senior dan Anda tidak enak menolak",
      B: "Menolak dengan sopan dan menjelaskan bahwa tempat itu sedang dilarang dimasuki",
      C: "Pura-pura tidak mendengar lalu pergi menjauh",
      D: "Menuruti tetapi diam-diam meminta teman lain yang melakukannya",
    },
    kunci: "B",
    pembahasan:
      "Menghormati senior tidak berarti mengikuti perintah yang melanggar aturan. Menolak dengan sopan sekaligus menyebut alasannya menjaga dua hal: aturan tetap ditegakkan, hubungan tetap terjaga. Pilihan A menempatkan sungkan di atas aturan, C menghindar tanpa menyelesaikan, dan D memindahkan pelanggaran kepada orang lain.",
  },
  {
    nomor: 2,
    kategori: "Kemauan Belajar",
    pertanyaan:
      "Anda ditugasi mengerjakan sesuatu yang belum pernah Anda pelajari sama sekali. Langkah pertama yang paling tepat adalah ...",
    opsi: {
      A: "Menolak tugas itu karena bukan bidang Anda",
      B: "Mengerjakan asal jadi supaya cepat selesai",
      C: "Mencari tahu dahulu caranya, lalu bertanya pada bagian yang tetap tidak Anda pahami",
      D: "Menunggu sampai ada orang lain yang mengerjakannya",
    },
    kunci: "C",
    pembahasan:
      "Yang dinilai adalah kesediaan belajar sebelum menyerah. Mencari tahu lebih dahulu menunjukkan kemandirian, dan bertanya pada bagian yang masih gelap menunjukkan kejujuran tentang batas kemampuan. Pilihan A menutup kesempatan berkembang, B menghasilkan pekerjaan yang tidak dapat dipakai, dan D melepaskan tanggung jawab yang sudah diberikan.",
  },
  {
    nomor: 3,
    kategori: "Menerima Kritik",
    pertanyaan:
      "Pembina menegur Anda di depan seluruh peleton atas kesalahan kecil. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menerima teguran itu, memperbaiki kesalahan, dan bila masih ada yang mengganjal, menanyakannya secara pribadi setelah kegiatan",
      B: "Membantah saat itu juga agar tidak dianggap salah",
      C: "Menerima tetapi kemudian menceritakan kekesalan Anda kepada teman-teman",
      D: "Menghindari pembina itu untuk beberapa hari ke depan",
    },
    kunci: "A",
    pembahasan:
      "Teguran di depan umum memang tidak nyaman, tetapi yang dinilai adalah kemampuan memisahkan isi teguran dari cara penyampaiannya. Memperbaiki lebih dahulu, lalu menanyakan pada waktu yang tepat, adalah jalan yang menjaga keduanya. Pilihan B memperbesar masalah di depan orang banyak, C memindahkan kekesalan tanpa menyelesaikannya, dan D memutus hubungan yang justru Anda perlukan.",
  },
  {
    nomor: 4,
    kategori: "Kepedulian",
    pertanyaan:
      "Seorang teman diam-diam bercerita bahwa ia ingin berhenti sekolah karena merasa tidak sanggup. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menyuruhnya berhenti mengeluh karena semua orang juga lelah",
      B: "Menceritakan hal itu kepada teman-teman lain agar ramai-ramai menasihatinya",
      C: "Menyimpan cerita itu sendiri dan tidak melakukan apa-apa",
      D: "Mendengarkan dengan sungguh-sungguh, lalu mendorongnya berbicara dengan pengasuh atau guru bimbingan",
    },
    kunci: "D",
    pembahasan:
      "Yang ia butuhkan lebih dahulu adalah didengar, bukan dinilai. Setelah itu ia perlu diarahkan kepada orang yang memang berwenang membantu. Pilihan A menutup pembicaraan sebelum dimulai, B menyebarkan hal pribadi sehingga kepercayaannya rusak, dan C membiarkan kesulitan yang bisa jadi serius berjalan tanpa pertolongan.",
  },
  {
    nomor: 5,
    kategori: "Kelapangan Hati",
    pertanyaan:
      "Anda kalah tipis dalam pemilihan ketua kelas dari teman dekat Anda sendiri. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Menjaga jarak darinya agar tidak terlihat iri",
      B: "Mengucapkan selamat dan menawarkan diri membantu kepengurusannya",
      C: "Menunggu ia membuat kesalahan agar kelas menyesal",
      D: "Menganggap pemilihan itu tidak berjalan jujur",
    },
    kunci: "B",
    pembahasan:
      "Kalah dalam pemilihan menguji kelapangan hati sekaligus kesetiaan pada kelompok. Mengucapkan selamat lalu ikut membantu menunjukkan bahwa kepentingan kelas ditempatkan di atas kekecewaan pribadi. Pilihan A dan C membiarkan kekecewaan mengendalikan sikap, sedangkan D mencari sebab di luar diri tanpa dasar.",
  },
  {
    nomor: 6,
    kategori: "Evaluasi Diri",
    pertanyaan:
      "Sudah dua bulan Anda berlatih rutin, tetapi hasil latihan tidak kunjung membaik. Langkah paling tepat adalah ...",
    opsi: {
      A: "Meminta pelatih menilai cara latihan Anda, lalu mengubah bagian yang keliru",
      B: "Menambah jam latihan dengan cara yang sama sampai hasilnya berubah",
      C: "Berganti ke kegiatan lain yang lebih mudah",
      D: "Menyimpulkan bahwa Anda memang tidak berbakat",
    },
    kunci: "A",
    pembahasan:
      "Ketika usaha sudah cukup tetapi hasilnya tidak berubah, biasanya yang perlu diperiksa adalah caranya, bukan jumlahnya. Meminta penilaian orang yang lebih ahli adalah jalan tercepat menemukan letak kekeliruan. Pilihan B menambah beban tanpa mengubah sebab, C melarikan diri dari kesulitan, dan D menyimpulkan bakat terlalu dini dari satu tolok ukur.",
  },
  {
    nomor: 7,
    kategori: "Kestabilan Emosi",
    pertanyaan:
      "Anda sangat marah kepada teman sekamar yang berulang kali memakai barang Anda tanpa izin. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Meluapkan kemarahan saat itu juga agar ia jera",
      B: "Balas memakai barangnya tanpa izin",
      C: "Menenangkan diri sebentar, lalu menyampaikan keberatan Anda dengan jelas dan tanpa menyerang pribadinya",
      D: "Memendamnya dan menghindari berbicara dengannya",
    },
    kunci: "C",
    pembahasan:
      "Marah adalah perasaan yang wajar; yang dinilai adalah jarak antara merasa dan bertindak. Menunda sebentar membuat keberatan tersampaikan sebagai persoalan perilaku, bukan serangan pribadi, sehingga peluang berubahnya jauh lebih besar. Pilihan A dan B membalas dengan cara yang sama buruknya, dan D membiarkan hal itu terulang.",
  },
  {
    nomor: 8,
    kategori: "Kepemimpinan",
    pertanyaan:
      "Anda mendadak ditunjuk menjadi ketua panitia kegiatan yang tinggal tiga hari lagi. Langkah pertama yang paling tepat adalah ...",
    opsi: {
      A: "Mengerjakan sendiri sebanyak mungkin agar cepat selesai",
      B: "Mendaftar pekerjaan yang tersisa, membaginya kepada anggota sesuai kemampuan, lalu menetapkan waktu pemeriksaan bersama",
      C: "Menolak karena waktunya terlalu mepet",
      D: "Menyerahkan seluruhnya kepada anggota yang sudah berpengalaman",
    },
    kunci: "B",
    pembahasan:
      "Dalam waktu sempit, yang paling menentukan adalah kejelasan siapa mengerjakan apa dan kapan diperiksa. Pilihan A membuat ketua menjadi penghambat karena semua menunggu satu orang; C melepaskan kepercayaan yang sudah diberikan; dan D memang mendelegasikan, tetapi tanpa arahan dan pemeriksaan, itu sama dengan melepas tanggung jawab.",
  },
  {
    nomor: 9,
    kategori: "Keberanian Moral",
    pertanyaan:
      "Anda melihat beberapa teman terus-menerus mengolok-olok seorang adik kelas sampai ia menangis. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Ikut tertawa agar tidak dijauhi kelompok",
      B: "Menghentikan perbuatan itu, menenangkan adik kelas tersebut, dan melaporkannya kepada pembina bila berlanjut",
      C: "Diam saja karena bukan urusan Anda",
      D: "Merekam kejadian itu untuk ditunjukkan kepada orang lain",
    },
    kunci: "B",
    pembahasan:
      "Perundungan berhenti ketika ada yang berani menghentikannya, dan diam sudah cukup untuk membuatnya berlanjut. Pilihan A menjadikan Anda bagian dari perbuatan itu, C membiarkan kerugian terjadi pada orang yang lebih lemah, dan D menyimpan bukti tanpa menolong korban yang sedang membutuhkan pertolongan saat itu juga.",
  },
  {
    nomor: 10,
    kategori: "Menghadapi Tekanan",
    pertanyaan:
      "Satu jam sebelum ujian, Anda sadar kartu peserta Anda hilang. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Segera melapor kepada panitia sambil menyiapkan identitas lain yang Anda punya",
      B: "Terus mencari sendiri sampai menit terakhir tanpa memberi tahu siapa pun",
      C: "Meminjam kartu teman yang tidak ikut ujian",
      D: "Membatalkan niat ikut ujian karena syaratnya tidak lengkap",
    },
    kunci: "A",
    pembahasan:
      "Dalam keadaan mendesak, langkah pertama yang benar adalah memberi tahu pihak yang punya wewenang menyelesaikannya, sambil menyiapkan pilihan cadangan. Pilihan B menghabiskan waktu yang justru paling berharga; C adalah pemalsuan identitas yang jauh lebih berat akibatnya daripada kartu yang hilang; dan D menyerah sebelum mencari jalan keluar yang sebenarnya tersedia.",
  },
  {
    nomor: 11,
    kategori: "Kepatuhan",
    pertanyaan:
      "Sekolah menerapkan aturan baru yang menurut Anda memberatkan dan kurang masuk akal. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Mengabaikan aturan itu selama tidak ada yang mengawasi",
      B: "Mengajak teman-teman menolak beramai-ramai",
      C: "Menjalankan aturan itu sambil menyampaikan keberatan dan usulan melalui wakil kelas atau pembina",
      D: "Menjalankannya sambil terus mengeluh kepada siapa saja",
    },
    kunci: "C",
    pembahasan:
      "Ketidaksetujuan yang disalurkan lewat jalur resmi punya peluang mengubah aturan; yang disalurkan lewat pelanggaran hanya menambah masalah baru. Pilihan A menjadikan kepatuhan bergantung pada ada tidaknya pengawas — persis yang tidak dicari dalam seleksi ini. Pilihan B mengubah keberatan menjadi perlawanan, dan D menyebarkan keluhan tanpa pernah sampai ke pihak yang dapat memutuskan.",
  },
  {
    nomor: 12,
    kategori: "Kejujuran",
    pertanyaan:
      "Anda sedang kurang sehat pada hari kegiatan penting, tetapi tidak ingin dianggap lemah. Sikap yang paling tepat adalah ...",
    opsi: {
      A: "Memaksakan diri ikut penuh tanpa memberi tahu siapa pun",
      B: "Melaporkan keadaan Anda kepada petugas kesehatan atau pembina, lalu mengikuti kegiatan sejauh yang diizinkan",
      C: "Tidak ikut sama sekali dan beristirahat tanpa memberi kabar",
      D: "Meminta teman mengatakan bahwa Anda sakit berat agar dibebastugaskan",
    },
    kunci: "B",
    pembahasan:
      "Menyembunyikan kondisi tubuh bukan bentuk ketangguhan, melainkan risiko bagi diri sendiri dan bagi regu yang mengandalkan Anda. Melapor lebih dahulu membuat keputusan diambil oleh orang yang tepat. Pilihan A membahayakan diri, C menghilang tanpa kabar sehingga regu terganggu, dan D melebih-lebihkan keadaan yang berarti berbohong.",
  },
];

/* -------------------------------------------------------------------------- */

export const PAKET_PSIKOTES_2: PaketPsikotes = {
  id: "psi-2",
  nomor: 2,
  nama: "Try Out Psikotes 2",
  deskripsi:
    "Tingkat menengah. Deretnya berlapis, penalaran verbalnya memakai ingkaran dan rantai sebab-akibat, dan soal figuralnya menjalankan dua aturan sekaligus.",
  sesi: [
    {
      id: "tiu",
      jenis: "skor",
      nama: "Tes Intelegensi Umum (TIU)",
      ringkas: "Verbal, numerik, dan figural",
      petunjuk:
        "Kerjakan soal yang Anda yakini lebih dahulu, lalu kembali ke soal yang sulit. Tidak ada pengurangan nilai untuk jawaban salah, jadi tidak ada gunanya membiarkan soal kosong pada menit-menit terakhir.",
      durasiMenit: 20,
      soal: TIU_2,
    },
    {
      id: "visual",
      jenis: "skor",
      nama: "Tes Logika dan Penalaran Visual",
      ringkas: "Pola gambar dan simbol geometris",
      petunjuk:
        "Pada paket ini banyak soal menjalankan dua aturan sekaligus — misalnya bentuk berubah sementara cacahnya juga berubah. Pastikan jawaban yang Anda pilih memenuhi seluruh aturan, bukan hanya salah satunya.",
      durasiMenit: 10,
      soal: VISUAL_2,
    },
    {
      id: "epps",
      jenis: "epps",
      nama: "Tes EPPS (Kecenderungan Pribadi)",
      ringkas: "Pasangan pernyataan, pilih yang paling menggambarkan diri",
      petunjuk:
        "Pilih pernyataan yang paling menggambarkan diri Anda apa adanya, bukan yang terdengar paling baik. Kedua pernyataan memang sama-sama positif — itu memang disengaja. Jawablah cepat sesuai kesan pertama; jawaban yang terlalu lama dipikirkan justru menjauh dari keadaan sebenarnya.",
      durasiMenit: 18,
      pasangan: EPPS_PAKET_2,
    },
    {
      id: "emosi",
      jenis: "skor",
      nama: "Tes Kepribadian dan Emosi",
      ringkas: "Sikap menghadapi tekanan dan situasi sulit",
      petunjuk:
        "Setiap butir menggambarkan keadaan yang mungkin Anda temui di asrama atau di sekolah. Pilih tindakan yang paling tepat — bukan yang paling mudah, dan bukan pula yang paling keras.",
      durasiMenit: 10,
      soal: EMOSI_2,
    },
  ],
};
