import { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';

import { NotFoundAnimation } from '../components/not-found-animation';
import { Lang } from '../core/constant';
import { getDictionary } from '../utils/dictionaries';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const lang = (headersList.get('x-lang') ?? Lang.VI) as Lang;

  return {
    description:
      lang === Lang.VI ? 'Trang bạn đang tìm kiếm không tìm thấy.' : 'The page you are looking for could not be found.',
    title: lang === Lang.VI ? '404 - Không tìm thấy trang' : '404 - Page Not Found',
  };
}

export default async function NotFound() {
  const headersList = await headers();
  const lang = (headersList.get('x-lang') ?? Lang.VI) as Lang;
  const dict = await getDictionary(lang);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-[#faf8f7] px-4 py-12">
      <div className="flex w-full max-w-md justify-center">
        <NotFoundAnimation />
      </div>

      <div className="max-w-lg space-y-4 text-center">
        <h1 className="mb-2 font-serif text-6xl font-medium text-gray-950 md:text-8xl">404</h1>
        <h2 className="mb-4 font-serif text-2xl font-medium text-gray-950 md:text-3xl">{dict.notFound.title}</h2>
        <p className="mb-2 font-sans text-lg text-neutral-600 md:text-xl">{dict.notFound.message}</p>
        <p className="font-sans text-base text-neutral-500 md:text-lg">{dict.notFound.description}</p>
      </div>

      <Link
        className="border-primary hover:text-primary active:text-primary bg-primary cursor-pointer rounded-none border px-8 py-3 text-xs font-medium tracking-[2px] text-white uppercase transition-colors duration-300 hover:bg-transparent active:bg-transparent"
        href={`/${lang}`}
      >
        {dict.notFound.backToHome}
      </Link>
    </div>
  );
}
