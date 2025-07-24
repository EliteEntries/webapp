import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import App from "../components/Content";
import Nav from "../components/Nav";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { getServerAuthUser } from "@/utils/serverAuth";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Elite Entries",
  description: "Where our entries are elite.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getServerAuthUser();
  return (
    <html lang="en">
      <AuthProvider>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background overflow-x-hidden`}>
          <Nav/>
          <App  {...{user}} >
            {children}
          </App>
        </body>
      </AuthProvider>
    </html>
  );
}
