'use client';

import { useRef, useState } from 'react';
import type { ImageFile } from './types';

const SOCIAL_PRESETS = [
  { network: 'Instagram', aspectRatios: [1, 4/5, 1.91], label: '1:1, 4:5, 1.91:1' },
  { network: 'TikTok', aspectRatios: [9/16], label: '9:16' },
  { network: 'Pinterest', aspectRatios: [2/3, 1], label: '2:3, 1:1' },
  { network: 'LinkedIn', aspectRatios: [1.91, 1], label: '1.91:1, 1:1' },
  { network: 'YouTube', aspectRatios: [16/9], label: '16:9' },
];

const ACCEPTED_FORMATS = [ 'image/jpeg', 'image/jpg', 'image/png', 'image/webp' ];
const MAX_SIZE = 8 * 1024 * 1024;

const ratioLabel = 'Recommended: Instagram (1:1, 4:5), TikTok (9:16), Pinterest (2:3), LinkedIn (1.91:1), YouTube (16:9)';

function getAspectRatio(w: number, h: number) {
  return h === 0 ? 0 : +(w / h).toFixed(2);
}

function checkAspectRatio(width: number, height: number) {
  const ratio = getAspectRatio(width, height);
  // allow for ±0.05 tolerance
  return SOCIAL_PRESETS.some(preset => preset.aspectRatios.some(ar => Math.abs(ar - ratio) < 0.05));
}

async function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new window.Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(url);
    };
    img.onerror = (e) => reject(e);
    img.src = url;
  });
}

export default function ProductImageUploader() {
  const fileInput = useRef<HTMLInputElement>(null);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warn, setWarn] = useState<string | null>(null);

  const handleAddImages = async (files: FileList | null) => {
    if (!files) return;
    setError(null);
    setWarn(null);

    for (let i = 0; i < files.length; ++i) {
      const file = files[i];
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        setError('Only JPG, PNG, WEBP formats are supported.');
        continue;
      }
      if (file.size > MAX_SIZE) {
        setError('File size should be below 8MB.');
        continue;
      }
      const dims = await getImageDimensions(file);
      if (!checkAspectRatio(dims.width, dims.height)) {
        setWarn('Aspect ratio does not match major social presets (' + ratioLabel + ')');
      }
      const preview = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = e => res(e.target?.result as string);
        reader.onerror = rej;
        reader.readAsDataURL(file);
      });
      const image: ImageFile = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2,8)}`,
        file,
        preview,
        name: file.name,
        size: file.size,
        type: file.type,
      };
      // Simulate backend upload (replace with real API later)
      setIsUploading(true);
      await new Promise(r => setTimeout(r, 1200));
      setIsUploading(false);
      setImages(imgs => [...imgs, image]);
    }
    fileInput.current && (fileInput.current.value = '');
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleAddImages(e.target.files);
  };

  const handleRemove = (id: string) => {
    setImages(imgs => imgs.filter(img => img.id !== id));
  };

  const handleReplace = (id: string) => {
    fileInput.current?.click();
    // On file select, replace the image with matching id (handled in handleFileInput via context, so this could be expanded for real scenario)
  };

  const triggerFile = () => fileInput.current?.click();

  // Thumbnails + 'Add' button layout
  return (
    <div className="w-full">
      <div className="flex items-center gap-4 flex-wrap">
        {images.map((img, idx) => (
          <div key={img.id} className="group relative flex flex-col items-center">
            <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg overflow-hidden w-24 h-24 bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center">
              <img
                src={img.preview}
                alt={img.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute top-1 right-1 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                className="bg-red-600 text-white p-1 rounded-full shadow hover:bg-red-700"
                onClick={() => handleRemove(img.id)}
                title="Remove"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
            <button
              className="mt-2 px-2 py-1 text-xs bg-indigo-100 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-100 rounded"
              onClick={triggerFile}
              disabled={isUploading}
              title="Replace image"
            >Edit</button>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[6rem]" title={img.name}>{img.name}</div>
          </div>
        ))}
        <div>
          <button
            type="button"
            onClick={triggerFile}
            disabled={isUploading}
            className="w-24 h-24 border-2 border-dashed border-indigo-400 dark:border-indigo-600 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-400 bg-zinc-50 dark:bg-zinc-900 hover:bg-indigo-50 hover:dark:bg-indigo-900/30 transition-colors"
            aria-label="Add Image"
          >
            {isUploading ? (
              <svg className="animate-spin w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
            ) : (
              <span className="flex flex-col items-center gap-2 text-base font-medium"><span>+</span>Add</span>
            )}
          </button>
          <input
            ref={fileInput}
            type="file"
            multiple
            accept={ACCEPTED_FORMATS.join(',')}
            className="hidden"
            onChange={handleFileInput}
          />
        </div>
      </div>
      {/* Error/Warning below */}
      {error && <div className="mt-2 text-sm text-red-600 animate-shake">{error}</div>}
      {warn && <div className="mt-1 text-xs text-yellow-600">{warn}</div>}
      <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400">{ratioLabel}</div>
      <style jsx>{`
        @keyframes shake {
          0%,100%{ transform: translateX(0); }
          25%{ transform: translateX(-4px); }
          75%{ transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.3s ease-in-out; }
      `}</style>
    </div>
  );
}
