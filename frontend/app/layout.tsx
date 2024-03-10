import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext, { AuthProvider } from "@/context/AuthContext";
import Header from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Path of KraNf",
  description: "Generated by create next app",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        <AuthProvider>
          <Header/>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
