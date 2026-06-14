import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { TransitionProvider } from "@/context/TransitionContext";
import InteractiveAccents from "@/components/InteractiveAccents";
import CursorFollower from "@/components/CursorFollower";

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ["latin"], 
  variable: "--font-plus-jakarta-sans",
  weight: ["400", "500", "600", "700", "800"]
});

export const metadata: Metadata = {
  title: "BudgetMitra – Smart Shopping & Price Comparison",
  description: "Compare prices across Amazon, Flipkart, and more. Track price history and set alerts.",
  icons: {
    icon: "/images/logo.png",
    apple: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${plusJakartaSans.variable} font-sans bg-background text-on-background min-h-screen antialiased`}>
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

