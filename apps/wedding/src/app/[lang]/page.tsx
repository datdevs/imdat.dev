import Aside from '../../components/aside';
import CountdownSection from '../../components/countdown-section';
import CoupleSection from '../../components/couple-section';
import EventDetailsSection from '../../components/event-details-section';
import GallerySection from '../../components/gallery-section';
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

  // Prepare gallery images by category
  const allGalleryPaths: string[] = [];
  const galleryPathsByCategory: Record<string, string[]> = {};

  Object.entries(IMAGE.gallery).forEach(([category, paths]) => {
    galleryPathsByCategory[category] = paths;
    allGalleryPaths.push(...paths);
  });

  const [slides, bride, groom, countdownBackground, galleryUrls] = await Promise.all([
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
    fetchMediaUrls(allGalleryPaths),
  ]);

  // Organize gallery images by category
  const galleryImages = allGalleryPaths
    .map((path, index) => {
      const url = galleryUrls[index];
      if (!url) return null;

      // Find which category this image belongs to
      const category = Object.entries(galleryPathsByCategory).find(([, paths]) => paths.includes(path))?.[0];
      if (!category) return null;

      // Extract filename for alt text
      const filename = path.split('/').pop() ?? `image-${index}`;
      const alt = filename.replace(/\.[^/.]+$/, '');

      return {
        alt,
        category,
        fullSrc: url,
        src: url,
      };
    })
    .filter((img): img is { alt: string; category: string; fullSrc: string; src: string } => img !== null);

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

        <GallerySection
          categories={dict.gallery.categories}
          images={galleryImages}
          subtitle={dict.gallery.subtitle}
          title={dict.gallery.title}
          viewAllLabel={dict.gallery.viewAll}
        />
      </main>
    </>
  );
}
