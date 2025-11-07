import type { Metadata, Viewport } from 'next';

/**
 * Comprehensive SEO metadata for the wedding website
 * Optimized for search engines and social media sharing
 */
export const WEDDING_METADATA: Metadata = {
  // Primary metadata
  title: {
    default: 'Chí Đạt & Diệu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021 - Đám cưới',
    template: '%s | Chí Đạt & Diệu Trang Wedding',
  },
  description:
    'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất, lời chúc mừng và kỷ niệm đáng nhớ của đám cưới Chí Đạt & Diệu Trang tại Nha Trang. Cảm ơn bạn đã ghé thăm và chia sẻ niềm vui cùng chúng tôi.',

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
  creator: 'Ryan Nguyen',
  publisher: 'imdat.dev',

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

  // Category and classification
  category: 'Wedding',
  classification: 'Personal Website',

  // Open Graph metadata for social sharing
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    alternateLocale: ['en_US'],
    url: 'https://wedding.imdat.dev',
    siteName: 'Chí Đạt & Diệu Trang Wedding',
    title: 'Chí Đạt & Diệu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021 - Đám cưới',
    description:
      'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất, lời chúc mừng và kỷ niệm đáng nhớ của đám cưới Chí Đạt & Diệu Trang tại Nha Trang.',
    images: [
      {
        url: 'https://wedding.imdat.dev/assets/images/wedding-banner.jpg',
        width: 1200,
        height: 630,
        alt: 'Chí Đạt & Diệu Trang Wedding - 02-05-2021',
        type: 'image/jpeg',
      },
      {
        url: 'https://wedding.imdat.dev/assets/images/wedding-banner.jpg',
        width: 800,
        height: 600,
        alt: 'Chí Đạt & Diệu Trang Wedding Banner',
        type: 'image/jpeg',
      },
    ],
    countryName: 'Vietnam',
  },

  // Twitter Card metadata
  twitter: {
    card: 'summary_large_image',
    title: 'Chí Đạt & Diệu Trang 🤵🏻👰🏻 - Wedding Day 02-05-2021',
    description:
      'Đây là những kỷ niệm về đám cưới, ngày trọng đại của chúng tôi vào ngày 02-05-2021. Chia sẻ những khoảnh khắc đẹp nhất tại Nha Trang.',
    images: ['https://wedding.imdat.dev/assets/images/wedding-banner.jpg'],
    creator: '@imdatdev',
    site: '@imdatdev',
  },

  // Icons and manifest
  icons: {
    icon: [
      { url: '/images/wedding-icon.png', sizes: 'any' },
      { url: '/images/wedding-icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/wedding-icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/images/wedding-icon-apple.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/images/wedding-icon.png',
  },
  manifest: '/manifest.json',

  // Canonical URL and alternates
  alternates: {
    canonical: 'https://wedding.imdat.dev',
    languages: {
      'vi-VN': 'https://wedding.imdat.dev/vi',
      'en-US': 'https://wedding.imdat.dev/en',
    },
  },

  // Robots directives
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  // Additional metadata
  applicationName: 'Chí Đạt & Diệu Trang Wedding',
  referrer: 'origin-when-cross-origin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },

  // Metadata for app-like experience
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Chí Đạt & Diệu Trang Wedding',
  },

  // Verification (if needed)
  // verification: {
  //   google: 'your-google-verification-code',
  //   yandex: 'your-yandex-verification-code',
  //   yahoo: 'your-yahoo-verification-code',
  // },

  // Archives and bookmarks
  archives: ['https://wedding.imdat.dev/archive'],

  // Other
  other: {
    'wedding-date': '2021-05-02',
    'wedding-location': 'Nha Trang, Vietnam',
    'wedding-couple': 'Chí Đạt & Diệu Trang',
  },
};

export const WEDDING_VIEWPORT: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};
