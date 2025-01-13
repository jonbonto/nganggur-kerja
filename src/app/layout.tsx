import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from '@/components/Navbar';
import Footer from "@/components/Footer";
import "./globals.css";
import SessionWrapper from "@/components/SessionWrapper";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata= {
  title: 'Job Board & Freelance Marketplace',
  description: 'Connect freelancers with job opportunities.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-100 text-gray-900 min-h-screen flex flex-col`}>
        <SessionWrapper>
          <Navbar />
          <main className="flex-grow">
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: "#333",
                  color: "#fff",
                },
              }}
            />
          </main>
          <Footer className="mt-auto" />
        </SessionWrapper>
      </body>
    </html>
  );
}

