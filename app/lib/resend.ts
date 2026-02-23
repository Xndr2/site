import { Resend } from 'resend';

let _resend: Resend | null = null;

export function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY);
  }
  return _resend;
}

// Re-export as `resend` getter for backward compatibility
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    return (getResend() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID!;

export const AUDIENCE_FROM = 'Xander <hey@xndr.site>';
