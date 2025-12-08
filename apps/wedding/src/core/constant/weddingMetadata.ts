import type { Metadata, Viewport } from 'next';

/**
 * Comprehensive SEO metadata for the wedding website
 * Optimized for search engines and social media sharing
 */
export const WEDDING_METADATA: Metadata = {
  // Canonical URL and alternates
  alternates: {
    canonical: 'https://wedding.imdat.dev',
    languages: {
      'en-US': 'https://wedding.imdat.dev/en',
      'vi-VN': 'https://wedding.imdat.dev/vi',
    },
  },
  // Metadata for app-like experience
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Chí Đạt & Diệu Trang Wedding',
  },

  // Additional metadata
  applicationName: 'Chí Đạt & Diệu Trang Wedding',
  // Archives and bookmarks
  archives: ['https://wedding.imdat.dev/archive'],
  // Authors and creators
  authors: [
    {
      name: 'Ryan Nguyen',
      url: 'https://imdat.dev',
    },
    {
      name: 'Chí Đạt',
    },
    {
      name: 'Diệu Trang',
    },
  ],

  // Category and classification
  category: 'Wedding',

  classification: 'Personal Website',
  creator: 'Ryan Nguyen',

  description:
    'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất, lời chúc mừng và kỷ niệm đáng nhớ của đám cưới Chí Đạt & Diệu Trang tại Nha Trang. Cảm ơn bạn đã ghé thăm và chia sẻ niềm vui cùng chúng tôi.',

  formatDetection: {
    address: false,
    email: false,
    telephone: false,
  },

  // Icons and manifest
  icons: {
    // apple: [{ sizes: '180x180', type: 'image/png', url: '/images/wedding-icon-apple.png' }],
    // icon: [
    //   { sizes: 'any', url: '/images/wedding-icon.png' },
    //   { sizes: '192x192', type: 'image/png', url: '/images/wedding-icon-192.png' },
    //   { sizes: '512x512', type: 'image/png', url: '/images/wedding-icon-512.png' },
    // ],
    shortcut: '/favicon.ico',
  },
  // Comprehensive keywords for SEO
  keywords: [
    // Names
    'Chí Đạt',
    'Diệu Trang',
    'Chí Đạt Diệu Trang',
    'Đạt Trang',

    // Wedding terms (Vietnamese)
    'Đám cưới',
    'Đám cưới Nha Trang',
    'Đám cưới 2021',
    'Đám cưới 02-05-2021',
    'Ngày trọng đại',
    'Kỷ niệm đám cưới',
    'Lễ cưới',
    'Tiệc cưới',
    'Cưới hỏi',
    'Hôn lễ',
    'Lễ thành hôn',

    // Wedding terms (English)
    'Wedding',
    'Wedding Nha Trang',
    'Wedding Day',
    'Wedding 2021',
    'Wedding May 2021',
    'Wedding Ceremony',
    'Wedding Reception',
    'Wedding Memories',
    'Wedding Website',
    'Wedding Invitation',

    // Location
    'Nha Trang',
    'Nha Trang Wedding',
    'Wedding Nha Trang Vietnam',
    'Đám cưới Nha Trang',
    'Khánh Hòa',

    // General
    'Web đám cưới',
    'Website đám cưới',
    'Trang web đám cưới',
    'Wedding website',
    'Online wedding',
    'Digital wedding',
    'Wedding photos',
    'Wedding gallery',
    'Wedding memories',
    'Kỷ niệm',
    'Khoảnh khắc đẹp',
    'Lời chúc mừng',
    'Wedding wishes',
  ],

  manifest: '/manifest.json',

  // Open Graph metadata for social sharing
  openGraph: {
    alternateLocale: ['en_US'],
    countryName: 'Vietnam',
    description:
      'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất, lời chúc mừng và kỷ niệm đáng nhớ của đám cưới Chí Đạt & Diệu Trang tại Nha Trang.',
    images: [
      {
        alt: 'Chí Đạt & Diệu Trang Wedding - 02-05-2021',
        height: 630,
        type: 'image/jpeg',
        url: 'https://wedding.imdat.dev/assets/images/wedding-banner.jpg',
        width: 1200,
      },
      {
        alt: 'Chí Đạt & Diệu Trang Wedding Banner',
        height: 600,
        type: 'image/jpeg',
        url: 'https://wedding.imdat.dev/assets/images/wedding-banner.jpg',
        width: 800,
      },
    ],
    locale: 'vi_VN',
    siteName: 'Chí Đạt & Diệu Trang Wedding',
    title: 'Chí Đạt & Diệu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021 - Đám cưới',
    type: 'website',
    url: 'https://wedding.imdat.dev',
  },

  // Other
  other: {
    'wedding-couple': 'Chí Đạt & Diệu Trang',
    'wedding-date': '2021-05-02',
    'wedding-location': 'Nha Trang, Vietnam',
  },
  publisher: 'imdat.dev',
  referrer: 'origin-when-cross-origin',

  // Robots directives
  robots: {
    follow: true,
    googleBot: {
      follow: true,
      index: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
    index: true,
  },

  // Verification (if needed)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  //   yahoo: 'your-yahoo-verification-code',
  // },

  // Primary metadata
  title: {
    default: 'Chí Đạt & Diệu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021 - Đám cưới',
    template: '%s | Chí Đạt & Diệu Trang Wedding',
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    creator: '@imdatdev',
    description:
      'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất tại Nha Trang.',
    images: ['https://wedding.imdat.dev/assets/images/wedding-banner.jpg'],
    site: '@imdatdev',
    title: 'Chí Đạt & Diệu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021',
  },
};

export const WEDDING_VIEWPORT: Viewport = {
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { color: '#ffffff', media: '(prefers-color-scheme: light)' },
    { color: '#000000', media: '(prefers-color-scheme: dark)' },
  ],
  userScalable: true,
  width: 'device-width',
};
