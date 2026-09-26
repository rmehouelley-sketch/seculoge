'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Image from 'next/image';

export interface PropertyGalleryProps {
  images: string[];
  className?: string;
}

const PropertyGallery = ({ images, className }: PropertyGalleryProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setSelectedImage(images[index]);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      setSelectedImage(images[currentIndex === 0 ? images.length - 1 : currentIndex - 1]);
    } else {
      setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      setSelectedImage(images[currentIndex === images.length - 1 ? 0 : currentIndex + 1]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowLeft') {
      navigate('prev');
    } else if (e.key === 'ArrowRight') {
      navigate('next');
    }
  };

  if (images.length === 0) {
    return (
      <div className={cn('bg-secondary-100 rounded-xl aspect-video flex items-center justify-center', className)}>
        <span className="text-secondary-500">Aucune image disponible</span>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-4', className)}>
        {/* Primary Image */}
        <div
          className="relative aspect-video rounded-xl overflow-hidden cursor-pointer"
          onClick={() => openLightbox(0)}
        >
          <Image
            src={images[0]}
            alt="Photo principale"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
          <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
          <span className="absolute bottom-3 right-3 bg-black/70 text-white px-2 py-1 rounded text-sm">
            1 / {images.length}
          </span>
        </div>

        {/* Secondary Images */}
        <div className="grid grid-cols-2 gap-4">
          {images.slice(1, 3).map((image, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-xl overflow-hidden cursor-pointer"
              onClick={() => openLightbox(index + 1)}
            >
              <Image
                src={image}
                alt={`Photo ${index + 2}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/20 hover:bg-black/10 transition-colors" />
              <span className="absolute bottom-2 right-2 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                {index + 2} / {images.length}
              </span>
            </div>
          ))}
        </div>

        {/* More images indicator */}
        {images.length > 3 && (
          <div
            className="relative aspect-video rounded-xl overflow-hidden cursor-pointer md:col-span-2"
            onClick={() => openLightbox(3)}
          >
            <Image
              src={images[3]}
              alt={`Photo 4`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                + {images.length - 3} photos
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label="Galerie d'images"
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            aria-label="Fermer"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Navigation Buttons */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('prev');
            }}
            className="absolute left-6 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            aria-label="Précédent"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate('next');
            }}
            className="absolute right-6 p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors"
            aria-label="Suivant"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full">
            <span className="text-sm">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          {/* Image */}
          <div
            className="relative max-w-full max-h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={selectedImage}
              alt="Photo du logement"
              width={800}
              height={600}
              className="max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
              sizes="90vw"
            />
          </div>
        </div>
      )}
    </>
  );
};

PropertyGallery.displayName = 'PropertyGallery';

export { PropertyGallery };
