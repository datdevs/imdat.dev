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

export default function Slider({ slides }: { readonly slides: readonly string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSlideChange = useCallback((swiper: SwiperClass) => {
    setActiveIndex(swiper.realIndex);
  }, []);

  return (
    <SwiperComponent
      allowTouchMove={false}
      autoplay={{ delay: 5000 }}
      className="h-screen w-full"
      effect="fade"
      fadeEffect={{
        crossFade: true,
      }}
      loop={true}
      modules={[A11y, Autoplay, EffectFade]}
      noSwiping={true}
      onSlideChange={handleSlideChange}
      speed={2500}
      touchMoveStopPropagation={true}
    >
      {slides.map((slide, index) => {
        const isCurrentSlide = index === activeIndex;

        const animationClasses = clsx(
          'slide-image',
          'pointer-events-none size-full object-cover select-none',
          'transition-transform duration-15000',
          `origin-${transformOrigins[index % transformOrigins.length]}`,
          isCurrentSlide ? 'scale-100' : 'scale-125',
        );

        return (
          <SwiperSlide key={slide}>
            <Image alt="Slide" className={animationClasses} height={2000} loading="eager" src={slide} width={2000} />
          </SwiperSlide>
        );
      })}
    </SwiperComponent>
  );
}
