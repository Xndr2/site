import crypto from 'crypto';

const SECRET = process.env.SUBSCRIBE_SECRET!;

export function createToken(email: string): string {
  const payload = `${email}:${Date.now()}`;
  const signature = crypto
    .createHmac('sha256', SECRET)
    .update(payload)
    .digest('base64url');
  const token = Buffer.from(`${payload}:${signature}`).toString('base64url');
  return token;
}

export function verifyToken(token: string): { email: string; valid: boolean } {
  try {
    const decoded = Buffer.from(token, 'base64url').toString();
    const parts = decoded.split(':');
    if (parts.length !== 3) return { email: '', valid: false };

    const email = parts[0] as string;
    const timestamp = parts[1] as string;
    const signature = parts[2] as string;

    const expectedSig = crypto
      .createHmac('sha256', SECRET)
      .update(`${email}:${timestamp}`)
      .digest('base64url');

    // Timing-safe comparison to prevent timing attacks
    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSig);

    if (sigBuffer.length !== expectedBuffer.length) {
      return { email: '', valid: false };
    }

    const valid = crypto.timingSafeEqual(sigBuffer, expectedBuffer);

    // Check token age (24 hours max)
    const age = Date.now() - parseInt(timestamp, 10);
    const notExpired = age < 24 * 60 * 60 * 1000;

    return { email, valid: valid && notExpired };
  } catch {
    return { email: '', valid: false };
  }
}
