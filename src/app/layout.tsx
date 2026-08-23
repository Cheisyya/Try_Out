import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { ProgresNavigasi } from "@/components/layout/progres-navigasi";
import { ToastProvider } from "@/components/ui/toast";

import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: {
    default: "Smart Home Center — Bimbingan Belajar Terpercaya",
    template: "%s | Smart Home Center",
  },
  description:
    "Ruang belajar digital Smart Home Center: materi, latihan, simulasi ujian berbasis komputer, dan pemantauan hasil belajar siswa SMP.",
  icons: { icon: "/logo.png", apple: "/logo.png" },
};

export const viewport: Viewport = {
  themeColor: "#0f3055",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={jakarta.variable}>
      <body className="min-h-dvh antialiased">
        <ProgresNavigasi />
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
