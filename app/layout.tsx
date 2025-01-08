import { Navbar } from "@/components/Navbar";
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alumni Portal",
  description: "Alumni Network Portal of IIITS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased mx-auto`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
