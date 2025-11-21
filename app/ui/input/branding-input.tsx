'use client';

import { useState, useEffect } from 'react';
import { BrandingInfo, BrandingInfoInputProps, BrandingInfoValidationErrors, ColorInfo } from './types';

const PREDEFINED_MOODS = [
  'Professional',
  'Playful',
  'Minimalist',
  'Bold',
  'Elegant',
  'Energetic',
  'Warm',
  'Cool',
  'Modern',
  'Classic',
  'Luxurious',
  'Friendly',
];

const DEFAULT_COLOR_NAMES = ['Primary', 'Secondary', 'Accent', 'Custom 1', 'Custom 2', 'Custom 3'];

export default function BrandingInput({
  onSubmit,
  onSave,
  initialData,
  isLoading = false,
  className = '',
}: BrandingInfoInputProps) {
  const [formData, setFormData] = useState<BrandingInfo>({
    colorPalette: initialData?.colorPalette || [
      { id: generateId(), hex: '#6366f1', name: 'Primary' },
    ],
    mood: initialData?.mood || [],
  });

  const [errors, setErrors] = useState<BrandingInfoValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [customMood, setCustomMood] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (onSave && Object.keys(touched).length > 0) {
      const timer = setTimeout(() => {
        onSave(formData);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData, onSave, touched]);

  const validateForm = (): boolean => {
    const newErrors: BrandingInfoValidationErrors = {};

    // Color Palette validation
    if (formData.colorPalette.length === 0) {
      newErrors.colorPalette = 'At least one color is required';
    } else if (formData.colorPalette.length > 6) {
      newErrors.colorPalette = 'Maximum 6 colors allowed';
    } else {
      // Validate hex codes
      const invalidColors = formData.colorPalette.filter(
        (color) => !isValidHex(color.hex)
      );
      if (invalidColors.length > 0) {
        newErrors.colorPalette = 'All colors must be valid hex codes';
      }
    }

    // Mood validation
    if (formData.mood.length === 0) {
      newErrors.mood = 'At least one mood tag is required';
    } else if (formData.mood.length > 8) {
      newErrors.mood = 'Maximum 8 mood tags allowed';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidHex = (hex: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(hex);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onSubmit) {
      onSubmit(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleReset = () => {
    setFormData({
      colorPalette: [{ id: generateId(), hex: '#6366f1', name: 'Primary' }],
      mood: [],
    });
    setErrors({});
    setTouched({});
  };

  const addColor = () => {
    if (formData.colorPalette.length < 6) {
      const nextIndex = formData.colorPalette.length;
      const newColor: ColorInfo = {
        id: generateId(),
        hex: '#000000',
        name: DEFAULT_COLOR_NAMES[nextIndex] || `Custom ${nextIndex + 1}`,
      };
      setFormData({
        ...formData,
        colorPalette: [...formData.colorPalette, newColor],
      });
      setTouched({ ...touched, colorPalette: true });
    }
  };

  const removeColor = (id: string) => {
    const newColors = formData.colorPalette.filter((color) => color.id !== id);
    setFormData({
      ...formData,
      colorPalette: newColors.length ? newColors : [{ id: generateId(), hex: '#6366f1', name: 'Primary' }],
    });
    setTouched({ ...touched, colorPalette: true });
  };

  const updateColor = (id: string, field: 'hex' | 'name', value: string) => {
    const newColors = formData.colorPalette.map((color) =>
      color.id === id ? { ...color, [field]: value } : color
    );
    setFormData({ ...formData, colorPalette: newColors });
    setTouched({ ...touched, colorPalette: true });
  };

  const addMood = (mood: string) => {
    if (!formData.mood.includes(mood) && formData.mood.length < 8) {
      setFormData({ ...formData, mood: [...formData.mood, mood] });
      setTouched({ ...touched, mood: true });
    }
  };

  const removeMood = (mood: string) => {
    setFormData({
      ...formData,
      mood: formData.mood.filter((m) => m !== mood),
    });
    setTouched({ ...touched, mood: true });
  };

  const handleAddCustomMood = () => {
    if (customMood.trim() && !formData.mood.includes(customMood.trim()) && customMood.length <= 50) {
      addMood(customMood.trim());
      setCustomMood('');
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Color Palette */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Color Palette * (Max 6 colors)
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
            Define your brand colors. Click the color square to pick a color, or enter a hex code manually.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {formData.colorPalette.map((color) => (
              <div
                key={color.id}
                className="p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 transition-all duration-200 hover:border-indigo-300 dark:hover:border-indigo-700"
              >
                <div className="flex items-start gap-3">
                  {/* Color Picker */}
                  <div className="flex-shrink-0">
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateColor(color.id, 'hex', e.target.value)}
                      className="w-16 h-16 rounded-lg cursor-pointer border-2 border-zinc-300 dark:border-zinc-600"
                      disabled={isLoading}
                      aria-label={`Color picker for ${color.name}`}
                    />
                  </div>

                  {/* Color Info */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => updateColor(color.id, 'name', e.target.value)}
                      className="w-full px-2 py-1 mb-2 text-sm font-medium rounded border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      placeholder="Color name"
                      maxLength={30}
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      value={color.hex}
                      onChange={(e) => {
                        const value = e.target.value.startsWith('#') ? e.target.value : `#${e.target.value}`;
                        updateColor(color.id, 'hex', value.toUpperCase());
                      }}
                      className="w-full px-2 py-1 text-xs font-mono rounded border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                      placeholder="#000000"
                      maxLength={7}
                      disabled={isLoading}
                    />
                  </div>

                  {/* Remove Button */}
                  {formData.colorPalette.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeColor(color.id)}
                      className="flex-shrink-0 p-1.5 rounded text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      disabled={isLoading}
                      aria-label={`Remove ${color.name} color`}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {formData.colorPalette.length < 6 && (
            <button
              type="button"
              onClick={addColor}
              className="w-full px-4 py-3 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 text-sm font-medium"
              disabled={isLoading}
            >
              + Add Color
            </button>
          )}

          {errors.colorPalette && touched.colorPalette && (
            <p className="text-sm text-red-500 mt-2 animate-shake" role="alert">
              {errors.colorPalette}
            </p>
          )}
        </div>

        {/* Mood Tags */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Brand Mood * (Max 8)
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            Select mood tags that represent your brand's personality and tone
          </p>

          {/* Selected Moods */}
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.mood.map((mood) => (
              <span
                key={mood}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-200 dark:border-indigo-800"
              >
                {mood}
                <button
                  type="button"
                  onClick={() => removeMood(mood)}
                  className="hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors"
                  disabled={isLoading}
                  aria-label={`Remove mood ${mood}`}
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </span>
            ))}
          </div>

          {/* Predefined Moods */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PREDEFINED_MOODS.filter((mood) => !formData.mood.includes(mood)).map((mood) => (
              <button
                key={mood}
                type="button"
                onClick={() => addMood(mood)}
                className="px-3 py-1.5 rounded-full border-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all duration-150"
                disabled={isLoading || formData.mood.length >= 8}
              >
                + {mood}
              </button>
            ))}
          </div>

          {/* Custom Mood Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customMood}
              onChange={(e) => setCustomMood(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomMood();
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Add custom mood"
              maxLength={50}
              disabled={isLoading || formData.mood.length >= 8}
            />
            <button
              type="button"
              onClick={handleAddCustomMood}
              className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-150"
              disabled={isLoading || formData.mood.length >= 8 || !customMood.trim()}
            >
              Add
            </button>
          </div>

          {errors.mood && touched.mood && (
            <p className="text-sm text-red-500 mt-2 animate-shake" role="alert">
              {errors.mood}
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
                Submitting...
              </span>
            ) : (
              'Submit Branding Information'
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={isLoading}
            className="px-6 py-3 rounded-lg border-2 border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Reset
          </button>
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
            <span className="font-medium">Branding information submitted successfully!</span>
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

// Helper function to generate unique IDs
function generateId(): string {
  return `color_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

