"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import Link from "next/link";
import Image from "next/image";

interface Photo {
  _id: string;
  title?: string;
  description?: string;
  album: string;
  url?: string | null;
  uploadedAt?: number;
  featured?: boolean;
  isPublic?: boolean;
}


const GalleryPage = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number>(0);
  const [lightboxLoading, setLightboxLoading] = useState<boolean>(false);

  // Fetch all photos at once (no pagination)
  const photosData = useQuery(api.photos.getPhotosByCategory, {});
  const photos = photosData?.photos || [];


  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (!photos.length) return;
    
    // Show loading state immediately
    setLightboxLoading(true);
    
    const newIndex = direction === 'prev' 
      ? (lightboxIndex - 1 + photos.length) % photos.length
      : (lightboxIndex + 1) % photos.length;
    
    setLightboxIndex(newIndex);
    setSelectedPhoto(photos[newIndex]);
  };


  return (
    <main className="min-h-screen bg-gradient-to-b from-[color:var(--pure-white)] via-[color:var(--light-blue)] to-[color:var(--pure-white)]">
      {/* Classic Header */}
      <div className="relative bg-[color:var(--pure-white)] border-b-2 border-[color:var(--border-blue)] overflow-hidden">
        {/* Classical pattern overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[color:var(--accent-blue)]/5 to-transparent"></div>
          <div className="absolute top-0 left-1/2 w-px h-full bg-gradient-to-b from-[color:var(--border-blue)] via-transparent to-[color:var(--border-blue)] transform -translate-x-0.5"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-[color:var(--border-blue)] via-transparent to-[color:var(--border-blue)] transform -translate-y-0.5"></div>
        </div>
        
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-20">
          <div className="text-center space-y-8">
            <div>
              <Link 
                href="/"
                className="text-sm text-[color:var(--text-gray)] hover:text-[color:var(--button-blue)] transition-all duration-300 inline-flex items-center gap-2 bg-[color:var(--pure-white)]/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                ← Back to Wedding
              </Link>
            </div>
            
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-7xl md:text-8xl font-serif leading-tight text-[color:var(--primary-navy)] font-light drop-shadow-sm">
                Our Gallery
              </h1>
              
              <div className="flex items-center justify-center space-x-6">
                <div className="h-px w-20 bg-gradient-to-r from-transparent via-[color:var(--accent-blue)] to-[color:var(--button-blue)]"></div>
                <div className="w-3 h-3 bg-gradient-to-br from-[color:var(--button-blue)] to-[color:var(--accent-blue)] rounded-full shadow-lg"></div>
                <div className="h-px w-20 bg-gradient-to-l from-transparent via-[color:var(--accent-blue)] to-[color:var(--button-blue)]"></div>
              </div>
              
              <p className="text-xl text-[color:var(--text-gray)] max-w-3xl mx-auto leading-relaxed">
                Our favorite moments together
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Photo Grid */}
        {photos.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
              {photos.map((photo, index) => (
                <div
                  key={photo._id}
                  className="group cursor-pointer"
                  onClick={() => openLightbox(photo, index)}
                >
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[color:var(--soft-gray)] shadow-lg hover:shadow-xl transition-shadow duration-300">
                    {photo.url ? (
                      <Image
                        src={photo.url}
                        alt={photo.title || `Photo from ${photo.album}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        loading="lazy"
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWEREiMxUf/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-12 h-12 border-4 border-[color:var(--light-blue)] border-t-[color:var(--button-blue)] rounded-full animate-spin"></div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </>
        ) : (
          <div className="text-center py-32">
            <div className="relative mb-12 flex items-center justify-center">
              <div className="w-24 h-24 border-4 border-[color:var(--light-blue)] border-t-[color:var(--button-blue)] rounded-full animate-spin opacity-60"></div>
            </div>
            <div className="space-y-6">
              <h3 className="text-4xl font-serif text-[color:var(--primary-navy)] font-light">
                Our memories are loading...
              </h3>
              <p className="text-[color:var(--text-gray)] text-xl max-w-md mx-auto leading-relaxed">
                Beautiful photos will appear here once they&apos;re uploaded. Check back soon for our latest memories!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Lightbox Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
          <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
            {/* Enhanced Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 z-60 w-14 h-14 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 backdrop-blur-md shadow-2xl hover:scale-110 hover:rotate-90"
            >
              ×
            </button>
            
            {/* Enhanced Navigation arrows */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={() => navigateLightbox('prev')}
                  className="absolute left-6 z-60 w-16 h-16 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 backdrop-blur-md shadow-2xl hover:scale-110 hover:-translate-x-1"
                >
                  ←
                </button>
                
                <button
                  onClick={() => navigateLightbox('next')}
                  className="absolute right-6 z-60 w-16 h-16 bg-white/15 hover:bg-white/25 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 backdrop-blur-md shadow-2xl hover:scale-110 hover:translate-x-1"
                >
                  →
                </button>
              </>
            )}
            
            {/* Image Display with Loading */}
            <div className="relative w-full h-full flex items-center justify-center p-8">
              {/* Loading Indicator */}
              {lightboxLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-white/60 rounded-full animate-spin animate-reverse"></div>
                  </div>
                </div>
              )}
              
              {/* Image */}
              {selectedPhoto.url && (
                <Image
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title || `Photo from ${selectedPhoto.album}`}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  onLoad={() => setLightboxLoading(false)}
                  onError={() => setLightboxLoading(false)}
                />
              )}
            </div>
            
            {/* Page indicator */}
            {photos.length > 1 && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-60">
                <div className="bg-white/15 backdrop-blur-md rounded-full px-4 py-2 text-white text-sm font-medium">
                  {lightboxIndex + 1} of {photos.length}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default GalleryPage;