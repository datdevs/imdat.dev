import { HeartIcon } from 'lucide-react';

interface ScrollIndicatorProps {
  readonly href?: string;
}

export default function ScrollIndicator({ href = '#couple' }: ScrollIndicatorProps) {
  return (
    <div className="absolute right-0 bottom-0 left-0 z-10 flex animate-bounce items-center justify-center pb-16">
      <a className="flex cursor-pointer text-white" href={href}>
        <HeartIcon className="size-6" />
      </a>
    </div>
  );
}
