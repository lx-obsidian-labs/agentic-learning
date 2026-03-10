import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";
import Providers from "@/components/Providers";
import FloatingTutor from "@/components/FloatingTutor";
import { ToastProvider } from "@/components/ToastProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Agentic Learning - Powered by LX Obsidian Labs",
  description: "AI-powered e-learning platform for matric students. Strategic video selection and focused notes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased`}>
          <ErrorBoundary>
            <Providers>
              <ToastProvider>
                {children}
              </ToastProvider>
              <FloatingTutor />
            </Providers>
          </ErrorBoundary>
        </body>
      </html>
    </ClerkProvider>
  );
}
