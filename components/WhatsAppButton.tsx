'use client';

import { useState, useCallback, useEffect, useRef } from 'react';

const WHATSAPP_FALLBACK = 'https://wa.me/919000850001';

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
    >
      <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5.914 6.904 2.654 9.914L.92 31.456a.75.75 0 0 0 .912.918l5.692-1.776A15.93 15.93 0 0 0 16.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.342 22.622c-.39 1.092-1.932 1.998-3.156 2.264-.838.178-1.932.32-5.618-1.208-4.714-1.952-7.748-6.728-7.984-7.04-.226-.312-1.9-2.532-1.9-4.83s1.202-3.426 1.63-3.894c.39-.426.924-.606 1.234-.606.15 0 .284.008.406.014.428.018.642.044.924.716.352.838 1.212 2.952 1.318 3.168.108.216.216.504.07.792-.138.294-.258.476-.474.732-.216.256-.422.452-.638.728-.196.244-.416.504-.172.932.244.428 1.084 1.786 2.328 2.894 1.598 1.424 2.89 1.882 3.372 2.076.352.142.77.108 1.024-.162.322-.344.72-.914 1.124-1.478.288-.402.65-.452 1.036-.302.39.142 2.498 1.178 2.926 1.392.428.216.714.322.818.5.108.178.108 1.032-.282 2.124z" />
    </svg>
  );
}

export default function WhatsAppButton() {
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        open &&
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  const handleBookAppointment = useCallback(async () => {
    if (busy) return;
    setBusy(true);

    try {
      const res = await fetch('/api/whatsapp-crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (!res.ok) throw new Error('CRM request failed');

      const data = await res.json();
      const redirect = data?.url || data?.redirectUrl || data?.link;

      const isSafeUrl =
        typeof redirect === 'string' &&
        (redirect.startsWith('https://') || redirect.startsWith('http://'));

      window.open(
        isSafeUrl ? redirect : WHATSAPP_FALLBACK,
        '_blank',
        'noopener,noreferrer'
      );
    } catch {
      window.open(WHATSAPP_FALLBACK, '_blank', 'noopener,noreferrer');
    } finally {
      setBusy(false);
    }
  }, [busy]);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat panel */}
      <div
        ref={panelRef}
        className={`w-[340px] origin-bottom-right overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] transition-all duration-300 ${
          open
            ? 'pointer-events-auto scale-100 opacity-100'
            : 'pointer-events-none scale-90 opacity-0'
        }`}
      >
        {/* Green header */}
        <div className="bg-[#25D366] px-5 py-4">
          <div className="flex items-center gap-3">
            <WhatsAppIcon className="h-9 w-9 fill-white" />
            <div>
              <h3 className="text-lg font-bold text-white leading-tight">
                Start a Conversation
              </h3>
              <p className="mt-0.5 text-[13px] leading-snug text-white/90">
                Hi! Click one of our members below to chat on{' '}
                <span className="font-semibold">WhatsApp</span>
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="px-5 py-4">
          <p className="mb-4 text-[13px] text-gray-400">
            The team typically replies in a few minutes.
          </p>

          {/* Book Appointment row */}
          <button
            onClick={handleBookAppointment}
            disabled={busy}
            className="group flex w-full items-center gap-3 rounded-xl border border-gray-100 px-4 py-3 text-left transition-colors hover:bg-gray-50 disabled:opacity-60"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="h-5 w-5 fill-white"
              >
                <path d="M6.62 10.79a15.053 15.053 0 0 0 6.59 6.59l2.2-2.2a1.003 1.003 0 0 1 1.01-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.1.31.03.66-.25 1.02l-2.2 2.2z" />
              </svg>
            </span>
            <span className="flex-1 text-[15px] font-semibold text-gray-800">
              Book Appointment
            </span>
            <WhatsAppIcon className="h-6 w-6 fill-[#25D366] opacity-70 transition-opacity group-hover:opacity-100" />
          </button>
        </div>

        {/* Powered-by footer */}
        <div className="flex items-center justify-center border-t border-gray-100 py-2">
          <span className="text-[11px] text-gray-300">💬</span>
        </div>
      </div>

      {/* Tooltip + FAB row */}
      <div className="pointer-events-auto flex items-center gap-3">
        {/* Tooltip label */}
        <div
          className={`hidden whitespace-nowrap rounded-lg bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-md transition-all duration-300 sm:block ${
            open
              ? 'pointer-events-none translate-x-2 opacity-0'
              : 'pointer-events-auto translate-x-0 opacity-100'
          }`}
        >
          Need Help? <span className="font-bold">Chat with us</span>
        </div>

        {/* Main button */}
        <button
          ref={buttonRef}
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close chat' : 'Chat on WhatsApp'}
          className={`flex h-[60px] w-[60px] items-center justify-center rounded-full shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
            open
              ? 'bg-[#ED7428] hover:shadow-[0_6px_20px_rgba(237,116,40,0.5)] focus-visible:ring-[#ED7428]'
              : 'bg-[#25D366] hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] focus-visible:ring-[#25D366]'
          }`}
        >
          {open ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="h-7 w-7 fill-white"
            >
              <path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          ) : (
            <WhatsAppIcon className="h-8 w-8 fill-white" />
          )}
        </button>
      </div>
    </div>
  );
}
