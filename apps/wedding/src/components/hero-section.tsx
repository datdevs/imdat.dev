import HeroOverlay from './hero-overlay';
import ScrollIndicator from './scroll-indicator';
import Slider from './slider';

interface HeroSectionProps {
  readonly scrollTarget?: string;
  readonly slides: readonly string[];
  readonly subtitle: string;
  readonly title: string;
}

export default function HeroSection({ scrollTarget, slides, subtitle, title }: HeroSectionProps) {
  return (
    <section className="relative">
      <Slider slides={slides} />
      <HeroOverlay subtitle={subtitle} title={title} />
      <ScrollIndicator href={scrollTarget} />
    </section>
  );
}
