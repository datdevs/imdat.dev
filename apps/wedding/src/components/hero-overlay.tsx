interface HeroOverlayProps {
  readonly subtitle: string;
  readonly title: string;
}

export default function HeroOverlay({ subtitle, title }: HeroOverlayProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center bg-linear-to-b from-transparent via-black/20 to-transparent text-white text-shadow-[1px_1px_5px_rgba(0,0,0,0.2)]">
      <h1 className="font-handwriting text-8xl text-white">{title}</h1>
      <p className="font-sans text-xl tracking-[5px] uppercase">{subtitle}</p>
    </div>
  );
}
