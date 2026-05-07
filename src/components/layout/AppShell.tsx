"use client";

import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import { AIChat } from "@/components/chat/AIChat";
import { useChatUI } from "@/components/providers/ChatUIProvider";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { mode } = useChatUI();
  const docked = mode === "docked";

  return (
    <div className="relative flex min-h-screen">
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] size-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] size-[30%] rounded-full bg-secondary/5 blur-[100px]" />
        <div className="absolute inset-0 subtle-grid opacity-[0.4]" />
      </div>

      <Navbar />
      <main
        className={cn(
          "ml-72 min-h-screen flex-1 p-8 transition-all duration-500 relative z-10",
          docked && "mr-[460px]",
        )}
      >
        <div className="mx-auto max-w-6xl w-full">{children}</div>
      </main>
      <AIChat />
    </div>
  );
}
