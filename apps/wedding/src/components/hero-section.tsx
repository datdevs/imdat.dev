import Slider from './slider';
import HeroOverlay from './hero-overlay';
import ScrollIndicator from './scroll-indicator';

interface HeroSectionProps {
  readonly slides: readonly string[];
  readonly title: string;
  readonly subtitle: string;
  readonly scrollTarget?: string;
}

export default function HeroSection({ slides, subtitle, title, scrollTarget }: HeroSectionProps) {
  return (
    <section className="relative">
      <Slider slides={slides} />
      <HeroOverlay subtitle={subtitle} title={title} />
      <ScrollIndicator href={scrollTarget} />
    </section>
  );
}
