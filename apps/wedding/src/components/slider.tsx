'use client';

import type { SwiperClass } from 'swiper/react';

import clsx from 'clsx';
import Image from 'next/image';
import { useCallback, useState } from 'react'; // 1. Import Hooks
import { A11y, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/a11y';
import 'swiper/css/autoplay';
import { Swiper as SwiperComponent, SwiperSlide } from 'swiper/react';

const transformOrigins: readonly string[] = ['bottom-left', 'bottom-right', 'center', 'top-left', 'top-right'] as const;

interface SliderProps {
  readonly slides: readonly string[];
}

export default function Slider({ slides }: SliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  return (
    <SwiperComponent
      allowTouchMove={true}
      aria-label="Hero image carousel"
      autoplay={{ delay: 5000 }}
      className="h-screen w-full"
      effect="fade"
      fadeEffect={{
        crossFade: true,
      }}
      loop={true}
      modules={[A11y, Autoplay, EffectFade]}
      onSlideChange={handleSlideChange}
      speed={2500}
      touchMoveStopPropagation={true}
    >
      {slides.map((slide, index) => {
        const isCurrentSlide = index === activeIndex;

        const animationClasses = clsx(
          'slide-image',
          'pointer-events-none size-full object-cover select-none',
          'transition-transform duration-15000 motion-reduce:transition-none',
          `origin-${transformOrigins[index % transformOrigins.length]}`,
          isCurrentSlide ? 'scale-100' : 'scale-125 motion-reduce:scale-100',
        );

        return (
          <SwiperSlide aria-label={`Slide ${index + 1} of ${slides.length}`} key={slide}>
            <Image
              alt={`Wedding slide ${index + 1} of ${slides.length}`}
              className={animationClasses}
              height={2000}
              loading="eager"
              src={slide}
              width={2000}
            />
          </SwiperSlide>
        );
      })}
    </SwiperComponent>
  );
}
