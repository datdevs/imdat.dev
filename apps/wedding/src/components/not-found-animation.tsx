'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { IMAGE } from '../core/constant';

export function NotFoundAnimation() {
  return (
    <div className="h-auto w-full max-w-sm md:max-w-md">
      <DotLottieReact autoplay loop src={IMAGE.notFound} />
    </div>
  );
}
