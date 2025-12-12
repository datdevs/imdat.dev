import Link from 'next/link';

import GoogleMapsIcon from './google-maps-icon';

interface GoogleMapsLinkProps {
  readonly className?: string;
  readonly href: string;
  readonly label: string;
}

export default function GoogleMapsLink({ className, href, label }: GoogleMapsLinkProps) {
  return (
    <Link
      className={
        className ??
        'inline-flex items-center gap-2 bg-amber-50 py-2 ps-2 pe-4 transition-colors duration-300 hover:bg-amber-100'
      }
      href={href}
      target="_blank"
    >
      <GoogleMapsIcon className="size-6" />
      <span>{label}</span>
    </Link>
  );
}
