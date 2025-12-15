'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface ImageLightboxProps {
  images: string[]
  initialIndex: number
  onClose: () => void
  title?: string
}

export default function ImageLightbox({ images, initialIndex, onClose, title }: ImageLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') handlePrevious()
      if (e.key === 'ArrowRight') handleNext()
    }

    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [currentIndex])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))
  }

  if (images.length === 0) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      <div className="relative w-full h-full flex items-center justify-center p-4">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Title */}
        {title && (
          <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg z-10">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-sm text-gray-300">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
        )}

        {/* Previous Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePrevious()
            }}
            className="absolute left-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}

        {/* Image */}
        <div
          className="relative max-w-7xl max-h-[90vh] flex items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleNext()
            }}
            className="absolute right-4 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors z-10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 p-3 rounded-lg max-w-full overflow-x-auto">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden border-2 transition-all ${
                  idx === currentIndex
                    ? 'border-white scale-110'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
