import { periksaSeimbang, susun } from "@/lib/psikotes/epps";

/**
 * Bank pernyataan EPPS untuk paket 4 sampai 10.
 *
 * Dipisahkan dari `epps.ts` semata karena panjangnya; aturan penyusunannya
 * sama persis. Ketujuh set memakai jadwal pasangan dimensi yang sama dengan
 * paket 1-3 — sepuluh kemungkinan pasangan, masing-masing dua kali — sehingga
 * setiap dimensi tetap memperoleh delapan kesempatan dipilih dan profil yang
 * dihasilkan tidak berat sebelah.
 *
 * Yang berganti hanyalah pernyataannya, dengan latar yang bergeser dari
 * kegiatan sekolah ke kehidupan berasrama, tugas kepanitiaan, dan keadaan
 * sehari-hari di rumah.
 */

export const EPPS_PAKET_4 = periksaSeimbang(
  "paket 4",
  susun([
    ["Saya membagi tugas piket agar tidak ada yang terlalu berat.", "P",
     "Saya mengerjakan tugas pada jam yang sama setiap hari.", "D"],

    ["Saya mengulang bagian yang belum saya kuasai walau sudah larut.", "K",
     "Saya mengembalikan barang pinjaman tepat pada waktu yang dijanjikan.", "T"],

    ["Saya mencuci dan menyetrika pakaian saya sendiri.", "M",
     "Saya melipat seragam segera setelah kering.", "D"],

    ["Saya bersedia menjadi ketua panitia kegiatan sekolah.", "P",
     "Saya menyelesaikan pekerjaan yang menjadi bagian saya lebih dahulu.", "T"],

    ["Saya bertahan menyelesaikan hafalan panjang sampai lancar.", "K",
     "Saya memilih kegiatan tambahan berdasarkan pertimbangan saya sendiri.", "M"],

    ["Saya mengembalikan alat kebersihan setelah tugas selesai.", "T",
     "Saya berangkat dari rumah pada jam yang sudah saya tetapkan.", "D"],

    ["Saya mengambil peran memimpin ketika regu kehilangan arah.", "P",
     "Saya menyelesaikan latihan fisik sampai hitungan terakhir.", "K"],

    ["Saya menabung sendiri untuk keperluan yang saya inginkan.", "M",
     "Saya memberi tahu lebih awal bila saya tidak dapat memenuhi janji.", "T"],

    ["Saya memeriksa perlengkapan sebelum berangkat kegiatan.", "D",
     "Saya berlatih menulis rapi setiap hari sampai bentuk hurufnya tetap.", "K"],

    ["Saya berani menghadiri kegiatan baru tanpa ditemani teman.", "M",
     "Saya senang menjadi orang yang mengarahkan jalannya diskusi.", "P"],

    ["Saya menaati jam belajar malam walau tidak ada yang memeriksa.", "D",
     "Saya mendorong teman satu regu agar tidak menyerah.", "P"],

    ["Saya mengakui bagian pekerjaan yang belum saya kerjakan.", "T",
     "Saya menyelesaikan buku latihan sampai halaman terakhir.", "K"],

    ["Saya menyimpan catatan pada map yang sudah saya beri nama.", "D",
     "Saya mencoba memperbaiki kesalahan saya sebelum meminta bantuan.", "M"],

    ["Saya menerima teguran tanpa mencari-cari pembelaan.", "T",
     "Saya menenangkan teman-teman ketika suasana menjadi ribut.", "P"],

    ["Saya menentukan sendiri sasaran yang ingin saya capai bulan ini.", "M",
     "Saya melanjutkan latihan yang sama walau hasilnya belum terlihat.", "K"],

    ["Saya membuat daftar tugas setiap awal pekan.", "D",
     "Saya melapor kepada pembina bila ada barang regu yang hilang.", "T"],

    ["Saya mengerjakan soal yang sulit sampai ketemu caranya.", "K",
     "Saya bersedia menyampaikan pendapat regu di depan pembina.", "P"],

    ["Saya menyelesaikan urusan sekolah saya tanpa diantar orang tua.", "M",
     "Saya menjalankan tugas yang dipercayakan kepada saya sampai tuntas.", "T"],

    ["Saya menjaga jam makan tetap teratur setiap hari.", "D",
     "Saya terus berlatih walau belum menang satu kali pun.", "K"],

    ["Saya lebih suka menyelesaikan masalah saya seorang diri.", "M",
     "Saya senang mengajak teman-teman mengerjakan sesuatu bersama.", "P"],
  ]),
);

/* -------------------------------------------------------------------------- */

export const EPPS_PAKET_5 = periksaSeimbang(
  "paket 5",
  susun([
    ["Saya menunjuk siapa mengerjakan apa ketika kelompok kebingungan.", "P",
     "Saya menyiapkan seragam malam sebelumnya agar pagi tidak tergesa.", "D"],

    ["Saya mengulang percobaan sampai hasilnya benar-benar tepat.", "K",
     "Saya mengganti kerugian yang timbul karena kelalaian saya.", "T"],

    ["Saya memasak sendiri ketika tidak ada orang di rumah.", "M",
     "Saya merapikan tempat tidur segera setelah bangun.", "D"],

    ["Saya bersedia mewakili kelas dalam pertemuan dengan guru.", "P",
     "Saya menuntaskan bagian saya sebelum pergi bermain.", "T"],

    ["Saya menekuni satu keterampilan sampai benar-benar mahir.", "K",
     "Saya memilih jurusan berdasarkan pertimbangan saya sendiri.", "M"],

    ["Saya menyerahkan kembali uang kas beserta catatannya.", "T",
     "Saya menyelesaikan tugas jauh sebelum batas waktunya.", "D"],

    ["Saya berani mengambil keputusan ketika tidak ada yang bersedia.", "P",
     "Saya menyelesaikan pekerjaan yang panjang tanpa mengeluh.", "K"],

    ["Saya mengatur sendiri jadwal kegiatan saya di luar sekolah.", "M",
     "Saya menepati apa yang sudah saya janjikan kepada guru.", "T"],

    ["Saya memeriksa daftar barang sebelum berangkat berkemah.", "D",
     "Saya mengulang latihan yang sama setiap hari tanpa bosan.", "K"],

    ["Saya nyaman mengerjakan tugas sendiri di tempat yang sepi.", "M",
     "Saya senang memimpin latihan baris-berbaris.", "P"],

    ["Saya bangun dan tidur pada jam yang sama walau hari libur.", "D",
     "Saya menegur dengan baik teman yang mengganggu ketertiban.", "P"],

    ["Saya berterus terang bila saya yang menyebabkan kesalahan.", "T",
     "Saya menyelesaikan proyek yang saya mulai sampai jadi.", "K"],

    ["Saya menyusun buku pelajaran menurut jadwal harian.", "D",
     "Saya mencari sendiri keterangan yang saya perlukan.", "M"],

    ["Saya menerima akibat dari kelalaian saya tanpa menyalahkan orang lain.", "T",
     "Saya mengatur jalannya kegiatan bila petugasnya berhalangan.", "P"],

    ["Saya menentukan sendiri cara belajar yang paling cocok bagi saya.", "M",
     "Saya bertahan pada satu cara sampai benar-benar terbukti gagal.", "K"],

    ["Saya menuliskan rencana kegiatan sebelum mengerjakannya.", "D",
     "Saya menyampaikan sendiri laporan kegiatan kepada pembina.", "T"],

    ["Saya mengerjakan latihan tambahan tanpa disuruh siapa pun.", "K",
     "Saya bersedia menjadi juru bicara ketika kelompok perlu berbicara.", "P"],

    ["Saya mengurus keperluan asrama saya sendiri.", "M",
     "Saya menyelesaikan tugas piket walau sedang tidak enak badan.", "T"],

    ["Saya menjaga kerapian lemari setiap pekan.", "D",
     "Saya berlatih sampai gerakan saya benar, bukan sampai waktunya habis.", "K"],

    ["Saya lebih suka menentukan langkah saya sendiri.", "M",
     "Saya senang menyemangati teman yang sedang patah semangat.", "P"],
  ]),
);

/* -------------------------------------------------------------------------- */

export const EPPS_PAKET_6 = periksaSeimbang(
  "paket 6",
  susun([
    ["Saya mengatur giliran bicara agar diskusi tidak kacau.", "P",
     "Saya menaruh sepatu pada rak sesuai tempatnya.", "D"],

    ["Saya mengerjakan soal yang sama berkali-kali sampai tidak keliru lagi.", "K",
     "Saya menanggung sendiri akibat kelalaian saya.", "T"],

    ["Saya berangkat sekolah sendiri sejak kelas satu.", "M",
     "Saya menyiapkan buku sesuai jadwal setiap malam.", "D"],

    ["Saya berani menyampaikan usul yang berbeda di depan kelompok.", "P",
     "Saya menyelesaikan tugas kelompok yang menjadi bagian saya.", "T"],

    ["Saya sanggup berlatih berbulan-bulan untuk satu lomba.", "K",
     "Saya memilih kegiatan tanpa terpengaruh pilihan teman.", "M"],

    ["Saya mengembalikan barang temuan kepada pemiliknya.", "T",
     "Saya menepati jam janji temu tanpa terlambat.", "D"],

    ["Saya memimpin regu ketika ketua berhalangan hadir.", "P",
     "Saya menyelesaikan pekerjaan yang membosankan sampai habis.", "K"],

    ["Saya menyiapkan sendiri berkas pendaftaran saya.", "M",
     "Saya menyelesaikan pekerjaan yang sudah saya sanggupi.", "T"],

    ["Saya memeriksa ulang hitungan sebelum menyerahkannya.", "D",
     "Saya membaca ulang materi yang sulit sampai paham.", "K"],

    ["Saya berani bertanya sendiri kepada guru tanpa ditemani.", "M",
     "Saya senang menjadi orang yang menggerakkan kegiatan.", "P"],

    ["Saya menjalankan aturan asrama walau tidak diawasi.", "D",
     "Saya mengingatkan teman yang lupa tugasnya.", "P"],

    ["Saya mengakui kekeliruan saya di depan kelompok.", "T",
     "Saya melanjutkan latihan sampai jadwalnya berakhir.", "K"],

    ["Saya menaruh alat tulis pada tempat yang sama setiap hari.", "D",
     "Saya menyelesaikan kesulitan saya sebelum meminta bantuan.", "M"],

    ["Saya bersedia diperiksa hasil kerjanya kapan saja.", "T",
     "Saya mengambil alih pimpinan ketika keadaan mendesak.", "P"],

    ["Saya menetapkan sendiri sasaran belajar saya.", "M",
     "Saya bertahan pada tugas yang lama membuahkan hasil.", "K"],

    ["Saya menyusun jadwal harian dan menempelnya di meja.", "D",
     "Saya melaporkan pelanggaran yang saya lakukan sendiri.", "T"],

    ["Saya menyelesaikan bacaan panjang sampai halaman terakhir.", "K",
     "Saya bersedia memimpin apel bila diminta.", "P"],

    ["Saya mengatur sendiri pengeluaran saya setiap bulan.", "M",
     "Saya menuntaskan tugas yang dipercayakan kepada saya.", "T"],

    ["Saya menjaga jadwal olahraga tetap berjalan setiap pekan.", "D",
     "Saya mengulang gerakan sampai benar walau melelahkan.", "K"],

    ["Saya lebih tenang bekerja tanpa banyak arahan orang lain.", "M",
     "Saya senang mengajak orang lain mencapai satu sasaran.", "P"],
  ]),
);

/* -------------------------------------------------------------------------- */

export const EPPS_PAKET_7 = periksaSeimbang(
  "paket 7",
  susun([
    ["Saya menyusun urutan kerja agar kelompok tidak berebut tugas.", "P",
     "Saya membersihkan meja sebelum meninggalkan ruangan.", "D"],

    ["Saya tetap mengerjakan tugas panjang sampai bagian terakhir.", "K",
     "Saya memperbaiki kesalahan saya tanpa menunggu ditegur.", "T"],

    ["Saya mengurus sendiri perbaikan sepeda saya.", "M",
     "Saya mengembalikan buku perpustakaan sebelum jatuh tempo.", "D"],

    ["Saya bersedia memimpin regu pada kegiatan luar ruang.", "P",
     "Saya menyelesaikan janji saya kepada kelompok.", "T"],

    ["Saya mengulang latihan yang gagal sampai berhasil.", "K",
     "Saya menentukan sendiri kegiatan yang ingin saya ikuti.", "M"],

    ["Saya menyerahkan kembali perlengkapan yang saya pinjam dalam keadaan utuh.", "T",
     "Saya datang lima belas menit sebelum kegiatan dimulai.", "D"],

    ["Saya berani memulai pembicaraan ketika suasana kaku.", "P",
     "Saya menyelesaikan pekerjaan yang menuntut ketelitian lama.", "K"],

    ["Saya menyiapkan sendiri keperluan perjalanan saya.", "M",
     "Saya memenuhi kewajiban saya walau sedang tidak ingin.", "T"],

    ["Saya menandai tanggal penting pada kalender saya.", "D",
     "Saya mengulang materi yang sudah lewat agar tidak lupa.", "K"],

    ["Saya nyaman mengurus keperluan saya tanpa ditemani.", "M",
     "Saya senang diberi tanggung jawab memimpin kegiatan.", "P"],

    ["Saya mengenakan pakaian sesuai ketentuan setiap saat.", "D",
     "Saya menengahi teman yang sedang berselisih.", "P"],

    ["Saya mengakui bila saya belum menyelesaikan bagian saya.", "T",
     "Saya menuntaskan pekerjaan yang saya mulai walau lama.", "K"],

    ["Saya menyimpan berkas menurut urutan tanggalnya.", "D",
     "Saya mencari jalan keluar sendiri sebelum mengeluh.", "M"],

    ["Saya menerima tugas tambahan sebagai akibat kelalaian saya.", "T",
     "Saya mengarahkan teman ketika pekerjaan menjadi berantakan.", "P"],

    ["Saya menentukan sendiri batas waktu bagi pekerjaan saya.", "M",
     "Saya bertahan pada satu latihan sampai benar-benar bisa.", "K"],

    ["Saya membuat catatan rencana sebelum kegiatan berjalan.", "D",
     "Saya menyampaikan kabar buruk lebih dahulu daripada menyembunyikannya.", "T"],

    ["Saya belajar tambahan meski tidak ada ujian dekat.", "K",
     "Saya bersedia berbicara di depan orang banyak.", "P"],

    ["Saya mengurus keperluan sekolah saya tanpa bantuan siapa pun.", "M",
     "Saya menyelesaikan tanggung jawab saya sampai tuntas.", "T"],

    ["Saya menjaga waktu istirahat tetap teratur.", "D",
     "Saya melanjutkan usaha walau hasilnya belum tampak.", "K"],

    ["Saya lebih puas dengan hasil yang saya capai sendiri.", "M",
     "Saya senang menggerakkan teman-teman mencapai satu tujuan.", "P"],
  ]),
);

/* -------------------------------------------------------------------------- */

export const EPPS_PAKET_8 = periksaSeimbang(
  "paket 8",
  susun([
    ["Saya mengatur pembagian peran agar setiap orang tahu tugasnya.", "P",
     "Saya menyimpan barang kembali ke tempatnya setelah dipakai.", "D"],

    ["Saya mengerjakan latihan tambahan walau tidak diperiksa.", "K",
     "Saya menyelesaikan kewajiban saya walau sedang lelah.", "T"],

    ["Saya menyiapkan sendiri sarapan saya setiap pagi.", "M",
     "Saya membersihkan kamar pada jam yang sama setiap hari.", "D"],

    ["Saya bersedia menjadi ketua regu bila dipilih teman-teman.", "P",
     "Saya menuntaskan pekerjaan yang saya terima.", "T"],

    ["Saya bertahan pada latihan berat sampai jadwal berakhir.", "K",
     "Saya menentukan sendiri arah belajar saya.", "M"],

    ["Saya menyerahkan laporan kegiatan tepat waktu.", "T",
     "Saya menyusun ulang jadwal bila ada yang berubah.", "D"],

    ["Saya berani memulai pekerjaan yang belum ada yang mengerjakannya.", "P",
     "Saya menyelesaikan pekerjaan berulang tanpa kehilangan ketelitian.", "K"],

    ["Saya mengurus sendiri urusan administrasi saya.", "M",
     "Saya memenuhi kesepakatan yang sudah saya buat.", "T"],

    ["Saya menyiapkan perlengkapan sesuai daftar sebelum berangkat.", "D",
     "Saya mengulang materi yang sudah saya pelajari agar melekat.", "K"],

    ["Saya berani mengikuti kegiatan yang tidak ada teman saya di sana.", "M",
     "Saya senang mengarahkan jalannya kegiatan.", "P"],

    ["Saya menaati aturan walau tidak ada yang mengawasi.", "D",
     "Saya menegur teman yang mengabaikan tugasnya.", "P"],

    ["Saya berterus terang mengenai hasil kerja saya yang belum selesai.", "T",
     "Saya menyelesaikan pekerjaan bertahap sampai bagian terakhir.", "K"],

    ["Saya menyusun barang menurut urutan pemakaiannya.", "D",
     "Saya menyelesaikan kesulitan saya tanpa merepotkan orang lain.", "M"],

    ["Saya menerima hukuman atas kesalahan yang saya perbuat.", "T",
     "Saya mengambil peran memimpin ketika tidak ada yang bergerak.", "P"],

    ["Saya menetapkan sendiri sasaran yang ingin saya capai.", "M",
     "Saya melanjutkan usaha walau sudah beberapa kali gagal.", "K"],

    ["Saya mencatat semua kewajiban agar tidak ada yang terlewat.", "D",
     "Saya melaporkan sendiri kekeliruan yang saya lakukan.", "T"],

    ["Saya belajar terus sampai bagian yang sulit menjadi mudah.", "K",
     "Saya bersedia mewakili kelompok berbicara di depan umum.", "P"],

    ["Saya mengurus keperluan pribadi saya tanpa bergantung kepada siapa pun.", "M",
     "Saya menyelesaikan tugas yang dipercayakan kepada saya.", "T"],

    ["Saya menjaga jam belajar tetap sama setiap hari.", "D",
     "Saya berlatih sampai gerakan saya benar-benar tepat.", "K"],

    ["Saya lebih suka bekerja menurut cara saya sendiri.", "M",
     "Saya senang mengajak teman bergerak bersama.", "P"],
  ]),
);

/* -------------------------------------------------------------------------- */

export const EPPS_PAKET_9 = periksaSeimbang(
  "paket 9",
  susun([
    ["Saya mengambil keputusan ketika kelompok tidak kunjung sepakat.", "P",
     "Saya membereskan perlengkapan sebelum meninggalkan lapangan.", "D"],

    ["Saya menyelesaikan latihan sampai jumlah yang saya targetkan.", "K",
     "Saya mengganti barang yang rusak di tangan saya.", "T"],

    ["Saya mengatur sendiri perjalanan saya ke luar kota.", "M",
     "Saya menyetrika seragam setiap akhir pekan.", "D"],

    ["Saya bersedia memimpin rapat kelas.", "P",
     "Saya menyelesaikan tugas yang menjadi bagian saya lebih dahulu.", "T"],

    ["Saya mengulang bacaan sulit sampai benar-benar mengerti.", "K",
     "Saya memutuskan sendiri kegiatan yang saya ikuti.", "M"],

    ["Saya mengembalikan sisa uang kegiatan beserta bukti belanjanya.", "T",
     "Saya menyelesaikan pekerjaan sesuai urutan yang saya rencanakan.", "D"],

    ["Saya berani memulai ketika belum ada yang bergerak.", "P",
     "Saya mengerjakan pekerjaan panjang tanpa berhenti di tengah.", "K"],

    ["Saya mengurus sendiri perlengkapan yang saya perlukan.", "M",
     "Saya menepati janji saya meskipun keadaan berubah.", "T"],

    ["Saya memeriksa jadwal sebelum menyanggupi kegiatan baru.", "D",
     "Saya mengulang latihan sampai kesalahannya hilang.", "K"],

    ["Saya nyaman menjalani kegiatan tanpa ditemani teman dekat.", "M",
     "Saya senang menjadi orang yang mengambil keputusan.", "P"],

    ["Saya menjalankan tata tertib walau sedang tidak diawasi.", "D",
     "Saya mengingatkan teman dengan cara yang baik.", "P"],

    ["Saya mengakui bagian yang belum saya kerjakan tanpa berdalih.", "T",
     "Saya menuntaskan pekerjaan yang saya mulai.", "K"],

    ["Saya menyimpan berkas penting pada tempat khusus.", "D",
     "Saya mencari sendiri jalan keluar sebelum meminta tolong.", "M"],

    ["Saya menerima akibat dari keputusan yang saya ambil.", "T",
     "Saya menenangkan keadaan ketika kelompok panik.", "P"],

    ["Saya menetapkan sendiri ukuran keberhasilan saya.", "M",
     "Saya bertahan pada satu pekerjaan sampai selesai.", "K"],

    ["Saya menyusun rencana pekan berikutnya setiap akhir pekan.", "D",
     "Saya menyampaikan sendiri kesalahan saya kepada pembina.", "T"],

    ["Saya berlatih setiap hari walau tidak ada yang menagih.", "K",
     "Saya bersedia berbicara mewakili kelompok.", "P"],

    ["Saya mengurus pendaftaran kegiatan saya sendiri.", "M",
     "Saya menyelesaikan tanggung jawab saya sampai akhir.", "T"],

    ["Saya menjaga jam tidur tetap teratur setiap malam.", "D",
     "Saya melanjutkan latihan meskipun badan terasa berat.", "K"],

    ["Saya lebih suka menyelesaikan pekerjaan dengan usaha sendiri.", "M",
     "Saya senang menggerakkan teman-teman menuju satu tujuan.", "P"],
  ]),
);

/* -------------------------------------------------------------------------- */

export const EPPS_PAKET_10 = periksaSeimbang(
  "paket 10",
  susun([
    ["Saya menyusun pembagian tugas agar pekerjaan cepat selesai.", "P",
     "Saya menaruh kembali kursi ke tempatnya setelah rapat.", "D"],

    ["Saya menyelesaikan pekerjaan yang sudah saya mulai walau lama.", "K",
     "Saya menanggung akibat dari kelalaian saya sendiri.", "T"],

    ["Saya mengurus sendiri keperluan harian saya di asrama.", "M",
     "Saya mencuci peralatan makan segera setelah dipakai.", "D"],

    ["Saya bersedia menjadi penanggung jawab kegiatan.", "P",
     "Saya menyelesaikan pekerjaan yang saya janjikan.", "T"],

    ["Saya berlatih terus sampai kemampuan saya meningkat.", "K",
     "Saya memilih sendiri jalan yang ingin saya tempuh.", "M"],

    ["Saya menyerahkan hasil kerja sesuai waktu yang disepakati.", "T",
     "Saya mengerjakan sesuatu menurut urutan yang sudah saya susun.", "D"],

    ["Saya bersedia memulai ketika keadaan menuntut seseorang bergerak.", "P",
     "Saya menyelesaikan pekerjaan yang menuntut kesabaran panjang.", "K"],

    ["Saya menyiapkan sendiri segala keperluan saya.", "M",
     "Saya memenuhi kewajiban saya walaupun merepotkan.", "T"],

    ["Saya memeriksa kembali pekerjaan sebelum menyerahkannya.", "D",
     "Saya mengulang bagian sulit sampai tidak keliru lagi.", "K"],

    ["Saya berani menghadapi keadaan baru seorang diri.", "M",
     "Saya senang memimpin kegiatan bersama.", "P"],

    ["Saya menjalankan aturan walau tidak ada yang memeriksa.", "D",
     "Saya mengajak teman menaati ketentuan yang berlaku.", "P"],

    ["Saya mengakui kekurangan hasil kerja saya apa adanya.", "T",
     "Saya menyelesaikan pekerjaan sampai bagian yang paling akhir.", "K"],

    ["Saya menyusun perlengkapan menurut kelompoknya.", "D",
     "Saya menyelesaikan persoalan saya sendiri lebih dahulu.", "M"],

    ["Saya menerima teguran sebagai akibat perbuatan saya.", "T",
     "Saya mengatur teman-teman ketika pekerjaan tidak berjalan.", "P"],

    ["Saya menentukan sendiri hal yang ingin saya capai tahun ini.", "M",
     "Saya bertahan pada satu usaha sampai membuahkan hasil.", "K"],

    ["Saya menuliskan rencana kerja sebelum memulainya.", "D",
     "Saya melaporkan sendiri kekeliruan yang saya perbuat.", "T"],

    ["Saya belajar tambahan atas kemauan saya sendiri.", "K",
     "Saya bersedia tampil di depan menyampaikan hasil kelompok.", "P"],

    ["Saya mengurus keperluan saya tanpa merepotkan orang lain.", "M",
     "Saya menyelesaikan tugas yang dipercayakan kepada saya sampai tuntas.", "T"],

    ["Saya menjaga kebiasaan harian saya tetap berjalan.", "D",
     "Saya melanjutkan latihan walau hasilnya lambat terlihat.", "K"],

    ["Saya lebih suka memutuskan sendiri langkah yang saya ambil.", "M",
     "Saya senang mendorong teman-teman bergerak bersama.", "P"],
  ]),
);
