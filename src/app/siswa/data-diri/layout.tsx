import type { ReactNode } from "react";

/** Kerangka menu Data Diri Siswa. */
export default function DataDiriLayout({ children }: { children: ReactNode }) {
  return <div className="space-y-6">{children}</div>;
}
