import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";
import { Chatbot } from "@/components/Chatbot";

export const metadata: Metadata = {
  title: "YogaRishikesh.com | Book Top Yoga Retreats & TTC",
  description: "Discover and firmly book authentic yoga retreats, teacher training courses (TTC), and drop-in classes directly from the finest schools in Rishikesh, India.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col">
        <Providers>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
