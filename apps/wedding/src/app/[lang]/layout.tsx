'use cache';

import type { Metadata, Viewport } from 'next';

import { cache, Suspense } from 'react';

import { Lang, LOCALES, WEDDING_VIEWPORT } from '../../core/constant';
import { BodyFont, DisplayFont, SnellRoundhand } from '../../core/fonts';

export async function generateMetadata({ params }: { readonly params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const locale = LOCALES[lang];
  const baseUrl = 'https://wedding.imdat.dev';

  return {
    alternates: {
      canonical: `${baseUrl}/${lang}`,
      languages: {
        'en-US': `${baseUrl}/en`,
        'vi-VN': `${baseUrl}/vi`,
      },
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: 'default',
      title: lang === Lang.VI ? 'Chí Đạt & Diệu Trang Wedding' : 'Chi Dat & Dieu Trang Wedding',
    },
    applicationName: lang === Lang.VI ? 'Chí Đạt & Diệu Trang Wedding' : 'Chi Dat & Dieu Trang Wedding',
    description:
      lang === Lang.VI
        ? 'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất, lời chúc mừng và kỷ niệm đáng nhớ của đám cưới Chí Đạt & Diệu Trang tại Nha Trang. Cảm ơn bạn đã ghé thăm và chia sẻ niềm vui cùng chúng tôi.'
        : 'These are memories of our wedding, our special day on May 2, 2021. Share the most beautiful moments, congratulations and memorable memories of Chi Dat & Dieu Trang wedding in Nha Trang. Thank you for visiting and sharing the joy with us.',
    icons: {
      shortcut: '/favicon.ico',
    },
    openGraph: {
      alternateLocale: ['en_US', 'vi_VN'],
      countryName: 'Vietnam',
      description:
        lang === Lang.VI
          ? 'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất, lời chúc mừng và kỷ niệm đáng nhớ của đám cưới Chí Đạt & Diệu Trang tại Nha Trang.'
          : 'These are memories of our wedding, our special day on May 2, 2021. Share the most beautiful moments, congratulations and memorable memories of Chi Dat & Dieu Trang wedding in Nha Trang.',
      images: [
        {
          alt:
            lang === Lang.VI
              ? 'Chí Đạt & Diệu Trang Wedding - 02-05-2021'
              : 'Chi Dat & Dieu Trang Wedding - 02-05-2021',
          height: 630,
          type: 'image/jpeg',
          url: 'https://wedding.imdat.dev/assets/images/wedding-banner.jpg',
          width: 1200,
        },
      ],
      locale: locale === 'vi-VN' ? 'vi_VN' : 'en_US',
      siteName: lang === Lang.VI ? 'Chí Đạt & Diệu Trang Wedding' : 'Chi Dat & Dieu Trang Wedding',
      title:
        lang === Lang.VI
          ? 'Chí Đạt & Diệu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021 - Đám cưới'
          : 'Chi Dat & Dieu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021 - Wedding',
      type: 'website',
      url: `${baseUrl}/${lang}`,
    },
    title: {
      default:
        lang === Lang.VI
          ? 'Chí Đạt & Diệu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021 - Đám cưới'
          : 'Chi Dat & Dieu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021 - Wedding',
      template: lang === Lang.VI ? '%s | Chí Đạt & Diệu Trang Wedding' : '%s | Chi Dat & Dieu Trang Wedding',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@imdatdev',
      description:
        lang === Lang.VI
          ? 'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất tại Nha Trang.'
          : 'These are memories of our wedding, our special day on May 2, 2021. Share the most beautiful moments in Nha Trang.',
      images: ['https://wedding.imdat.dev/assets/images/wedding-banner.jpg'],
      site: '@imdatdev',
      title:
        lang === Lang.VI
          ? 'Chí Đạt & Diệu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021'
          : 'Chi Dat & Dieu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021',
    },
  };
}

export const viewport: Viewport = WEDDING_VIEWPORT;

const getLang = cache(async (params: Promise<{ lang: Lang }>) => {
  return (await params).lang;
});

export default async function LangLayout({
  children,
  params,
}: {
  readonly children: React.ReactNode;
  readonly params: Promise<{ lang: Lang }>;
}) {
  const lang = await getLang(params);

  return (
    <html className="scroll-smooth" lang={lang}>
      <body className={`${BodyFont.variable} ${DisplayFont.variable} ${SnellRoundhand.variable} antialiased`}>
        <Suspense fallback={null}>{children}</Suspense>
      </body>
    </html>
  );
}
