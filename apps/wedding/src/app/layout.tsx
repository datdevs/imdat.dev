import '../styles/tailwind.css';
import '../styles/index.css';

import { Metadata, Viewport } from 'next';
import { headers } from 'next/headers';

import { Lang, LOCALES, WEDDING_METADATA, WEDDING_VIEWPORT } from '../core/constant';
import { BodyFont, DisplayFont, SnellRoundhand } from '../core/fonts';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const lang = (headersList.get('x-lang') ?? Lang.VI) as Lang;
  const locale = LOCALES[lang];
  const baseUrl = 'https://wedding.imdat.dev';

  // Use WEDDING_METADATA as base and apply language-specific overrides
  return {
    ...WEDDING_METADATA,
    alternates: {
      ...WEDDING_METADATA.alternates,
      canonical: `${baseUrl}/${lang}`,
    },
    appleWebApp: {
      // ...WEDDING_METADATA.appleWebApp,
      title: lang === Lang.VI ? 'Chí Đạt & Diệu Trang Wedding' : 'Chi Dat & Dieu Trang Wedding',
    },
    applicationName: lang === Lang.VI ? 'Chí Đạt & Diệu Trang Wedding' : 'Chi Dat & Dieu Trang Wedding',
    description:
      lang === Lang.VI
        ? 'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất, lời chúc mừng và kỷ niệm đáng nhớ của đám cưới Chí Đạt & Diệu Trang tại Nha Trang. Cảm ơn bạn đã ghé thăm và chia sẻ niềm vui cùng chúng tôi.'
        : 'These are memories of our wedding, our special day on May 2, 2021. Share the most beautiful moments, congratulations and memorable memories of Chi Dat & Dieu Trang wedding in Nha Trang. Thank you for visiting and sharing the joy with us.',
    openGraph: {
      ...WEDDING_METADATA.openGraph,
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
      ...WEDDING_METADATA.twitter,
      description:
        lang === Lang.VI
          ? 'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất tại Nha Trang.'
          : 'These are memories of our wedding, our special day on May 2, 2021. Share the most beautiful moments in Nha Trang.',
      title:
        lang === Lang.VI
          ? 'Chí Đạt & Diệu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021'
          : 'Chi Dat & Dieu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021',
    },
  };
}

export const viewport: Viewport = WEDDING_VIEWPORT;

export default async function RootLayout({ children }: { readonly children: React.ReactNode }) {
  const headersList = await headers();
  const lang = (headersList.get('x-lang') ?? Lang.VI) as Lang;

  return (
    <html className="scroll-smooth motion-reduce:scroll-auto" lang={lang}>
      <body className={`${BodyFont.variable} ${DisplayFont.variable} ${SnellRoundhand.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
