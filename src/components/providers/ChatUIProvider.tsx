"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ChatMode = "closed" | "floating" | "docked";

interface ChatUIContextType {
  mode: ChatMode;
  setMode: (mode: ChatMode) => void;
  toggleOpen: () => void;
  dock: () => void;
  undock: () => void;
  close: () => void;
}

const STORAGE_KEY = "self-finance:chat-mode";

const ChatUIContext = createContext<ChatUIContextType | undefined>(undefined);

export function ChatUIProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ChatMode>("closed");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ChatMode | null;
      if (stored === "docked" || stored === "floating" || stored === "closed") {
        setModeState(stored);
      }
    } catch {}
  }, []);

  const setMode = useCallback((next: ChatMode) => {
    setModeState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }, []);

  const toggleOpen = useCallback(() => {
    setModeState((m) => {
      const next: ChatMode = m === "closed" ? "floating" : "closed";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {}
      return next;
    });
  }, []);

  const dock = useCallback(() => setMode("docked"), [setMode]);
  const undock = useCallback(() => setMode("floating"), [setMode]);
  const close = useCallback(() => setMode("closed"), [setMode]);

  return (
    <ChatUIContext.Provider value={{ mode, setMode, toggleOpen, dock, undock, close }}>
      {children}
    </ChatUIContext.Provider>
  );
}

export function useChatUI() {
  const ctx = useContext(ChatUIContext);
  if (!ctx) {
    throw new Error("useChatUI must be used within ChatUIProvider");
  }
  return ctx;
}
