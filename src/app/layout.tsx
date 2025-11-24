import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mohammed Fawaz | Full Stack Developer",
  description: "Portfolio of Mohammed Fawaz, a Full Stack Developer specializing in Next.js, React, and Node.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="custom-cursor hidden md:block" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
