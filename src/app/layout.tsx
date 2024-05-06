import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthContext from "@/components/AuthContext";
import NavBar from '@/components/NavBar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fruit Finder",
  description: "Create and Share Fruit Locations to feed a better world!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthContext>
      <html lang="en">
        <body className={inter.className}>
        <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={true}
                closeOnClick
                draggable
                pauseOnHover
            />
          <NavBar />
          {children}
        </body>
      </html>
    </AuthContext>
  );
}
