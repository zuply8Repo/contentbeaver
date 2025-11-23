'use client';

import { useState, useEffect } from 'react';
import { ImagePost, ImageSelection, ImageSelectionProps, ImageSelectionValidationErrors } from './types';

export default function ImageSelectionInput({
  images,
  onConfirm,
  onRegenerate,
  onSave,
  initialData,
  isLoading = false,
  isRegenerating = false,
  className = '',
}: ImageSelectionProps) {
  const [imageSelection, setImageSelection] = useState<ImageSelection>({
    images: initialData?.images || images || [],
  });
  const [errors, setErrors] = useState<ImageSelectionValidationErrors>({});
  const [touched, setTouched] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageLoadErrors, setImageLoadErrors] = useState<Record<string, boolean>>({});

  // Sync with controlled images prop
  useEffect(() => {
    if (images && images.length > 0) {
      setImageSelection({ images });
    }
  }, [images]);

  // Auto-save functionality
  useEffect(() => {
    if (onSave && touched && imageSelection.images.length > 0) {
      const timer = setTimeout(() => {
        onSave(imageSelection);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [imageSelection, onSave, touched]);

  const validateImages = (): boolean => {
    const newErrors: ImageSelectionValidationErrors = {};

    if (!imageSelection.images || imageSelection.images.length !== 3) {
      newErrors.images = 'Exactly 3 images are required';
    } else {
      for (let i = 0; i < imageSelection.images.length; i++) {
        const image = imageSelection.images[i];
        if (!image.imageUrl || image.imageUrl.trim() === '') {
          newErrors.images = `Image ${i + 1} must have a valid URL`;
          break;
        }
        if (!image.caption || image.caption.trim() === '') {
          newErrors.images = `Image ${i + 1} must have a caption`;
          break;
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    setTouched(true);
    if (validateImages() && onConfirm) {
      onConfirm(imageSelection.images);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleRegenerate = () => {
    if (onRegenerate) {
      onRegenerate();
    }
  };

  const handleImageError = (imageId: string) => {
    setImageLoadErrors((prev) => ({ ...prev, [imageId]: true }));
  };

  return (
    <div className={`w-full max-w-6xl mx-auto ${className}`}>
      <div className="space-y-6">
        {/* Images Grid */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-4">
            Review Images for Social Media Posting
          </label>
          
          {errors.images && touched && (
            <p className="text-sm text-red-500 mb-4 animate-shake" role="alert">
              {errors.images}
            </p>
          )}

          <div className="relative">
            {/* Images Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pointer-events-none" aria-hidden={isRegenerating}>
              {imageSelection.images.map((image, index) => (
                <div
                  key={image.id}
                  className="bg-white dark:bg-zinc-900 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  {/* Image Container */}
                  <div className="relative aspect-square bg-zinc-100 dark:bg-zinc-800">
                    {imageLoadErrors[image.id] ? (
                      <div className="w-full h-full flex items-center justify-center bg-zinc-200 dark:bg-zinc-700">
                        <div className="text-center p-4">
                          <svg
                            className="w-12 h-12 text-zinc-400 dark:text-zinc-500 mx-auto mb-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                          <p className="text-sm text-zinc-500 dark:text-zinc-400">
                            Image {index + 1}
                          </p>
                          <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1">
                            Failed to load
                          </p>
                        </div>
                      </div>
                    ) : (
                      <img
                        src={image.imageUrl}
                        alt={`Social media post image ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={() => handleImageError(image.id)}
                        loading="lazy"
                      />
                    )}
                    {/* Image Number Badge */}
                    <div className="absolute top-2 left-2 bg-indigo-600 dark:bg-indigo-500 text-white text-xs font-semibold px-2 py-1 rounded">
                      {index + 1}
                    </div>
                  </div>

                  {/* Caption Container */}
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                        Caption
                      </span>
                    </div>
                    <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                      {image.caption}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Beaver Overlay while regenerating */}
            {isRegenerating && (
              <div className="absolute inset-0 bg-indigo-50 dark:bg-indigo-900/70 bg-opacity-80 flex flex-col items-center justify-center z-10">
                <svg
                  className="w-32 h-32 animate-bounce mb-6 text-brown-700 dark:text-yellow-300"
                  viewBox="0 0 128 128"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Body */}
                  <ellipse cx="64" cy="80" rx="38" ry="32" fill="#A0754C" />
                  {/* Head */}
                  <ellipse cx="64" cy="54" rx="22" ry="20" fill="#A0754C" />
                  {/* Nose */}
                  <ellipse cx="64" cy="68" rx="8" ry="5" fill="#603813" />
                  {/* Left ear */}
                  <ellipse cx="51" cy="41" rx="4" ry="4.5" fill="#A0754C" />
                  {/* Right ear */}
                  <ellipse cx="77" cy="41" rx="4" ry="4.5" fill="#A0754C" />
                  {/* Eyes */}
                  <ellipse cx="57.5" cy="57" rx="2.5" ry="3.5" fill="#191919" />
                  <ellipse cx="70.5" cy="57" rx="2.5" ry="3.5" fill="#191919" />
                  {/* Smile */}
                  <path d="M58 70 Q64 75, 70 70" stroke="#191919" strokeWidth="2" fill="none" />
                  {/* Tree trunk */}
                  <rect x="96" y="70" width="11" height="34" rx="6" fill="#856140" />
                  {/* Tree top (leaves) */}
                  <ellipse cx="105" cy="67" rx="10" ry="9" fill="#56A05A" />
                  {/* Axe (against trunk) */}
                  <rect x="101" y="80" width="2" height="13" fill="#555" transform="rotate(15 102 80)" />
                  <rect x="100" y="92" width="5" height="3" fill="#AAA" transform="rotate(15 102.5 93.5)" />
                  {/* Beaver tail */}
                  <ellipse cx="86" cy="110" rx="12" ry="5" fill="#856140" />
                  {/* (Optional) animated woodchips or motion lines can be added for fun */}
                </svg>
                <p className="mt-2 text-lg font-semibold text-indigo-900 dark:text-indigo-100 animate-pulse">Beaver is preparing new images...</p>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isLoading || isRegenerating}
            className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Confirm Images
              </>
            )}
          </button>

          {onRegenerate && (
            <button
              type="button"
              onClick={handleRegenerate}
              disabled={isLoading || isRegenerating}
              className="px-6 py-3 rounded-lg border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isRegenerating ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Regenerating...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Regenerate Images
                </>
              )}
            </button>
          )}
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 flex items-center gap-2 animate-fadeIn">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium">Images confirmed successfully!</span>
          </div>
        )}
      </div>

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

