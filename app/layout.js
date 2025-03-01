import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from './components/Navbar';
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ResiDine - Effortless Hotel & Restaurant Booking",
  description: "Residine is a seamless hotel and restaurant booking platform designed for hassle-free reservations. Whether you're planning a stay or dining out, Residine provides a user-friendly interface, secure bookings, and real-time availability updates.",
};

const Layout = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/apple-touch-icon.png" type="image/x-icon" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
};

export default Layout;