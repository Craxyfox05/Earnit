import "./globals.css";
import type { Metadata } from "next";
import ClientBody from "./ClientBody";
import { AuthProvider } from "@/context/AuthContext";

export const metadata: Metadata = {
  title: "EarnIt - Earn Money Easily",
  description: "Complete tasks, watch ads, and earn money on the go",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ClientBody>{children}</ClientBody>
        </AuthProvider>
      </body>
    </html>
  );
}
