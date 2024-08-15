import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { ToastProvider } from "@/components/providers/ToasterProvider";
import { SocketProvider } from "@/components/providers/SocketProvider";
import QueryProvider from "@/components/providers/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WhatsApp",
  description: "Next.js 14 Realtime Messaging App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <SocketProvider>
            <ToastProvider />
            <QueryProvider>{children}</QueryProvider>
          </SocketProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
