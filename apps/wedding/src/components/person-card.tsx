import clsx from 'clsx';
import Image from 'next/image';

import type { Person } from '../models/common';

import SocialLinks from './social-links';

interface PersonCardProps {
  readonly person: Person;
  readonly rtl?: boolean;
}

export default function PersonCard({ person, rtl = false }: PersonCardProps) {
  return (
    <div className={clsx('flex gap-6 bg-white p-7.5', rtl ? 'flex-row-reverse' : 'flex-row')}>
      <Image
        alt={person.image.alt}
        className="size-35 flex-none rounded-full object-cover"
        height={person.image.height ?? 140}
        loading="lazy"
        src={person.image.src}
        width={person.image.width ?? 140}
      />

      <div className={clsx('space-y-3', rtl ? 'text-right' : 'text-left')}>
        <h6 className="text-2xl">{person.name}</h6>
        <p>{person.description}</p>
        <SocialLinks className={rtl ? 'justify-end' : 'justify-start'} links={person.socialLinks} />
      </div>
    </div>
  );
}
