"use client"; // ระบุว่าเป็น Client Component

import { SessionProvider } from "next-auth/react"; // นำเข้า SessionProvider
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* ใช้ SessionProvider รอบ ๆ children เพื่อให้การจัดการ session ถูกต้อง */}
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
