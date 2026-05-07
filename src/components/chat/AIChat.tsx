"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minus,
  PanelRightOpen,
  PanelRightClose,
  Sparkles,
  RefreshCw,
  StopCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFinanceData } from "@/components/providers/FinanceDataProvider";
import { useChatUI } from "@/components/providers/ChatUIProvider";

const WELCOME: UIMessage = {
  id: "welcome",
  role: "assistant",
  parts: [
    {
      type: "text",
      text:
        "您好，我是 Self Finance AI 助手。我已同步您的財務資料與當前頁面 context。\n試著問我：『我該先補哪一層？』或『我的總分要 80 分還差多少？』",
    },
  ],
};

const PAGE_SUGGESTIONS: Record<string, string[]> = {
  "/": [
    "我的總分現在最弱是哪一層？",
    "下一筆 5 萬應該先放哪？",
    "離三人生活還差多少資產？",
  ],
  "/inputs": [
    "變動月收入打 7 折合理嗎？",
    "緊急金該抓幾個月？",
    "保險分數怎麼評才準？",
  ],
  "/report": [
    "我的 HHI 代表什麼意思？",
    "配置吻合帶差多少？",
    "三段提領率我該用哪個？",
  ],
  "/glossary": [
    "HHI 為什麼要平方？",
    "人力資本修正實際怎麼影響我？",
    "4% 和 3.7% 差在哪？",
  ],
  "/settings": [
    "預設政策為什麼設 9 個月？",
    "改為保守提領會影響什麼？",
  ],
};

function getPageSuggestions(pathname: string) {
  const prefix = Object.keys(PAGE_SUGGESTIONS).find((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p),
  );
  return prefix ? PAGE_SUGGESTIONS[prefix] : PAGE_SUGGESTIONS["/"];
}

export function AIChat() {
  const { profile, evaluation } = useFinanceData();
  const { mode, toggleOpen, dock, undock, close } = useChatUI();
  const pathname = usePathname() ?? "/";

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({
          context: { profile, evaluation, pathname },
        }),
      }),
    [profile, evaluation, pathname],
  );

  const { messages, sendMessage, status, stop, error, regenerate, setMessages } =
    useChat({ transport });

  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([WELCOME as never]);
    }
  }, [messages.length, setMessages]);

  useEffect(() => {
    const node = scrollRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement | null;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, status]);

  const isStreaming = status === "submitted" || status === "streaming";
  const suggestions = getPageSuggestions(pathname);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || isStreaming) return;
    sendMessage({ text });
    setInput("");
  };

  const ask = (text: string) => {
    if (isStreaming) return;
    sendMessage({ text });
  };

  const isOpen = mode !== "closed";
  const isDocked = mode === "docked";

  const panelClass = isDocked
    ? "fixed right-0 top-0 bottom-0 w-[440px] rounded-none border-l border-foreground/5"
    : "mb-4 h-[600px] w-[400px] rounded-[2.5rem] border border-white/10";

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key={isDocked ? "docked" : "floating"}
            initial={
              isDocked
                ? { x: 40, opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 16 }
            }
            animate={
              isDocked
                ? { x: 0, opacity: 1 }
                : { opacity: 1, scale: 1, y: 0 }
            }
            exit={
              isDocked
                ? { x: 40, opacity: 0 }
                : { opacity: 0, scale: 0.95, y: 16 }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(
              "z-[90] flex flex-col overflow-hidden glass-card shadow-premium-dark",
              isDocked ? "" : "fixed bottom-24 right-6",
              panelClass,
            )}
          >
            <Header
              isDocked={isDocked}
              onDock={dock}
              onUndock={undock}
              onMinimize={close}
              onClose={close}
              pathname={pathname}
            />

            <ScrollArea className="flex-1" ref={scrollRef}>
              <div className="space-y-5 px-5 py-5">
                {messages.map((m) => (
                  <Bubble key={m.id} message={m as UIMessage} />
                ))}

                {isStreaming && messages[messages.length - 1]?.role !== "assistant" && (
                  <TypingIndicator />
                )}

                {error && (
                  <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-3 text-xs text-rose-500">
                    <p className="font-semibold">發生錯誤</p>
                    <p className="mt-1 text-[11px] opacity-80">
                      {error.message || "請稍後再試，或確認 OPENAI_API_KEY 已設定。"}
                    </p>
                    <button
                      type="button"
                      onClick={() => regenerate()}
                      className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold underline-offset-2 hover:underline"
                    >
                      <RefreshCw size={11} /> 重試
                    </button>
                  </div>
                )}
              </div>
            </ScrollArea>

            {suggestions.length > 0 && messages.length <= 1 && !isStreaming && (
              <div className="border-t border-foreground/5 bg-foreground/[0.02] px-5 py-3">
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60">
                  <Sparkles size={10} /> 這個頁面常被問
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => ask(s)}
                      className="rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1 text-[11px] font-medium text-foreground/80 transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <form onSubmit={submit} className="border-t border-foreground/5 p-4">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isStreaming ? "AI 正在回答…" : "詢問你的財務問題…"
                  }
                  disabled={isStreaming}
                  className="w-full rounded-2xl border border-foreground/10 bg-foreground/[0.02] py-3.5 pl-4 pr-14 text-sm transition-all focus:border-primary/30 focus:outline-none focus:ring-0 disabled:opacity-60"
                />
                {isStreaming ? (
                  <Button
                    type="button"
                    size="icon"
                    onClick={() => stop()}
                    className="absolute right-2 size-9 rounded-xl bg-foreground/80 text-background hover:bg-foreground"
                  >
                    <StopCircle size={16} />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    size="icon"
                    disabled={!input.trim()}
                    className="absolute right-2 size-9 rounded-xl bg-gradient-premium shadow-lg shadow-primary/20"
                  >
                    <Send size={16} />
                  </Button>
                )}
              </div>
              <p className="mt-2 text-center text-[10px] text-muted-foreground/50">
                AI 分析僅供參考，不構成專業投資建議。
              </p>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05, rotate: isOpen ? 0 : 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleOpen}
        className={cn(
          "fixed bottom-6 right-6 z-[100] flex size-16 items-center justify-center rounded-full shadow-2xl transition-all duration-300",
          isOpen
            ? "bg-foreground text-background"
            : "bg-gradient-premium text-white glow-box",
        )}
      >
        {isOpen ? (
          <X size={26} />
        ) : (
          <div className="relative">
            <MessageCircle size={26} />
            <div className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-white bg-emerald-400 animate-pulse" />
          </div>
        )}
      </motion.button>
    </>
  );
}

function Header({
  isDocked,
  onDock,
  onUndock,
  onMinimize,
  onClose,
  pathname,
}: {
  isDocked: boolean;
  onDock: () => void;
  onUndock: () => void;
  onMinimize: () => void;
  onClose: () => void;
  pathname: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-foreground/5 bg-gradient-premium px-5 py-4 text-white">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
          <Bot size={20} />
        </div>
        <div>
          <h3 className="text-sm font-bold tracking-tight">Finance AI</h3>
          <div className="flex items-center gap-1.5 text-[10px] font-medium opacity-80">
            <div className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="truncate">{formatPath(pathname)}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-white hover:bg-white/10"
          onClick={isDocked ? onUndock : onDock}
          title={isDocked ? "取消停靠" : "停靠到右側"}
        >
          {isDocked ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-white hover:bg-white/10"
          onClick={onMinimize}
          title="縮小"
        >
          <Minus size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-full text-white hover:bg-white/10"
          onClick={onClose}
          title="關閉"
        >
          <X size={16} />
        </Button>
      </div>
    </div>
  );
}

function Bubble({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");

  return (
    <div
      className={cn(
        "flex gap-3",
        isUser ? "flex-row-reverse" : "flex-row",
      )}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg border",
          isUser
            ? "bg-primary/10 border-primary/20 text-primary"
            : "bg-foreground/5 border-foreground/10 text-foreground/70",
        )}
      >
        {isUser ? <User size={14} /> : <Bot size={14} />}
      </div>
      <div
        className={cn(
          "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm max-w-[82%] whitespace-pre-wrap",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-foreground/[0.03] border border-foreground/5 text-foreground/90",
        )}
      >
        {text}
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="flex size-8 items-center justify-center rounded-lg bg-foreground/5 text-foreground/70 border border-foreground/10">
        <Bot size={14} />
      </div>
      <div className="flex items-center gap-1 rounded-full bg-foreground/[0.03] border border-foreground/5 px-4 py-2">
        <div className="size-1.5 animate-bounce rounded-full bg-foreground/30" />
        <div className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:0.2s]" />
        <div className="size-1.5 animate-bounce rounded-full bg-foreground/30 [animation-delay:0.4s]" />
      </div>
    </div>
  );
}

function formatPath(pathname: string) {
  const map: Record<string, string> = {
    "/": "Dashboard · 三層總覽",
    "/inputs": "資料輸入",
    "/report": "詳細報告",
    "/glossary": "名詞解釋",
    "/settings": "設定",
  };
  const prefix = Object.keys(map).find((p) =>
    p === "/" ? pathname === "/" : pathname.startsWith(p),
  );
  return prefix ? map[prefix] : "Context-Aware Active";
}
