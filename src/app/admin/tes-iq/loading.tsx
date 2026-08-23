import AdminLoading from "@/app/admin/loading";

/**
 * Rangka pemuatan khusus segmen ini.
 *
 * Batas Suspense per segmen membuat sidebar dan kepala halaman tetap terpasang
 * saat pindah halaman, sehingga klik menu langsung terasa dijawab alih-alih
 * menggantung sampai server selesai.
 */
export default function Loading() {
  return <AdminLoading />;
}
