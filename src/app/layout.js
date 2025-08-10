import { Inter } from "next/font/google";
import "@/src/styles/globals.css";
import Header from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import { Toaster } from "@/src/components/ui/toaster";
import { EdgeStoreProvider } from "@/src/lib/edgestore";
import { SessionProvider } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authConfig } from "@/src/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Tools Hub - Discover the Best AI Tools for Content Creators",
  description: "Find and explore the best AI tools for content creation, writing, design, and more. Submit your favorite tools and discover new ones.",
};

export default async function RootLayout({ children }) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProvider session={session}>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <EdgeStoreProvider>{children}</EdgeStoreProvider>
            </main>
            <Footer />
            <Toaster />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}