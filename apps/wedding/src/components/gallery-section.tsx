'use client';

import Isotope from 'isotope-layout';
import lgThumbnail from 'lightgallery/plugins/thumbnail';
import lgZoom from 'lightgallery/plugins/zoom';
import 'lightgallery/css/lightgallery.css';
import 'lightgallery/css/lg-zoom.css';
import 'lightgallery/css/lg-thumbnail.css';
import LightGallery from 'lightgallery/react';
import { useEffect, useRef, useState } from 'react';

import GalleryFilter from './gallery-filter';
import GalleryItem from './gallery-item';

interface GalleryImage {
  readonly alt: string;
  readonly category: string;
  readonly fullSrc: string;
  readonly src: string;
}

interface GallerySectionProps {
  readonly categories: Record<string, string>;
  readonly images: readonly GalleryImage[];
  readonly subtitle: string;
  readonly title: string;
  readonly viewAllLabel: string;
}

export default function GallerySection({ categories, images, subtitle, title, viewAllLabel }: GallerySectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>('*');
  const gridRef = useRef<HTMLDivElement>(null);
  const isotopeRef = useRef<Isotope | null>(null);

  // Initialize Isotope
  useEffect(() => {
    if (globalThis.window === undefined) return;

    if (gridRef.current && images.length > 0) {
      const loadIsotope = async () => {
        // Dynamically import the library and use it
        const Isotope = (await import('isotope-layout')).default;

        isotopeRef.current = new Isotope(gridRef.current as HTMLElement, {
          itemSelector: '.gallery-item',
          layoutMode: 'fitRows',
        });
      };

      loadIsotope();

      // Re-arrange when images load
      const imageElements = gridRef.current.querySelectorAll('img');
      let loadedCount = 0;
      const totalImages = imageElements.length;

      const handleImageLoad = () => {
        loadedCount++;
        if (loadedCount === totalImages && isotopeRef.current) {
          isotopeRef.current.layout();
        }
      };

      if (totalImages > 0) {
        imageElements.forEach((img) => {
          if (img.complete) {
            handleImageLoad();
          } else {
            img.addEventListener('load', handleImageLoad);
            img.addEventListener('error', handleImageLoad); // Also handle errors
          }
        });
      } else {
        // If no images found yet, layout immediately
        isotopeRef?.current?.layout();
      }

      return () => {
        imageElements.forEach((img) => {
          img.removeEventListener('load', handleImageLoad);
          img.removeEventListener('error', handleImageLoad);
        });
        if (isotopeRef.current) {
          isotopeRef.current.destroy();
          isotopeRef.current = null;
        }
      };
    }
  }, [images]);

  // Handle filter changes
  useEffect(() => {
    if (isotopeRef.current) {
      if (activeFilter === '*') {
        isotopeRef.current.arrange({ filter: '*' });
      } else {
        isotopeRef.current.arrange({ filter: `.${activeFilter}` });
      }
    }
  }, [activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <section className="py-25">
      <div className="container mx-auto">
        <div className="mb-8">
          <h3 className="font-handwriting text-primary mb-2.5 text-3xl">{title}</h3>
          <h2 className="font-serif text-3xl font-medium tracking-[1px] text-black uppercase">{subtitle}</h2>
        </div>
        <div className="mb-8">
          <GalleryFilter
            activeFilter={activeFilter}
            categories={categories}
            onFilterChange={handleFilterChange}
            viewAllLabel={viewAllLabel}
          />
        </div>
        <LightGallery plugins={[lgThumbnail, lgZoom]} selector=".img-zoom" speed={500}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3" ref={gridRef}>
            {images.map((image, index) => (
              <GalleryItem
                alt={image.alt}
                category={image.category}
                fullSrc={image.fullSrc}
                key={`${image.category}-${index}`}
                src={image.src}
              />
            ))}
          </div>
        </LightGallery>
      </div>
    </section>
  );
}
