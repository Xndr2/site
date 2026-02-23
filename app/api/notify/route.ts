import { NextRequest, NextResponse } from 'next/server';
import { resend, AUDIENCE_FROM, AUDIENCE_ID } from '@/app/lib/resend';
import { createToken } from '@/app/lib/tokens';
import { NotificationEmail } from '@/app/emails/notification-email';
import { getAllPosts } from '@/app/lib/blog';

interface ResendContact {
  id: string;
  email: string;
  first_name: string | null;
  unsubscribed: boolean;
}

export async function POST(request: NextRequest) {
  try {
    // Verify authorization
    const authorization = request.headers.get('authorization');
    if (authorization !== `Bearer ${process.env.NOTIFY_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get latest blog post
    const posts = getAllPosts();
    const latestPost = posts[0];
    if (!latestPost) {
      return NextResponse.json({ error: 'No posts found' }, { status: 404 });
    }

    // Fetch ALL confirmed subscribers with pagination
    const allContacts: ResendContact[] = [];
    let hasMore = true;
    let after: string | undefined;

    while (hasMore) {
      const { data } = await resend.contacts.list({
        audienceId: AUDIENCE_ID,
        limit: 100,
        ...(after ? { after } : {}),
      });
      if (data?.data) {
        allContacts.push(...(data.data as ResendContact[]));
        hasMore = data.has_more ?? false;
        const lastContact = data.data[data.data.length - 1] as
          | ResendContact
          | undefined;
        after = lastContact?.id;
      } else {
        hasMore = false;
      }
    }

    // Filter to only confirmed (not unsubscribed) subscribers
    const subscribers = allContacts.filter((c) => !c.unsubscribed);
    if (subscribers.length === 0) {
      return NextResponse.json({ sent: 0, post: latestPost.title });
    }

    // Build post URL
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL!;
    const postUrl = `${baseUrl}/blog/${latestPost.slug}`;

    // Send in batches of 100 using resend.batch.send()
    const batchSize = 100;
    let sent = 0;
    for (let i = 0; i < subscribers.length; i += batchSize) {
      const batch = subscribers.slice(i, i + batchSize);
      await resend.batch.send(
        batch.map((sub) => ({
          from: AUDIENCE_FROM,
          to: [sub.email],
          subject: `New post: ${latestPost.title}`,
          react: NotificationEmail({
            firstName: sub.first_name || 'there',
            postTitle: latestPost.title,
            postUrl,
            unsubscribeUrl: `${baseUrl}/api/unsubscribe?token=${createToken(sub.email)}`,
          }),
          headers: {
            'List-Unsubscribe': `<${baseUrl}/api/unsubscribe?token=${createToken(sub.email)}>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
          },
        }))
      );
      sent += batch.length;
    }

    return NextResponse.json({ sent, post: latestPost.title });
  } catch {
    return NextResponse.json(
      { error: 'Failed to send notifications' },
      { status: 500 }
    );
  }
}
