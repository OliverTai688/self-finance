import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FinanceDataProvider } from "@/components/providers/FinanceDataProvider";
import { ChatUIProvider } from "@/components/providers/ChatUIProvider";
import AppShell from "@/components/layout/AppShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Self Finance | Premium Personal Finance Management",
  description:
    "Track your expenses, manage budgets, and achieve financial freedom with state-of-the-art tools.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="bg-background text-foreground selection:bg-primary/30">
        <TooltipProvider delayDuration={200}>
          <FinanceDataProvider>
            <ChatUIProvider>
              <AppShell>{children}</AppShell>
            </ChatUIProvider>
          </FinanceDataProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
