import Aside from '../../components/aside';
import CountdownSection from '../../components/countdown-section';
import CoupleSection from '../../components/couple-section';
import EventDetailsSection from '../../components/event-details-section';
import HeroSection from '../../components/hero-section';
import { BRIDE, GROOM, IMAGE, Lang, LOCALES, MAP_URL } from '../../core/constant';
import { Dictionary } from '../../models/common';
import { fetchMediaUrl, fetchMediaUrls, getDictionary, updatePersonWithMedia } from '../../utils';

export async function generateStaticParams() {
  return [{ lang: Lang.EN }, { lang: Lang.VI }];
}

export default async function Index({ params }: { readonly params: Promise<{ lang: string }> }) {
  const { lang: langParam } = await params;
  const lang = langParam as Lang;
  const locale = LOCALES[lang];
  const dict: Dictionary = await getDictionary(lang);

  const [slides, bride, groom, countdownBackground] = await Promise.all([
    fetchMediaUrls(IMAGE.slides),
    updatePersonWithMedia({
      ...BRIDE,
      description: dict.couple.bride.description,
      name: dict.couple.bride.name,
    }),
    updatePersonWithMedia({
      ...GROOM,
      description: dict.couple.groom.description,
      name: dict.couple.groom.name,
    }),
    fetchMediaUrl(IMAGE.background.countdown),
  ]);

  return (
    <>
      <Aside dictionary={dict} locale={locale} />

      <main className="ms-auto w-full lg:w-4/5">
        <HeroSection scrollTarget="#couple" slides={slides} subtitle={dict.hero.subtitle} title={dict.hero.title} />

        <CoupleSection bride={bride} groom={groom} />

        <EventDetailsSection
          address={dict.event.venueAddress}
          date={dict.event.date}
          mapLabel={dict.event.mapLabel}
          mapUrl={MAP_URL}
          venueName={dict.event.venueName}
          whenLabel={dict.event.whenLabel}
          whereLabel={dict.event.whereLabel}
        />

        <CountdownSection
          backgroundImage={countdownBackground}
          labels={{
            days: dict.countdown.days,
            hours: dict.countdown.hours,
            minutes: dict.countdown.minutes,
            reachedMessage: dict.countdown.reachedMessage,
            seconds: dict.countdown.seconds,
            subReachedMessage: dict.countdown.subReachedMessage,
          }}
          targetDate={new Date('2021-05-02')}
          title={dict.countdown.title}
        />
      </main>
    </>
  );
}
