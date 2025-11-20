import Aside from '../components/aside';
import { Lang, LOCALES } from '../core/constant';
import { Dictionary } from '../models/common';
import { getDictionary } from '../utils';

export default async function Index({ params }: { readonly params: Promise<{ lang?: Lang }> }) {
  const { lang } = await params;
  const locale = LOCALES[lang ?? Lang.VI];
  const dict: Dictionary = await getDictionary(lang ?? Lang.VI);

  return (
    <div className="relative w-full overflow-hidden">
      <Aside dictionary={dict} locale={locale} />
    </div>
  );
}
