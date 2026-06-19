import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import layoutStyles from "./layout.module.css";

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
      <body className={inter.className} style={{ display: "flex", margin: 0, padding: 0 }}>
        <Sidebar />
        <main className={layoutStyles.main}>
          {children}
        </main>
      </body>
    </html>
  );
}
