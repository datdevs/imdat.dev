import type { Metadata, Viewport } from 'next';

import { WEDDING_METADATA, WEDDING_VIEWPORT } from '../core/constant';
import { BodyFont, DisplayFont, SnellRoundhand } from '../core/fonts';
import '../styles/tailwind.css';
import '../styles/index.css';

export const metadata: Metadata = WEDDING_METADATA;

export const viewport: Viewport = WEDDING_VIEWPORT;

export default async function RootLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: { lang: string };
}) {
  return (
    <html className="scroll-smooth" lang={params.lang || 'vi'}>
      <body className={`${BodyFont.variable} ${DisplayFont.variable} ${SnellRoundhand.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
