import Image from 'next/image';

interface GalleryItemProps {
  readonly alt: string;
  readonly category: string;
  readonly fullSrc: string;
  readonly src: string;
}

export default function GalleryItem({ alt, category, fullSrc, src }: GalleryItemProps) {
  return (
    <div className={`gallery-item ${category}`}>
      <a className="img-zoom" data-src={fullSrc} href={fullSrc}>
        <div className="gallery-box">
          <div className="gallery-img">
            <Image alt={alt} className="vuj-laz" height={208} src={src} width={312} />
          </div>
          <div className="gallery-detail"></div>
        </div>
      </a>
    </div>
  );
}
