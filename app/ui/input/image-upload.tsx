'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  ImageFile,
  ImageUploadProps,
  ImageUploadValidationErrors,
} from './types';

const DEFAULT_ACCEPTED_FORMATS = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
];

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB in bytes

// Format file size for display
const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export default function ImageUpload({
  onSubmit,
  onSave,
  onChange,
  initialImage = null,
  maxSize = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_ACCEPTED_FORMATS,
  isLoading = false,
  className = '',
  label = 'Upload Image',
  required = false,
}: ImageUploadProps) {
  // Use lazy initializer to prevent hydration mismatches
  const [image, setImage] = useState<ImageFile | null>(() => initialImage);
  const [errors, setErrors] = useState<ImageUploadValidationErrors>({});
  const [isDragging, setIsDragging] = useState(false);
  const [touched, setTouched] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync initialImage prop changes (prevent hydration issues by using ref)
  const initialImageRef = useRef(initialImage);
  useEffect(() => {
    // Only update if initialImage actually changed and we haven't touched the component
    if (initialImageRef.current !== initialImage && !touched) {
      initialImageRef.current = initialImage;
      setImage(initialImage);
    }
  }, [initialImage, touched]);

  // Auto-save functionality
  useEffect(() => {
    if (onSave && touched && isMounted) {
      const timer = setTimeout(() => {
        onSave(image);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [image, onSave, touched, isMounted]);

  // Call onChange when image changes
  useEffect(() => {
    if (onChange && touched && isMounted) {
      onChange(image);
    }
  }, [image, onChange, touched, isMounted]);

  // Create ImageFile from File
  const createImageFile = (file: File): Promise<ImageFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        const imageFile: ImageFile = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          preview,
          name: file.name,
          size: file.size,
          type: file.type,
        };
        resolve(imageFile);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Process file
  const processFile = useCallback(
    async (file: File) => {
      const newErrors: ImageUploadValidationErrors = {};

      // Validate file
      // Check file type
      if (!acceptedFormats.includes(file.type)) {
        newErrors.fileType = `File type not supported. Accepted formats: ${acceptedFormats
          .map((f) => f.split('/')[1].toUpperCase())
          .join(', ')}`;
        setErrors(newErrors);
        return;
      }

      // Check file size
      if (file.size > maxSize) {
        newErrors.fileSize = `File size exceeds maximum of ${formatFileSize(maxSize)}`;
        setErrors(newErrors);
        return;
      }

      // Create ImageFile object
      try {
        const imageFile = await createImageFile(file);
        setImage(imageFile);
        setTouched(true);
        setErrors({});
      } catch (error) {
        newErrors.image = 'Failed to process image';
        setErrors(newErrors);
      }
    },
    [maxSize, acceptedFormats]
  );

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      // Only process the first file
      processFile(files[0]);
    }
    // Reset input to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Handle drag events
  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = e.dataTransfer.files;
      if (files && files.length > 0) {
        // Only process the first file
        processFile(files[0]);
      }
    },
    [processFile]
  );

  // Remove image
  const removeImage = () => {
    setImage(null);
    setTouched(true);
    setErrors({});
  };

  // Replace image
  const replaceImage = () => {
    fileInputRef.current?.click();
  };

  // Validate component
  const validate = (): boolean => {
    const newErrors: ImageUploadValidationErrors = {};

    if (required && !image) {
      newErrors.image = 'An image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = () => {
    if (validate() && onSubmit) {
      onSubmit(image);
    }
  };

  // Format accepted file types for input
  const acceptedTypes = acceptedFormats.join(',');

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Drop Zone */}
      {!image && (
        <div
          ref={dropZoneRef}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => !isLoading && fileInputRef.current?.click()}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-all duration-200
            ${
              isDragging
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-zinc-300 dark:border-zinc-700 hover:border-indigo-400 dark:hover:border-indigo-600'
            }
            ${
              errors.image || errors.fileType || errors.fileSize
                ? 'border-red-500'
                : ''
            }
            ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
          role="button"
          tabIndex={0}
          aria-label="Image upload drop zone"
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileInputChange}
            className="hidden"
            disabled={isLoading}
            aria-label="File input"
          />

          <div className="flex flex-col items-center gap-3">
            <svg
              className={`w-12 h-12 ${
                isDragging
                  ? 'text-indigo-600 dark:text-indigo-400'
                  : 'text-zinc-400 dark:text-zinc-600'
              } transition-colors`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <span className="font-medium text-indigo-600 dark:text-indigo-400">
                Click to upload
              </span>{' '}
              or drag and drop
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-500">
              {acceptedFormats
                .map((f) => f.split('/')[1].toUpperCase())
                .join(', ')}{' '}
              up to {formatFileSize(maxSize)}
            </div>
          </div>
        </div>
      )}

      {/* Error Messages */}
      {(errors.image || errors.fileType || errors.fileSize) && (
        <div className="mt-2 space-y-1">
          {errors.image && (
            <p className="text-sm text-red-500 animate-shake" role="alert">
              {errors.image}
            </p>
          )}
          {errors.fileType && (
            <p className="text-sm text-red-500 animate-shake" role="alert">
              {errors.fileType}
            </p>
          )}
          {errors.fileSize && (
            <p className="text-sm text-red-500 animate-shake" role="alert">
              {errors.fileSize}
            </p>
          )}
        </div>
      )}

      {/* Image Preview */}
      {image && (
        <div className="mt-4">
          <div className="grid gap-4 grid-cols-1 max-w-md">
            <div className="relative group rounded-lg border-2 border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-900">
              {/* Image Preview */}
              <div className="aspect-square relative">
                <img
                  src={image.preview}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                    disabled={isLoading}
                    aria-label={`Remove ${image.name}`}
                  >
                    Remove
                  </button>
                </div>
              </div>

              {/* Image Info */}
              <div className="p-2">
                <p
                  className="text-xs font-medium text-zinc-900 dark:text-zinc-100 truncate"
                  title={image.name}
                >
                  {image.name}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  {formatFileSize(image.size)}
                </p>
              </div>

              {/* Remove button for mobile (always visible) */}
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700"
                disabled={isLoading}
                aria-label={`Remove ${image.name}`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Replace button */}
          <button
            type="button"
            onClick={replaceImage}
            disabled={isLoading}
            className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            Replace Image
          </button>
        </div>
      )}

      {/* Submit Button (if onSubmit provided) */}
      {onSubmit && image && (
        <div className="mt-6">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isLoading || (required && !image)}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </span>
            ) : (
              'Upload Image'
            )}
          </button>
        </div>
      )}

      {/* Custom styles for animations */}
      <style jsx>{`
        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-4px);
          }
          75% {
            transform: translateX(4px);
          }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

