import { HeartIcon } from 'lucide-react';

interface ScrollIndicatorProps {
  readonly href?: string;
}

export default function ScrollIndicator({ href = '#couple' }: ScrollIndicatorProps) {
  return (
    <div className="absolute right-0 bottom-0 left-0 z-10 flex items-center justify-center pb-16">
      <a
        aria-label="Scroll to couple section"
        className="flex cursor-pointer text-white focus-visible:rounded focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        href={href}
      >
        <HeartIcon aria-hidden="true" className="size-6 animate-bounce motion-reduce:animate-none" />
      </a>
    </div>
  );
}
