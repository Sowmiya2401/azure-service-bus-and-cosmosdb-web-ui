import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Azure Service Bus Manager | Azure Cloud Dashboard",
  description: "Manage Azure Service Bus Topics and Subscriptions - Cloud Data Management Dashboard",
  keywords: "Azure, Service Bus, Cloud Dashboard, Data Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-gray-50 text-gray-900 min-h-screen`}>
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
          {/* Footer */}
          <footer className="bg-gray-800 text-white mt-auto py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-2 text-sm">
                <span className="text-gray-300">© {new Date().getFullYear()} Azure Service Bus Manager</span>
                <span className="text-gray-400">Azure Cloud Dashboard</span>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
