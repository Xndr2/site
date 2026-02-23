import { NextRequest, NextResponse } from 'next/server';
import { resend, AUDIENCE_ID } from '@/app/lib/resend';
import { verifyToken } from '@/app/lib/tokens';

async function handleUnsubscribe(request: NextRequest) {
  try {
    // Extract token from query params
    const token = request.nextUrl.searchParams.get('token');
    if (!token) {
      return NextResponse.redirect(new URL('/blog', request.url));
    }

    // Verify token
    const { email, valid } = verifyToken(token);
    if (!valid) {
      // Expired or tampered -- fail silently
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
      // Benefit of the doubt -- may already be removed
      return NextResponse.redirect(new URL('/unsubscribe', request.url));
    }

    // Update contact in Resend using contact ID
    await resend.contacts.update({
      audienceId: AUDIENCE_ID,
      id: contact.id,
      unsubscribed: true,
    });

    // Redirect to unsubscribe landing page
    return NextResponse.redirect(new URL('/unsubscribe', request.url));
  } catch {
    // Benefit of the doubt -- redirect to unsubscribe page on any error
    return NextResponse.redirect(new URL('/unsubscribe', request.url));
  }
}

// Handle link clicks from email footer
export async function GET(request: NextRequest) {
  return handleUnsubscribe(request);
}

// Handle RFC 8058 one-click unsubscribe from email client native buttons
export async function POST(request: NextRequest) {
  return handleUnsubscribe(request);
}
