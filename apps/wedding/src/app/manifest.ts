import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    background_color: '#fff',
    description: 'Đám cưới Chí Đạt & Diệu Trang - 02-05-2021 - Nha Trang',
    display: 'standalone',
    icons: [
      {
        purpose: 'any',
        sizes: 'any',
        src: '/favicon.ico',
        type: 'image/x-icon',
      },
    ],
    name: 'Chí Đạt & Diệu Trang Wedding',
    short_name: 'Đạt & Trang',
    start_url: '/',
    theme_color: '#5c4a32',
  };
}
