import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Cartex",
  description: "Cartex Platform",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={inter.className} style={{ display: "flex" }}>
        <Sidebar />
        <main style={{ marginLeft: "240px", flex: 1, background: "#f8fafc", minHeight: "100vh" }}>
          {children}
        </main>
      </body>
    </html>
  );
}
