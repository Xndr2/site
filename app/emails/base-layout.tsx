import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Img,
  Hr,
} from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';
import * as React from 'react';

interface BaseLayoutProps {
  children: React.ReactNode;
  unsubscribeUrl?: string;
}

export function BaseLayout({ children, unsubscribeUrl }: BaseLayoutProps) {
  return (
    <Html>
      <Head />
      <Tailwind>
        <Body className="bg-[#fafbfc] font-sans">
          <Container className="mx-auto max-w-[560px] py-8">
            {/* Header with site avatar */}
            <Section className="text-center mb-6">
              <Img
                src="https://xndr.site/icons/XndrPFP_cat.png"
                alt="Xndr"
                width={48}
                height={48}
                className="mx-auto rounded-full"
              />
            </Section>

            {/* Content */}
            {children}

            {/* Footer */}
            <Hr className="border-[#e2e8f0] my-6" />
            <Section className="text-center">
              <Text className="text-[#94a3b8] text-xs">
                <Link
                  href="https://github.com/Xndr2"
                  className="text-[#4da6db]"
                >
                  GitHub
                </Link>
                {' \u00B7 '}
                <Link
                  href="https://twitter.com/Xndr___"
                  className="text-[#4da6db]"
                >
                  Twitter
                </Link>
                {' \u00B7 '}
                <Link href="https://xndr.site" className="text-[#4da6db]">
                  xndr.site
                </Link>
              </Text>
              {unsubscribeUrl && (
                <Text className="text-[#94a3b8] text-xs mt-1">
                  <Link href={unsubscribeUrl} className="text-[#94a3b8]">
                    Unsubscribe
                  </Link>
                </Text>
              )}
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
