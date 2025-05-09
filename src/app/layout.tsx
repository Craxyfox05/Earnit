import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EarnIt - Complete Tasks, Earn Money",
  description: "The premium platform to earn money by completing simple online tasks",
  keywords: ["earn money online", "online tasks", "make money", "complete tasks for money"],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body suppressHydrationWarning className="antialiased font-sans w-full bg-white">
        <div className="w-full sm:max-w-md mx-auto overflow-x-hidden">
          <ClientBody>{children}</ClientBody>
          <Toaster position="bottom-center" />
        </div>
      </body>
    </html>
  );
}
