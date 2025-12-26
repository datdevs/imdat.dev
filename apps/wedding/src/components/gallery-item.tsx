import Image from 'next/image';

interface GalleryItemProps {
  readonly alt: string;
  readonly category: string;
  readonly fullSrc: string;
  readonly src: string;
}

export default function GalleryItem({ alt, category, fullSrc, src }: GalleryItemProps) {
  return (
    <div className={category}>
      <a className="img-zoom" data-src={fullSrc} href={fullSrc}>
        <div className="gallery-box">
          <div className="gallery-img">
            <Image alt={alt} className="h-52 w-full object-cover" height={512} src={src} width={512} />
          </div>
          <div className="gallery-detail"></div>
        </div>
      </a>
    </div>
  );
}
