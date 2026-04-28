"use client";

import { useState } from "react";
import { X, ZoomIn, ZoomOut, RotateCw, Maximize2 } from "lucide-react";
import { ContentImage } from "@/components/shared/content-image";

interface ImageZoomProps {
  imageUrl: string;
  alt: string;
  children: React.ReactNode;
}

export function ImageZoom({ imageUrl, alt, children }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 5));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5));
  const handleRotate = () => setRotation((prev) => prev + 90);
  const handleReset = () => {
    setScale(1);
    setRotation(0);
  };

  return (
    <>
      <div onClick={() => setIsZoomed(true)} className="cursor-pointer">
        {children}
      </div>

      {isZoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div
            className="relative flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute -right-16 -top-16 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-900 shadow-lg transition hover:bg-slate-100"
            >
              <X className="h-6 w-6" />
            </button>

            {/* Image container */}
            <div className="relative max-h-[90vh] max-w-[95vw] overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm">
              <img
                src={imageUrl}
                alt={alt}
                className="max-h-[90vh] max-w-[95vw] object-contain transition-transform duration-200 ease-out"
                style={{
                  transform: `scale(${scale}) rotate(${rotation}deg)`,
                }}
              />
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md px-6 py-3 shadow-2xl">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 disabled:opacity-30"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              
              <span className="min-w-[3rem] text-center text-sm font-semibold text-white">
                {Math.round(scale * 100)}%
              </span>
              
              <button
                onClick={handleZoomIn}
                disabled={scale >= 5}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30 disabled:opacity-30"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              
              <div className="w-px h-8 bg-white/20" />
              
              <button
                onClick={handleRotate}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              >
                <RotateCw className="h-5 w-5" />
              </button>
              
              <button
                onClick={handleReset}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white transition hover:bg-white/30"
              >
                <Maximize2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
