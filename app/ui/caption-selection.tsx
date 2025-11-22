'use client';

import { useState } from 'react';

interface CaptionSelectionProps {
  initialCaptions?: string[];
  onConfirm?: (captions: string[]) => void;
  onNext?: () => void;
  onRegenerate?: () => Promise<string[]>;
}

export default function CaptionSelection({
  initialCaptions,
  onConfirm,
  onNext,
  onRegenerate,
}: CaptionSelectionProps) {
  // Generate initial captions if not provided
  const generateInitialCaptions = (): string[] => {
    return [
      'Transform your space with this stunning piece that combines elegance and functionality.',
      'Discover the perfect blend of style and comfort with our premium collection.',
      'Elevate your everyday experience with this beautifully crafted design.',
    ];
  };

  const [captions, setCaptions] = useState<string[]>(
    initialCaptions || generateInitialCaptions()
  );
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleConfirmAll = () => {
    setIsConfirmed(true);
    // Call onConfirm with all captions
    if (onConfirm) {
      onConfirm(captions);
    }
  };

  const handleRegenerateAll = async () => {
    setIsRegenerating(true);

    try {
      let newCaptions: string[];
      if (onRegenerate) {
        newCaptions = await onRegenerate();
      } else {
        // Simulate regeneration with a delay
        await new Promise((resolve) => setTimeout(resolve, 1000));
        newCaptions = [
          'Fresh new caption option one with updated creative messaging.',
          'Another innovative caption choice with compelling content.',
          'A third regenerated option featuring engaging copy.',
        ];
      }

      setCaptions(newCaptions);
      // Clear confirmation when regenerating
      setIsConfirmed(false);
    } catch (error) {
      console.error('Error regenerating captions:', error);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleNext = () => {
    if (onNext) {
      onNext();
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
      <div className="space-y-6">
        {captions.map((caption, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border-2 transition-all duration-200 ${
              isConfirmed
                ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                : 'border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50'
            }`}
          >
            <p className="text-zinc-900 dark:text-zinc-100 text-lg leading-relaxed">
              {caption}
            </p>
          </div>
        ))}

        {/* Confirm All Button */}
        <div className="pt-6 border-t border-zinc-200 dark:border-zinc-700">
          <button
            onClick={handleConfirmAll}
            disabled={isRegenerating || isConfirmed}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4 ${
              isConfirmed
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                : 'bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-300 dark:hover:bg-zinc-600'
            }`}
          >
            {isConfirmed ? (
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
                Confirmed
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
                Confirm All
              </>
            )}
          </button>
        </div>

        {/* Regenerate All Button */}
        <div>
          <button
            onClick={handleRegenerateAll}
            disabled={isRegenerating}
            className="w-full px-6 py-3 rounded-lg font-medium bg-white dark:bg-zinc-800 border-2 border-zinc-300 dark:border-zinc-600 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4"
          >
            {isRegenerating ? (
              <>
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
                Regenerating All...
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
                Regenerate All
              </>
            )}
          </button>
        </div>

        {/* Next Button */}
        <div>
          <button
            onClick={handleNext}
            className="w-full px-6 py-3.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 flex items-center justify-center gap-2"
          >
            Next
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
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

