'use client';

import { useState, FormEvent } from 'react';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export function SubscribeForm() {
  const [state, setState] = useState<FormState>('idle');
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('loading');

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          honeypot: formData.get('_hp_name'),
        }),
      });

      if (res.ok) {
        setState('success');
      } else {
        const data = await res.json();
        setError(data.error || 'Something went wrong');
        setState('error');
      }
    } catch {
      setError('Something went wrong');
      setState('error');
    }
  }

  if (state === 'success') {
    return (
      <div className="bg-white border border-cat-sky/30 rounded-xl p-6 text-center">
        <svg
          className="w-10 h-10 mx-auto mb-3 text-cat-sky"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="font-medium text-slate-800">
          Check your inbox to confirm!
        </p>
        <p className="text-sm text-slate-500 mt-1">
          We sent a confirmation link to your email.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-800 mb-2">
        Get notified of new posts
      </h3>
      <p className="text-sm text-slate-500 mb-4">
        No spam, unsubscribe anytime.
      </p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cat-sky/50 focus:border-cat-sky"
        />
        <input
          type="email"
          name="email"
          required
          placeholder="your@email.com"
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cat-sky/50 focus:border-cat-sky"
        />
        {/* Honeypot -- hidden from humans via CSS positioning */}
        <div
          className="absolute overflow-hidden"
          style={{ left: '-9999px', width: '1px', height: '1px' }}
          aria-hidden="true"
        >
          <input
            type="text"
            name="_hp_name"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <button
          type="submit"
          disabled={state === 'loading'}
          className="w-full py-2 bg-cat-sky text-white rounded-lg text-sm font-medium hover:bg-cat-sky-dark transition-colors disabled:opacity-50"
        >
          {state === 'loading' ? 'Subscribing...' : 'Subscribe'}
        </button>
        {state === 'error' && (
          <p className="text-red-500 text-xs">{error}</p>
        )}
      </form>
    </div>
  );
}
