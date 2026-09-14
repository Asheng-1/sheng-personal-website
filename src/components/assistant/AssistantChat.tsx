import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import { consumeDifyStream } from "@/lib/difyStream";
import "./AssistantChat.css";

interface Props {
  endpoint: string;
}

interface Message {
  id: string;
  role: "assistant" | "user";
  text: string;
  pending?: boolean;
  error?: boolean;
}

const welcomeMessage: Message = {
  id: "welcome",
  role: "assistant",
  text: "终于等到你来啦～\n你好呀，我是 Sheng 的 AI 小助手，请问有什么可以帮到你嘛～",
};

const suggestions = [
  "Sheng 做过哪些项目？",
  "他擅长处理什么问题？",
  "如何联系 Sheng？",
];

const makeId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `message-${Date.now()}-${Math.random().toString(36).slice(2)}`;

const readStoredValue = (key: string) => {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    return "";
  }
};

const storeValue = (key: string, value: string) => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // The assistant still works when storage is unavailable.
  }
};

const getVisitorId = () => {
  const key = "sheng-assistant-user";
  const stored = readStoredValue(key);
  if (stored) return stored;
  const created = `visitor-${makeId()}`;
  storeValue(key, created);
  return created;
};

export function AssistantChat({ endpoint }: Props) {
  const [open, setOpen] = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);
  const controllerRef = useRef<AbortController | null>(null);
  const nudgeDismissedRef = useRef(false);

  useEffect(() => {
    setConversationId(readStoredValue("sheng-assistant-conversation"));
    return () => controllerRef.current?.abort();
  }, []);

  useEffect(() => {
    const revealTimer = window.setTimeout(() => {
      if (!nudgeDismissedRef.current) setShowNudge(true);
    }, 900);
    const hideTimer = window.setTimeout(() => setShowNudge(false), 9000);
    return () => {
      window.clearTimeout(revealTimer);
      window.clearTimeout(hideTimer);
    };
  }, []);

  useEffect(() => {
    if (open) window.setTimeout(() => inputRef.current?.focus(), 80);
  }, [open]);

  useEffect(() => {
    const list = messageListRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [open]);

  const updateAssistantMessage = (
    id: string,
    update: (message: Message) => Message,
  ) => {
    setMessages((current) =>
      current.map((message) => (message.id === id ? update(message) : message)),
    );
  };

  const sendMessage = async (rawQuery: string) => {
    const query = rawQuery.trim();
    if (!query || sending) return;

    const userMessage: Message = { id: makeId(), role: "user", text: query };
    const assistantId = makeId();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      text: "",
      pending: true,
    };

    setMessages((current) => [...current, userMessage, assistantMessage]);
    setInput("");
    setSending(true);
    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          query,
          user: getVisitorId(),
          ...(conversationId ? { conversationId } : {}),
        }),
        signal: controller.signal,
      });

      let receivedText = false;
      await consumeDifyStream(response, {
        onAppend: (text) => {
          if (!text) return;
          receivedText = true;
          updateAssistantMessage(assistantId, (message) => ({
            ...message,
            text: message.text + text,
            pending: false,
          }));
        },
        onReplace: (text) => {
          receivedText = Boolean(text);
          updateAssistantMessage(assistantId, (message) => ({
            ...message,
            text,
            pending: false,
          }));
        },
        onConversation: (id) => {
          setConversationId(id);
          storeValue("sheng-assistant-conversation", id);
        },
      });

      if (!receivedText) {
        throw new Error("这次没有生成回答，请换个问题试试。");
      }
      updateAssistantMessage(assistantId, (message) => ({
        ...message,
        pending: false,
      }));
    } catch (error) {
      const message =
        error instanceof Error && error.name === "AbortError"
          ? "回答已中断。"
          : error instanceof Error
            ? error.message
            : "暂时无法连接 AI 助手，请稍后再试。";
      updateAssistantMessage(assistantId, (current) => ({
        ...current,
        text: message,
        pending: false,
        error: true,
      }));
    } finally {
      setSending(false);
      controllerRef.current = null;
    }
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(input);
    }
  };

  const startNewConversation = () => {
    controllerRef.current?.abort();
    setConversationId("");
    storeValue("sheng-assistant-conversation", "");
    setMessages([welcomeMessage]);
    setSending(false);
  };

  const openAssistant = () => {
    nudgeDismissedRef.current = true;
    setShowNudge(false);
    setOpen(true);
  };

  const toggleAssistant = () => {
    if (open) {
      setOpen(false);
      return;
    }
    openAssistant();
  };

  return (
    <div className="assistant-chat" data-open={open}>
      {open && (
        <section
          className="assistant-chat__panel"
          role="dialog"
          aria-label="Sheng 的 AI 小助手"
        >
          <header className="assistant-chat__header">
            <span className="assistant-chat__signal" aria-hidden="true" />
            <div>
              <strong>Sheng 的 AI 小助手</strong>
              <span>根据公开经历回答</span>
            </div>
            <button
              type="button"
              className="assistant-chat__text-button"
              onClick={startNewConversation}
              disabled={sending}
            >
              新对话
            </button>
            <button
              type="button"
              className="assistant-chat__close"
              aria-label="关闭 Sheng 的 AI 小助手"
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </header>

          <div
            ref={messageListRef}
            className="assistant-chat__messages"
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`assistant-chat__message assistant-chat__message--${message.role}`}
                data-error={message.error || undefined}
              >
                <span className="assistant-chat__message-label">
                  {message.role === "assistant" ? "小助手" : "你"}
                </span>
                <p>
                  {message.pending && !message.text ? (
                    <span
                      className="assistant-chat__typing"
                      aria-label="正在思考"
                    >
                      <i />
                      <i />
                      <i />
                    </span>
                  ) : (
                    message.text
                  )}
                </p>
              </div>
            ))}

            {messages.length === 1 && (
              <div className="assistant-chat__suggestions">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => void sendMessage(suggestion)}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form className="assistant-chat__composer" onSubmit={submit}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              maxLength={1000}
              rows={1}
              placeholder="问问 Sheng 的经历与项目…"
              aria-label="输入问题"
              disabled={sending}
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="发送问题"
            >
              <span aria-hidden="true">↗</span>
            </button>
          </form>
          <p className="assistant-chat__notice">
            AI 回答可能有误，请以网站公开内容为准。
          </p>
        </section>
      )}

      {!open && showNudge && (
        <button
          type="button"
          className="assistant-chat__nudge"
          aria-label="打开 Sheng 的 AI 小助手"
          onClick={openAssistant}
        >
          <strong>嗨，欢迎来到 Sheng 的网站～</strong>
          <span>想了解他的经历和项目？可以直接问我。</span>
        </button>
      )}

      <button
        type="button"
        className="assistant-chat__launcher"
        aria-label="打开 AI 助手"
        aria-expanded={open}
        onClick={toggleAssistant}
      >
        <span className="assistant-chat__launcher-mark" aria-hidden="true">
          ✦
        </span>
        <span className="assistant-chat__launcher-copy">
          <strong>Sheng 的 AI 小助手</strong>
          <small>在线 · 随时问我</small>
        </span>
      </button>
    </div>
  );
}
