import { NextRequest, NextResponse } from 'next/server';
import { resend, AUDIENCE_ID } from '@/app/lib/resend';
import { verifyToken } from '@/app/lib/tokens';

export async function GET(request: NextRequest) {
  try {
    // Extract token from query params
    const token = request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/blog', request.url));
    }

    // Verify HMAC token
    const { email, valid } = verifyToken(token);
    if (!valid) {
      return NextResponse.redirect(new URL('/blog', request.url));
    }

    // Look up contact by email to get UUID (required by Resend update API)
    const { data: contacts } = await resend.contacts.list({
      audienceId: AUDIENCE_ID,
    });
    const contact = contacts?.data?.find(
      (c: { email: string }) => c.email === email
    );
    if (!contact) {
      return NextResponse.redirect(new URL('/blog', request.url));
    }

    // Activate subscriber
    await resend.contacts.update({
      audienceId: AUDIENCE_ID,
      id: contact.id,
      unsubscribed: false,
    });

    // Redirect to confirmation landing page
    return NextResponse.redirect(new URL('/confirm', request.url));
  } catch {
    return NextResponse.redirect(new URL('/blog', request.url));
  }
}
