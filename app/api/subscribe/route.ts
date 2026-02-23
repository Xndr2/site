import { NextRequest, NextResponse } from 'next/server';
import { resend, AUDIENCE_FROM, AUDIENCE_ID } from '@/app/lib/resend';
import { createToken } from '@/app/lib/tokens';
import { checkRateLimit } from '@/app/lib/rate-limit';
import { ConfirmationEmail } from '@/app/emails/confirmation-email';

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const { name, email, honeypot } = await request.json();

    // Honeypot check -- if filled, silently succeed (don't reveal bot detection)
    if (honeypot) {
      return NextResponse.json({ message: 'Success' });
    }

    // Server-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Name validation: trim and limit to 50 chars if provided
    const trimmedName = name?.trim().slice(0, 50) || undefined;

    // Create contact in Resend (unsubscribed until confirmed)
    try {
      await resend.contacts.create({
        audienceId: AUDIENCE_ID,
        email,
        firstName: trimmedName,
        unsubscribed: true,
      });
    } catch {
      // On duplicate contact error, continue silently
      // Security: don't reveal if email already exists
      // Re-send confirmation email regardless so existing unconfirmed users can re-confirm
    }

    // Generate confirmation token
    const token = createToken(email);
    const confirmUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/confirm?token=${encodeURIComponent(token)}`;

    // Send confirmation email
    await resend.emails.send({
      from: AUDIENCE_FROM,
      to: [email],
      subject: 'Confirm your subscription to xndr.site',
      react: ConfirmationEmail({ firstName: trimmedName, confirmUrl }),
    });

    return NextResponse.json({ message: 'Confirmation email sent' });
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong' },
      { status: 500 }
    );
  }
}
