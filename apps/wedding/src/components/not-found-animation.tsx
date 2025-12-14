'use client';

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

import { IMAGE } from '../core/constant';

export function NotFoundAnimation() {
  return (
    <div>
      <DotLottieReact autoplay loop src={IMAGE.notFound} />
    </div>
  );
}
