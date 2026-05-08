import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Coffee ERP | Management System",
  description: "Advanced Coffee Shop Management System",
};

import LayoutWrapper from "@/components/LayoutWrapper";
import { ConfigProvider } from "@/components/ConfigContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${inter.variable} ${outfit.variable} font-sans`}>
        <ConfigProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </ConfigProvider>
      </body>
    </html>
  );
}
