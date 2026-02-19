import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SidebarLayout } from "@/presentation/components/SidebarLayout";
import { ThemeProvider } from "@/presentation/components/ThemeProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TomatoCode Dashboard",
  description: "AgriTech AI Platform for Pest Detection",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
