'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send } from 'lucide-react';

/**
 * The website chat bubble. Every decision about what to say is made by the CRM
 * engine behind /api/chat — this renders the turn and carries the state.
 *
 * It holds no conversation of its own: the message list lives in component
 * state and dies with the tab, and only the four-field state object is
 * persisted. Nothing a person types is ever written down here.
 */

const STATE_KEY = 'ht_chat_state';
const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '919000720003';

const FAILURE_LINE =
  "I can't reach our team just now. You can message us on WhatsApp instead — someone will pick it up.";

interface ChatLink {
  label: string;
  url: string;
}

interface ChatState {
  step: string;
  first_name: string | null;
  age: number | null;
  focus_tags: string[];
}

interface Message {
  from: 'them' | 'us';
  body: string;
  links?: ChatLink[];
  failed?: boolean;
}

const FRESH_STATE: ChatState = {
  step: 'WELCOME',
  first_name: null,
  age: null,
  focus_tags: [],
};

// sessionStorage, never localStorage. Someone on a shared computer asking
// about addiction treatment must not leave the conversation for whoever sits
// down next; a closed tab is the end of it.
function readState(): ChatState {
  try {
    const raw = sessionStorage.getItem(STATE_KEY);
    return raw ? { ...FRESH_STATE, ...JSON.parse(raw) } : FRESH_STATE;
  } catch {
    return FRESH_STATE;
  }
}

function writeState(state: ChatState) {
  try {
    sessionStorage.setItem(STATE_KEY, JSON.stringify(state));
  } catch {
    // A browser refusing storage costs continuity between turns, not the
    // conversation. Carrying on beats failing in front of the person.
  }
}

export default function ChatBubble() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const stateRef = useRef<ChatState>(FRESH_STATE);
  const greeted = useRef(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  async function send(text: string) {
    setSending(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, state: stateRef.current }),
      });

      if (!res.ok) throw new Error(String(res.status));

      const data = await res.json();
      if (data?.state) {
        stateRef.current = { ...stateRef.current, ...data.state };
        writeState(stateRef.current);
      }

      setMessages((prev) => [
        ...prev,
        {
          from: 'them',
          body: typeof data?.reply === 'string' ? data.reply : FAILURE_LINE,
          links: Array.isArray(data?.links) ? data.links : [],
        },
      ]);
    } catch {
      // Never fail silently. A person who has just typed something difficult
      // and got nothing back assumes they were ignored.
      setMessages((prev) => [...prev, { from: 'them', body: FAILURE_LINE, failed: true }]);
    } finally {
      setSending(false);
    }
  }

  // The engine greets at its WELCOME step, so opening sends one empty turn.
  // Holding a copy of the greeting here would be a second place for approved
  // copy to live, and the two would drift.
  useEffect(() => {
    if (!open || greeted.current) return;
    greeted.current = true;
    stateRef.current = readState();
    void send('');
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  // Optional call, not just optional chaining. Keeping the newest message in
  // view is a nicety; an environment without scrollIntoView (jsdom, and some
  // older mobile browsers) would otherwise throw here and take the whole
  // widget down with it.
  useEffect(() => {
    endRef.current?.scrollIntoView?.({ block: 'end' });
  }, [messages]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || sending) return;
    setDraft('');
    setMessages((prev) => [...prev, { from: 'us', body: text }]);
    void send(text);
  }

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 z-50 flex h-[min(32rem,calc(100vh-8rem))] w-[min(23rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 sm:right-6"
          >
            <div className="flex items-center justify-between bg-[#00373E] px-4 py-3 text-white">
              <div>
                <p className="text-sm font-semibold leading-tight">Hope Trust</p>
                <p className="text-xs leading-tight text-white/70">
                  We usually reply straight away
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1 transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="flex-1 space-y-3 overflow-y-auto bg-[#F7F6F4] px-4 py-4"
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={m.from === 'us' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div
                    className={
                      m.from === 'us'
                        ? 'max-w-[85%] rounded-2xl rounded-br-sm bg-[#00373E] px-3 py-2 text-sm text-white'
                        : 'max-w-[85%] rounded-2xl rounded-bl-sm bg-white px-3 py-2 text-sm text-gray-800 ring-1 ring-black/5'
                    }
                  >
                    <p className="whitespace-pre-wrap">{m.body}</p>

                    {m.failed && (
                      <a
                        href={`https://wa.me/${WHATSAPP_NUMBER}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-sm font-medium text-[#ED7428] underline underline-offset-2"
                      >
                        Message us on WhatsApp
                      </a>
                    )}

                    {m.links && m.links.length > 0 && (
                      <ul className="mt-2 space-y-1">
                        {m.links.map((l) => (
                          <li key={l.url}>
                            <a
                              href={l.url}
                              className="text-sm font-medium text-[#00373E] underline underline-offset-2 hover:text-[#ED7428]"
                            >
                              {l.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              aria-label="Send a message"
              className="flex items-center gap-2 border-t border-black/5 bg-white px-3 py-2"
            >
              <label htmlFor="ht-chat-input" className="sr-only">
                Your message
              </label>
              <input
                id="ht-chat-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type your message"
                autoComplete="off"
                className="min-w-0 flex-1 rounded-full bg-[#F7F6F4] px-4 py-2 text-sm text-gray-800 outline-none ring-1 ring-black/5 focus:ring-[#00373E]"
              />
              <button
                type="submit"
                disabled={sending || draft.trim().length === 0}
                aria-label="Send"
                className="rounded-full bg-[#00373E] p-2 text-white transition-opacity disabled:opacity-40"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat with us"
        aria-expanded={open}
        className="fixed bottom-6 right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#00373E] text-white shadow-lg transition-transform hover:scale-105 sm:right-6"
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
      </button>
    </>
  );
}
