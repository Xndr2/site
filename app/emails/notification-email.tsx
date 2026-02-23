import { Section, Text, Link, Button } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface NotificationEmailProps {
  firstName?: string;
  postTitle: string;
  postUrl: string;
  unsubscribeUrl: string;
}

export function NotificationEmail({
  firstName,
  postTitle,
  postUrl,
  unsubscribeUrl,
}: NotificationEmailProps) {
  return (
    <BaseLayout unsubscribeUrl={unsubscribeUrl}>
      <Section>
        <Text className="text-[#1e293b] text-base">
          Hey {firstName || 'there'},
        </Text>
        <Text className="text-[#475569] text-sm">
          I just published a new post:
        </Text>
        <Text className="text-xl font-semibold text-[#1e293b]">
          {postTitle}
        </Text>
        <Section className="text-center my-6">
          <Button
            href={postUrl}
            className="bg-[#4da6db] text-white text-sm font-medium px-6 py-3 rounded-lg"
          >
            Read the post
          </Button>
        </Section>
        <Text className="text-[#94a3b8] text-xs text-center">
          Or copy and paste this link:{' '}
          <Link href={postUrl} className="text-[#4da6db]">
            {postUrl}
          </Link>
        </Text>
      </Section>
    </BaseLayout>
  );
}
