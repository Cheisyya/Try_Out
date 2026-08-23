/**
 * Batas ukuran unggahan, ditetapkan di satu tempat.
 *
 * Seluruh unggahan aplikasi ini — dokumen persyaratan casis, materi ajar,
 * gambar soal — dikirim lewat Server Action, yaitu satu permintaan HTTP biasa
 * ke fungsi server. Pada hosting serverless seperti Vercel, badan permintaan
 * semacam itu dibatasi keras di sisi platform: permintaan yang lebih besar
 * ditolak sebelum kode aplikasi sempat berjalan, sehingga tidak ada pengaturan
 * Next.js yang dapat menembusnya.
 *
 * Karena itu batasnya ditetapkan di sini, bukan diulang-ulang pada tiap modul.
 * Menaikkannya tanpa memindahkan unggahan ke penyimpanan blob hanya akan
 * membuat kegagalannya berpindah dari pesan yang jelas menjadi galat 413 yang
 * membingungkan peserta.
 *
 * Berkas ini bebas dependensi Node agar aman diimpor dari Client Component.
 */

const MB = 1024 * 1024;

/**
 * Berkas terbesar yang boleh diunggah pengguna.
 *
 * Batas badan permintaan pada Vercel adalah 4,5 MB; angka di bawah ini
 * menyisakan sekitar setengah megabita sebagai ruang untuk pembungkus multipart
 * dan medan formulir lainnya. Nilai 4,5 MB itu sendiri disetel pada
 * `serverActions.bodySizeLimit` di next.config.ts, sehingga berkas yang lolos
 * dari batas ini pun tetap tertahan sebelum sampai ke Vercel.
 */
export const MAKS_UNGGAHAN = 4 * MB;
