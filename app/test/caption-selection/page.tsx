'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CaptionSelection from '@/app/ui/caption-selection';

export default function CaptionSelectionTestPage() {
  const router = useRouter();
  const [selectedCaptions, setSelectedCaptions] = useState<string[]>([]);

  const handleNext = () => {
    console.log('Selected captions:', selectedCaptions);
    alert(`Proceeding with ${selectedCaptions.length} confirmed caption(s)`);
    // Navigate to next step or perform action
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6"
          >
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
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">
            Caption Selection Test
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Review and select from generated captions.
          </p>
        </div>

        {/* Caption Selection Component */}
        <CaptionSelection
          onConfirm={(captions) => setSelectedCaptions(captions)}
          onNext={handleNext}
        />
      </div>
    </div>
  );
}

