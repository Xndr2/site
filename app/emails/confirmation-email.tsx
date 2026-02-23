import { Section, Text, Link, Button } from '@react-email/components';
import * as React from 'react';
import { BaseLayout } from './base-layout';

interface ConfirmationEmailProps {
  firstName?: string;
  confirmUrl: string;
}

export function ConfirmationEmail({
  firstName,
  confirmUrl,
}: ConfirmationEmailProps) {
  return (
    <BaseLayout>
      <Section>
        <Text className="text-[#1e293b] text-base">
          Hey {firstName || 'there'}!
        </Text>
        <Text className="text-[#475569] text-sm">
          Thanks for signing up! Click the button below to confirm your
          subscription.
        </Text>
        <Text className="text-[#475569] text-sm">
          You&apos;ll hear from me when I publish new posts. No spam, ever.
        </Text>
        <Section className="text-center my-6">
          <Button
            href={confirmUrl}
            className="bg-[#4da6db] text-white text-sm font-medium px-6 py-3 rounded-lg"
          >
            Confirm subscription
          </Button>
        </Section>
        <Text className="text-[#94a3b8] text-xs text-center">
          Or copy and paste this link:{' '}
          <Link href={confirmUrl} className="text-[#4da6db]">
            {confirmUrl}
          </Link>
        </Text>
        <Text className="text-[#94a3b8] text-xs text-center">
          This link expires in 24 hours.
        </Text>
      </Section>
    </BaseLayout>
  );
}
