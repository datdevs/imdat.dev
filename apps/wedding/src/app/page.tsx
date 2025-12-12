import { HeartIcon } from 'lucide-react';

import Aside from '../components/aside';
import CoupleSection from '../components/couple-section';
import Slider from '../components/slider';
import { BRIDE, GROOM, IMAGE, Lang, LOCALES } from '../core/constant';
import { Dictionary } from '../models/common';
import { fetchMediaUrls, getDictionary, updatePersonWithMedia } from '../utils';

export default async function Index({ params }: { readonly params: Promise<{ lang?: Lang }> }) {
  const { lang } = await params;
  const locale = LOCALES[lang ?? Lang.VI];
  const dict: Dictionary = await getDictionary(lang ?? Lang.VI);

  const [slides, bride, groom] = await Promise.all([
    fetchMediaUrls(IMAGE.slides),
    updatePersonWithMedia(BRIDE),
    updatePersonWithMedia(GROOM),
  ]);

  return (
    <>
      <Aside dictionary={dict} locale={locale} />

      <main className="ms-auto w-full lg:w-4/5">
        <section className="relative">
          <Slider slides={slides} />

          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-linear-to-b from-transparent via-black/20 to-transparent text-white text-shadow-[1px_1px_5px_rgba(0,0,0,0.2)]">
            <h1 className="font-handwriting text-8xl text-white">Ryan & Helen</h1>
            <p className="font-sans text-xl tracking-[5px] uppercase">2 May, 2021 - Nha Trang</p>
          </div>

          <div className="absolute right-0 bottom-0 left-0 z-10 flex animate-bounce items-center justify-center pb-16">
            <a className="flex cursor-pointer text-white" href="#couple">
              <HeartIcon className="size-6" />
            </a>
          </div>
        </section>

        <CoupleSection bride={bride} groom={groom} />
      </main>
    </>
  );
}
