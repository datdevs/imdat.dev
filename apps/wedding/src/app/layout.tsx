import type { Metadata, Viewport } from 'next';
import { BodyFont, DisplayFont, SnellRoundhand } from '../core/fonts';
import { WEDDING_METADATA, WEDDING_VIEWPORT } from '../core/constant';
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
    <html className="scroll-smooth" lang={params.lang || 'en'}>
      <body className={`${BodyFont.variable} ${DisplayFont.variable} ${SnellRoundhand.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
