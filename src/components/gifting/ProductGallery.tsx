"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import { ChevronLeft, ChevronRight, Maximize2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductGalleryProps {
  images: string[];
  altText: string;
}

export function ProductGallery({ images, altText }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Sync scroll position when index changes via thumbnails or buttons
  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const width = container.clientWidth;
      container.scrollTo({
        left: width * currentIndex,
        behavior: "smooth"
      });
    }
  }, [currentIndex]);

  // Update index based on scroll position (for mobile swipe/horizontal scroll)
  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollPosition = container.scrollLeft;
    const width = container.clientWidth;
    const newIndex = Math.round(scrollPosition / width);
    if (newIndex !== currentIndex && newIndex >= 0 && newIndex < images.length) {
      setCurrentIndex(newIndex);
    }
  };

  const nextImage = useCallback(() => {
    setCurrentIndex(prev => Math.min(prev + 1, images.length - 1));
  }, [images.length]);

  const prevImage = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") nextImage();
    if (e.key === "ArrowLeft") prevImage();
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e: globalThis.KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === "Escape") setIsFullscreen(false);
        if (e.key === "ArrowRight") nextImage();
        if (e.key === "ArrowLeft") prevImage();
      }
    };
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => window.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isFullscreen, nextImage, prevImage]);

  if (!images || images.length === 0) return null;

  return (
    <>
      <div 
        className="flex flex-col-reverse lg:flex-row gap-4 w-full select-none"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        
        {/* Thumbnails (Hidden on very small screens, visible lg, or bottom row md) */}
        <div className="hidden lg:flex flex-col gap-3 w-[72px] xl:w-[86px] shrink-0">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "relative w-full aspect-[4/5] rounded-md overflow-hidden bg-[#F4F2EA] transition-all",
                currentIndex === idx ? "ring-1 ring-[#183330] ring-offset-2" : "opacity-60 hover:opacity-100"
              )}
              aria-label={`View image ${idx + 1}`}
              aria-current={currentIndex === idx}
            >
              <img 
                src={img} 
                alt={`Thumbnail ${idx + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Main Image Viewport */}
        <div className="relative flex-1 bg-[#F4F2EA] rounded-lg overflow-hidden group">
          
          <div 
            ref={scrollContainerRef}
            className="flex w-full aspect-[4/5] md:aspect-[1/1] lg:aspect-[4/5] overflow-x-auto snap-x snap-mandatory hide-scrollbar"
            onScroll={handleScroll}
          >
            {images.map((img, idx) => (
              <div key={idx} className="w-full shrink-0 snap-center relative h-full">
                <img 
                  src={img} 
                  alt={`${altText} - View ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Floating Controls (Desktop Hover) */}
          {images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                disabled={currentIndex === 0}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm items-center justify-center text-[#183330] hover:bg-white disabled:opacity-0 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={nextImage}
                disabled={currentIndex === images.length - 1}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur shadow-sm items-center justify-center text-[#183330] hover:bg-white disabled:opacity-0 transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Fullscreen Trigger */}
          <button
            onClick={() => setIsFullscreen(true)}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-[#183330] hover:bg-white transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            aria-label="View fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>

          {/* Mobile Pagination Dots */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 lg:hidden">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={cn(
                    "w-1.5 h-1.5 rounded-full transition-all",
                    currentIndex === idx ? "bg-[#183330] w-3" : "bg-black/20"
                  )}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {isFullscreen && (
        <div className="fixed inset-0 z-[100] bg-white flex flex-col items-center justify-center animate-in fade-in duration-200">
          <div className="absolute top-0 w-full flex items-center justify-between p-4 md:p-6 z-10">
            <span className="text-[13px] font-medium text-[#5F706C] tracking-widest uppercase">
              {currentIndex + 1} / {images.length}
            </span>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsFullscreen(false)}
              className="text-[#183330] hover:bg-[#F4F2EA] rounded-full w-10 h-10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center px-4">
            <img 
              src={images[currentIndex]} 
              alt={`${altText} - Fullscreen View ${currentIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {images.length > 1 && (
              <>
                <button 
                  onClick={prevImage}
                  disabled={currentIndex === 0}
                  className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#F4F2EA] flex items-center justify-center text-[#183330] hover:bg-[#E4E7E2] disabled:opacity-30 transition-all"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button 
                  onClick={nextImage}
                  disabled={currentIndex === images.length - 1}
                  className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#F4F2EA] flex items-center justify-center text-[#183330] hover:bg-[#E4E7E2] disabled:opacity-30 transition-all"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
