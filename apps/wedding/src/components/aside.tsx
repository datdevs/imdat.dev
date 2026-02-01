'use client';

import { clsx } from 'clsx';
import { Menu as MenuIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { IMAGE, MENU } from '../core/constant';
import { Dictionary, Menu } from '../models/common';

interface AsideProps {
  readonly dictionary: Dictionary;
  readonly locale: Intl.LocalesArgument;
}

export default function Aside({ dictionary, locale }: AsideProps) {
  const [isAsideOpen, setIsAsideOpen] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const pathname = usePathname();

  // Memoize date and formatter to prevent recreation on every render
  const date = useMemo(() => new Date('2021-05-02'), []);
  const formatter = useMemo(() => new Intl.DateTimeFormat(locale, { dateStyle: 'long' }), [locale]);
  const formattedDate = useMemo(() => formatter.format(date), [formatter, date]);

  const toggle = useCallback(() => setIsAsideOpen((prev) => !prev), []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  }, [toggle]);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Check if current hash matches any menu URL
          const currentHash = location.hash;
          setIsMenuActive((prev) => {
            const newValue = MENU.some((menu: Menu) => currentHash === menu.url || pathname + currentHash === menu.url);
            // Only update if value changed
            return prev !== newValue ? newValue : prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };

    // Check on mount and pathname change
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [pathname]);

  return (
    <>
      <button
        aria-label="Toggle navigation menu"
        className={clsx(
          'animate-fade-in-down focus-visible:ring-primary fixed top-0 right-0 z-101 focus-visible:ring-2 focus-visible:outline-none lg:hidden',
          {
            hidden: isAsideOpen,
          },
        )}
        onClick={toggle}
        onKeyDown={handleKeyDown}
      >
        <MenuIcon aria-hidden="true" />
      </button>

      <aside
        aria-label="Wedding information"
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-100 flex w-full flex-col justify-between gap-4 overflow-scroll bg-[#f6f1f0] p-8 [scrollbar-width:none]',
          'lg:z-10 lg:w-1/5',
          'duration-1000 max-lg:transition-[transform,opacity]',
          {
            'max-lg:scale-0 max-lg:opacity-0': !isAsideOpen,
            'max-lg:scale-100 max-lg:opacity-100': isAsideOpen,
          },
        )}
      >
        <button
          aria-label="Close navigation menu"
          className={clsx(
            'focus-visible:ring-primary absolute top-0 right-0 z-10 border-none bg-transparent text-neutral-400 focus-visible:ring-2 focus-visible:outline-none lg:hidden',
            {
              hidden: !isAsideOpen,
            },
          )}
          onClick={toggle}
          onKeyDown={handleKeyDown}
        >
          <XIcon aria-hidden="true" />
        </button>

        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            alt="wedding logo"
            className="size-auto md:mb-3"
            height={39}
            loading="lazy"
            sizes="(max-width: 768px) 90px, 90px"
            src={IMAGE.logo}
            width={90}
          />
          <span
            className="font-handwriting text-primary text-2xl md:text-4xl"
            dangerouslySetInnerHTML={{ __html: dictionary.aside.coupleNames }}
          />
          <span className="text-xs tracking-[5px] text-neutral-900">{dictionary.aside.weddingDate}</span>
          <span className="bg-primary/50 mx-auto mt-2 inline-block h-px w-14"></span>
        </div>

        <nav aria-label="Main navigation">
          <ul className="space-y-5 text-center md:space-y-8">
            {MENU.map((menu: Menu) => (
              <li key={menu.url}>
                <Link
                  aria-label={dictionary.common[menu.labelKey]}
                  className={clsx(
                    'after:bg-primary focus-visible:ring-primary relative pb-2 font-serif text-base leading-6 font-normal tracking-wide text-neutral-600 focus-visible:ring-2 focus-visible:outline-none',
                    "after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:transition-[width] after:duration-300 after:content-[''] hover:after:w-full",
                    {
                      'text-primary after:w-full': isMenuActive,
                    },
                  )}
                  href={menu.url}
                >
                  {dictionary.common[menu.labelKey]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <span className="bg-primary/50 mx-auto inline-block h-px w-14"></span>

          <div className="space-y-1 text-xs tracking-wide text-gray-400">
            <p>{dictionary.aside.weddingLocation}</p>
            <p>Nha Trang, {formattedDate}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
