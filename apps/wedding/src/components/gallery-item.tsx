import Image from 'next/image';

interface GalleryItemProps {
  readonly alt: string;
  readonly category: string;
  readonly fullSrc: string;
  readonly src: string;
}

export default function GalleryItem({ alt, category, fullSrc, src }: GalleryItemProps) {
  return (
    <div className={`gallery-item w-full border-10 border-transparent md:w-1/2 lg:w-1/3 ${category}`}>
      <a
        aria-label={`View ${alt} in full size`}
        className="img-zoom focus-visible:ring-primary focus-visible:rounded focus-visible:ring-2 focus-visible:outline-none"
        data-src={fullSrc}
        href={fullSrc}
      >
        <div className="gallery-box">
          <div className="gallery-img">
            <Image
              alt={alt}
              className="h-52 w-full object-cover"
              height={512}
              loading="lazy"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
              src={src}
              width={512}
            />
          </div>
          <div aria-hidden="true" className="gallery-detail"></div>
        </div>
      </a>
    </div>
  );
}
