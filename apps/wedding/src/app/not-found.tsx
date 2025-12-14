import { Metadata } from 'next';
import { headers } from 'next/headers';

import { NotFoundAnimation } from '../components/not-found-animation';
import { Lang } from '../core/constant';

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const lang = (headersList.get('x-lang') ?? Lang.VI) as Lang;

  return {
    description:
      lang === Lang.VI ? 'Trang bạn đang tìm kiếm không tìm thấy.' : 'The page you are looking for could not be found.',
    title: lang === Lang.VI ? '404 - Không tìm thấy trang' : '404 - Page Not Found',
  };
}

export default function NotFound() {
  return <NotFoundAnimation />;
}
