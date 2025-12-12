'use client';

import { clsx } from 'clsx';
import { Menu as MenuIcon, XIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

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

  const date = new Date('2021-05-02');
  const formatter = new Intl.DateTimeFormat(locale, {
    dateStyle: 'long',
  });
  const formattedDate = formatter.format(date);

  const toggle = () => setIsAsideOpen(!isAsideOpen);

  useEffect(() => {
    const handleScroll = () => {
      // Check if current hash matches any menu URL
      const currentHash = location.hash;
      setIsMenuActive(MENU.some((menu: Menu) => currentHash === menu.url || pathname + currentHash === menu.url));
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
        className={clsx('animate-fade-in-down fixed top-0 right-0 z-101 lg:hidden', {
          hidden: isAsideOpen,
        })}
        onClick={toggle}
      >
        <MenuIcon />
      </button>

      <aside
        className={clsx(
          'fixed top-0 bottom-0 left-0 z-100 flex w-full flex-col justify-between gap-4 overflow-scroll bg-[#f6f1f0] p-8 [scrollbar-width:none]',
          'lg:z-10 lg:w-1/5',
          'duration-1000 max-lg:transition-all',
          {
            'max-lg:scale-0 max-lg:opacity-0': !isAsideOpen,
            'max-lg:scale-100 max-lg:opacity-100': isAsideOpen,
          },
        )}
      >
        <button
          className={clsx('absolute top-0 right-0 z-10 border-none bg-transparent text-neutral-400 lg:hidden', {
            hidden: !isAsideOpen,
          })}
          onClick={toggle}
        >
          <XIcon />
        </button>

        <div className="flex flex-col items-center justify-center gap-2">
          <Image
            alt="wedding logo"
            className="size-auto md:mb-3"
            height={39}
            loading="lazy"
            src={IMAGE.logo}
            width={90}
          />
          <span className="font-handwriting text-primary text-2xl md:text-4xl">
            Đạt <small>&</small> Trang
          </span>
          <span className="text-xs tracking-[5px] text-neutral-900">02.05.2021</span>
          <span className="bg-primary/50 mx-auto mt-2 inline-block h-px w-14"></span>
        </div>

        <nav>
          <ul className="space-y-5 text-center md:space-y-8">
            {MENU.map((menu: Menu) => (
              <li key={menu.url}>
                <Link
                  aria-describedby={menu.labelKey}
                  className={clsx(
                    'after:bg-primary relative pb-2 font-serif text-base leading-6 font-normal tracking-wide text-neutral-600',
                    "after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 after:content-[''] hover:after:w-full",
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
            <p>Dat & Trang wedding</p>
            <p>Nha Trang, {formattedDate}</p>
          </div>
        </div>
      </aside>
    </>
  );
}
