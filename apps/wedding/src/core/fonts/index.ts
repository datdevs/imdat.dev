import { Dosis, Prata } from 'next/font/google';
import localFont from 'next/font/local';

const BodyFont = Dosis({
  display: 'optional',
  fallback: ['sans-serif'],
  preload: true,
  style: ['normal'],
  subsets: ['latin', 'latin-ext', 'vietnamese'],
  variable: '--font-sans',
  weight: ['400', '500'], // Only load weights actually used (400=normal, 500=medium)
});

const DisplayFont = Prata({
  display: 'optional',
  fallback: ['serif'],
  preload: true,
  style: ['normal'],
  subsets: ['latin', 'vietnamese'],
  variable: '--font-serif',
  weight: ['400'],
});

const SnellRoundhand = localFont({
  display: 'optional',
  fallback: ['cursive'],
  preload: true,
  src: './SnellRoundhand.woff',
  variable: '--font-handwriting',
});

export { BodyFont, DisplayFont, SnellRoundhand };
