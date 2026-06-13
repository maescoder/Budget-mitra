import type { Metadata } from "next";
import { Newsreader, Sora } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TransitionProvider } from "@/context/TransitionContext";
import InteractiveAccents from "@/components/InteractiveAccents";
import CursorFollower from "@/components/CursorFollower";

const sora = Sora({ 
  subsets: ["latin"], 
  variable: "--font-sora",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"]
});

const newsreader = Newsreader({ 
  subsets: ["latin"], 
  variable: "--font-newsreader",
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  title: "BudgetMitra – Wealth, Refined.",
  description: "Experience financial clarity through an organic blend of human wisdom and technological precision.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${sora.variable} ${newsreader.variable} font-sans bg-background text-on-background min-h-screen antialiased`}>
        <AuthProvider>
          <TransitionProvider>
            <InteractiveAccents />
            <CursorFollower />
            {children}
          </TransitionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

