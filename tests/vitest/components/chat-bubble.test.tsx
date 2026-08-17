import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ChatBubble from '@/components/ChatBubble';

function reply(body: Record<string, unknown>) {
  return { ok: true, json: async () => body };
}

beforeEach(() => {
  sessionStorage.clear();
  localStorage.clear();
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue(
      reply({
        reply: 'Hello, and welcome to Hope Trust.',
        links: [],
        state: { step: 'ASK_NAME' }
      })
    )
  );
});

async function open() {
  render(<ChatBubble />);
  fireEvent.click(screen.getByRole('button', { name: /chat/i }));
  return screen.findByRole('log');
}

describe('ChatBubble', () => {
  it('starts closed and opens on click', async () => {
    render(<ChatBubble />);
    expect(screen.queryByRole('log')).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /chat/i }));
    expect(await screen.findByRole('log')).toBeTruthy();
  });

  // The engine greets at its WELCOME step, so opening sends one empty turn
  // rather than the widget holding a second copy of the greeting to drift.
  it('greets without the visitor having to say anything', async () => {
    await open();
    await waitFor(() => expect(screen.getByText(/welcome to Hope Trust/)).toBeTruthy());
  });

  it('shows the reply that comes back', async () => {
    await open();
    fireEvent.change(await screen.findByRole('textbox'), { target: { value: 'hi' } });
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => expect(screen.getByText(/welcome to Hope Trust/)).toBeTruthy());
  });

  // Someone on a shared computer asking about addiction treatment must not
  // leave the conversation sitting there for the next person.
  it('keeps state in sessionStorage, not localStorage', async () => {
    await open();
    fireEvent.change(await screen.findByRole('textbox'), { target: { value: 'hi' } });
    fireEvent.submit(screen.getByRole('form'));
    await waitFor(() => expect(sessionStorage.getItem('ht_chat_state')).toBeTruthy());
    expect(localStorage.getItem('ht_chat_state')).toBeNull();
  });

  it('sends the state it was carrying back with the next message', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      reply({ reply: 'Thank you.', links: [], state: { step: 'ASK_AGE', first_name: 'Priya' } })
    );
    vi.stubGlobal('fetch', fetchMock);

    await open();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    fireEvent.change(await screen.findByRole('textbox'), { target: { value: 'Priya' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const sent = JSON.parse(fetchMock.mock.calls[1][1].body);
    expect(sent.message).toBe('Priya');
    expect(sent.state.step).toBe('ASK_AGE');
  });

  it('renders the links the engine returned', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        reply({
          reply: 'Here is what we have on that:',
          links: [{ label: 'Book a session', url: 'https://hopetrustindia.com/book-your-session' }],
          state: { step: 'HELPING' }
        })
      )
    );

    await open();
    const link = await screen.findByRole('link', { name: /book a session/i });
    expect(link.getAttribute('href')).toBe('https://hopetrustindia.com/book-your-session');
  });

  // A failed turn offers a real way out, not just an apology. Every failed
  // turn carries one, so this asserts presence rather than uniqueness.
  it('offers WhatsApp when the proxy fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 502 }));
    await open();
    fireEvent.change(await screen.findByRole('textbox'), { target: { value: 'hi' } });
    fireEvent.submit(screen.getByRole('form'));

    const links = await screen.findAllByRole('link', { name: /WhatsApp/i });
    expect(links.length).toBeGreaterThan(0);
    expect(links[0].getAttribute('href')).toContain('wa.me/');
  });

  it('offers WhatsApp when the request throws outright', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await open();
    fireEvent.change(await screen.findByRole('textbox'), { target: { value: 'hi' } });
    fireEvent.submit(screen.getByRole('form'));
    expect((await screen.findAllByRole('link', { name: /WhatsApp/i })).length).toBeGreaterThan(0);
  });

  it('does not send an empty message', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      reply({ reply: 'Hello.', links: [], state: { step: 'ASK_NAME' } })
    );
    vi.stubGlobal('fetch', fetchMock);

    await open();
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    fireEvent.change(await screen.findByRole('textbox'), { target: { value: '   ' } });
    fireEvent.submit(screen.getByRole('form'));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('announces new messages to a screen reader', async () => {
    const log = await open();
    expect(log.getAttribute('aria-live')).toBe('polite');
  });
});
