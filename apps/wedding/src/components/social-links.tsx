import clsx from 'clsx';
import Link from 'next/link';

import type { SocialLink } from '../models/common';

import {
  DiscordIcon,
  FacebookIcon,
  InstagramIcon,
  LineIcon,
  LinkedInIcon,
  PinterestIcon,
  SnapchatIcon,
  TelegramIcon,
  ThreadsIcon,
  TiktokIcon,
  TumblrIcon,
  WhatsappIcon,
  XIcon,
} from '../icons';

interface SocialLinksProps {
  readonly className?: string;
  readonly links: readonly SocialLink[];
}

const iconMap: Record<SocialLink['platform'], React.ComponentType<React.ComponentProps<'svg'>>> = {
  discord: DiscordIcon,
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  line: LineIcon,
  linkedin: LinkedInIcon,
  pinterest: PinterestIcon,
  snapchat: SnapchatIcon,
  telegram: TelegramIcon,
  threads: ThreadsIcon,
  tiktok: TiktokIcon,
  tumblr: TumblrIcon,
  whatsapp: WhatsappIcon,
  x: XIcon,
};

const hoverColorMap: Record<SocialLink['platform'], string> = {
  discord: 'hover:text-discord',
  facebook: 'hover:text-facebook',
  instagram: 'hover:text-instagram',
  line: 'hover:text-line',
  linkedin: 'hover:text-linkedin',
  pinterest: 'hover:text-pinterest',
  snapchat: 'hover:text-snapchat',
  telegram: 'hover:text-telegram',
  threads: 'hover:text-threads',
  tiktok: 'hover:text-tiktok',
  tumblr: 'hover:text-tumblr',
  whatsapp: 'hover:text-whatsapp',
  x: 'hover:text-x',
};

export default function SocialLinks({ className, links }: SocialLinksProps) {
  if (links.length === 0) {
    return null;
  }

  return (
    <div className={clsx('flex flex-wrap gap-1', className)}>
      {links.map((link) => {
        const Icon = iconMap[link.platform];

        if (!Icon) {
          return null;
        }

        return (
          <Link
            className={clsx('text-primary transition-colors duration-300', hoverColorMap[link.platform])}
            href={link.url}
            key={link.platform}
            rel="noopener noreferrer"
            target="_blank"
          >
            <Icon className="size-6 fill-current" />
          </Link>
        );
      })}
    </div>
  );
}
