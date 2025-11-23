'use client';

import { useState, useEffect } from 'react';
import { Theme, ThemeSelection as ThemeSelectionData, ThemeSelectionProps, ThemeSelectionValidationErrors } from './types';

export default function ThemeSelectionInput({
  themes,
  selectedThemeId: controlledSelectedThemeId,
  onSelect,
  onSave,
  onRegenerate,
  initialData,
  isLoading = false,
  className = '',
  required = false,
}: ThemeSelectionProps) {
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(
    controlledSelectedThemeId !== undefined 
      ? controlledSelectedThemeId 
      : (initialData as ThemeSelectionData)?.selectedThemeId || null
  );
  const [errors, setErrors] = useState<ThemeSelectionValidationErrors>({});
  const [touched, setTouched] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Sync with controlled prop if provided
  useEffect(() => {
    if (controlledSelectedThemeId !== undefined) {
      setSelectedThemeId(controlledSelectedThemeId);
    }
  }, [controlledSelectedThemeId]);

  // Auto-save functionality
  useEffect(() => {
    if (onSave && touched) {
      const timer = setTimeout(() => {
        onSave({ selectedThemeId });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [selectedThemeId, onSave, touched]);

  const validateSelection = (): boolean => {
    const newErrors: ThemeSelectionValidationErrors = {};

    if (required && !selectedThemeId) {
      newErrors.selectedThemeId = 'Please select a theme';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleThemeToggle = (themeId: string) => {
    setTouched(true);
    
    // Single selection behavior: if clicking the same theme, deselect it (if not required)
    // Otherwise, select the new theme and deselect the previous one
    const newSelectedId = selectedThemeId === themeId 
      ? (required ? themeId : null) 
      : themeId;
    
    setSelectedThemeId(newSelectedId);
    
    // Call onSelect callback if provided
    if (onSelect) {
      onSelect(newSelectedId);
    }

    // Validate after selection
    if (required) {
      validateSelection();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateSelection()) {
      if (onSelect) {
        onSelect(selectedThemeId);
      }
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    setSelectedThemeId(null);
    setTouched(false);
    setErrors({});
    if (onSelect) {
      onSelect(null);
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Theme Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Select Theme {required && '*'}
          </label>
          <div className="space-y-3">
            {themes.map((theme) => {
              const isSelected = selectedThemeId === theme.id;
              return (
                <label
                  key={theme.id}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'border-indigo-500 dark:border-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                      : 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-indigo-300 dark:hover:border-indigo-600'
                  } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleThemeToggle(theme.id)}
                    className="mt-1 w-5 h-5 text-indigo-600 dark:text-indigo-400 rounded border-zinc-300 dark:border-zinc-600 focus:ring-indigo-500 focus:ring-2"
                    disabled={isLoading}
                    aria-label={`Select ${theme.title} theme`}
                  />
                  <div className="flex-1">
                    <div className={`font-semibold text-lg mb-1 ${
                      isSelected 
                        ? 'text-indigo-700 dark:text-indigo-300' 
                        : 'text-zinc-900 dark:text-zinc-100'
                    }`}>
                      {theme.title}
                    </div>
                    <div className={`text-sm ${
                      isSelected 
                        ? 'text-indigo-600 dark:text-indigo-400' 
                        : 'text-zinc-600 dark:text-zinc-400'
                    }`}>
                      {theme.description}
                    </div>
                  </div>
                  {isSelected && (
                    <div className="flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-indigo-600 dark:text-indigo-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </label>
              );
            })}
          </div>
          {errors.selectedThemeId && touched && (
            <p className="text-sm text-red-500 mt-2 animate-shake" role="alert">
              {errors.selectedThemeId}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
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
              </span>
            ) : (
              'Confirm Selection'
            )}
          </button>

          {onRegenerate && (
            <button
              type="button"
              onClick={onRegenerate}
              disabled={isLoading}
              className="px-6 py-3 rounded-lg border-2 border-indigo-300 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 font-medium hover:bg-indigo-100 dark:hover:bg-indigo-900/30 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Regenerate
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
            <span className="font-medium">Theme selected successfully!</span>
          </div>
        )}
      </form>

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

