import type { ReactNode } from "react";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import { wajibSesi } from "@/lib/get-session";
import { pengaturanAplikasi } from "@/lib/konfigurasi/aplikasi";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [session, pengaturan] = await Promise.all([
    wajibSesi("admin"),
    pengaturanAplikasi(),
  ]);

  return (
    <DashboardShell
      role="admin"
      nama={session.nama}
      identitas={session.identitas}
      pengaturan={pengaturan}
    >
      {children}
    </DashboardShell>
  );
}
