'use client';

import { useState, useCallback } from 'react';

const WHATSAPP_FALLBACK = 'https://wa.me/919000850001';

export default function WhatsAppButton() {
  const [busy, setBusy] = useState(false);

  const handleClick = useCallback(async () => {
    if (busy) return;
    setBusy(true);

    try {
      const res = await fetch('/api/whatsapp-crm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      const redirect = data?.url || data?.redirectUrl || data?.link;

      if (redirect) {
        window.open(redirect, '_blank', 'noopener,noreferrer');
      } else {
        window.open(WHATSAPP_FALLBACK, '_blank', 'noopener,noreferrer');
      }
    } catch {
      window.open(WHATSAPP_FALLBACK, '_blank', 'noopener,noreferrer');
    } finally {
      setBusy(false);
    }
  }, [busy]);

  return (
    <button
      onClick={handleClick}
      disabled={busy}
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-all duration-300 hover:scale-110 hover:shadow-[0_6px_20px_rgba(37,211,102,0.5)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 disabled:opacity-70"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        className="h-8 w-8 fill-white"
      >
        <path d="M16.004 0h-.008C7.174 0 0 7.176 0 16.004c0 3.5.914 6.904 2.654 9.914L.92 31.456a.75.75 0 0 0 .912.918l5.692-1.776A15.93 15.93 0 0 0 16.004 32C24.826 32 32 24.826 32 16.004 32 7.176 24.826 0 16.004 0zm9.342 22.622c-.39 1.092-1.932 1.998-3.156 2.264-.838.178-1.932.32-5.618-1.208-4.714-1.952-7.748-6.728-7.984-7.04-.226-.312-1.9-2.532-1.9-4.83s1.202-3.426 1.63-3.894c.39-.426.924-.606 1.234-.606.15 0 .284.008.406.014.428.018.642.044.924.716.352.838 1.212 2.952 1.318 3.168.108.216.216.504.07.792-.138.294-.258.476-.474.732-.216.256-.422.452-.638.728-.196.244-.416.504-.172.932.244.428 1.084 1.786 2.328 2.894 1.598 1.424 2.89 1.882 3.372 2.076.352.142.77.108 1.024-.162.322-.344.72-.914 1.124-1.478.288-.402.65-.452 1.036-.302.39.142 2.498 1.178 2.926 1.392.428.216.714.322.818.5.108.178.108 1.032-.282 2.124z" />
      </svg>

      <span className="absolute -top-1 -right-1 flex h-4 w-4">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-75" />
        <span className="relative inline-flex h-4 w-4 rounded-full bg-[#128C7E]" />
      </span>
    </button>
  );
}
