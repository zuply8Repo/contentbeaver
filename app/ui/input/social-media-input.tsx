'use client';

import { useState, useEffect } from 'react';
import { SocialMediaInfo, SocialMediaInfoInputProps, SocialMediaInfoValidationErrors, PlatformConfig, ImageFormat } from './types';

// Instagram Image Formats
const INSTAGRAM_FORMATS: ImageFormat[] = [
  {
    aspectRatio: "1:1",
    minWidth: 1080,
    minHeight: 1080,
    maxWidth: 1080,
    maxHeight: 1080,
    fileTypes: ["JPG", "PNG"],
    label: "Square (1:1) - 1080x1080px"
  },
  {
    aspectRatio: "4:5",
    minWidth: 1080,
    minHeight: 1350,
    maxWidth: 1080,
    maxHeight: 1350,
    fileTypes: ["JPG", "PNG"],
    label: "Portrait (4:5) - 1080x1350px"
  },
  {
    aspectRatio: "16:9",
    minWidth: 1080,
    minHeight: 608,
    maxWidth: 1080,
    maxHeight: 608,
    fileTypes: ["JPG", "PNG"],
    label: "Landscape (16:9) - 1080x608px"
  }
];

// LinkedIn Image Formats
const LINKEDIN_FORMATS: ImageFormat[] = [
  {
    aspectRatio: "1:1",
    minWidth: 1200,
    minHeight: 1200,
    maxWidth: 1200,
    maxHeight: 1200,
    fileTypes: ["JPG", "PNG"],
    label: "Square (1:1) - 1200x1200px"
  },
  {
    aspectRatio: "16:9",
    minWidth: 1200,
    minHeight: 675,
    maxWidth: 1200,
    maxHeight: 675,
    fileTypes: ["JPG", "PNG"],
    label: "Landscape (16:9) - 1200x675px"
  }
];

const getFormatsForPlatform = (platform: 'Instagram' | 'LinkedIn'): ImageFormat[] => {
  return platform === 'Instagram' ? INSTAGRAM_FORMATS : LINKEDIN_FORMATS;
};

const getDefaultFormat = (platform: 'Instagram' | 'LinkedIn'): ImageFormat => {
  const formats = getFormatsForPlatform(platform);
  return formats[0]; // Default to first format
};

// Instagram Posting Types
const INSTAGRAM_POSTING_TYPES = [
  'Image Post',
  'Video Post',
  'Reel',
  'Story',
  'Carousel',
];

// LinkedIn Posting Types
const LINKEDIN_POSTING_TYPES = [
  'Image Post',
  'Video Post',
  'Article',
  'Document',
  'Poll',
];

const getPostingTypesForPlatform = (platform: 'Instagram' | 'LinkedIn'): string[] => {
  return platform === 'Instagram' ? INSTAGRAM_POSTING_TYPES : LINKEDIN_POSTING_TYPES;
};

const getDefaultPostingType = (platform: 'Instagram' | 'LinkedIn'): string => {
  const types = getPostingTypesForPlatform(platform);
  return types[0]; // Default to first type
};

export default function SocialMediaInput({
  onSubmit,
  onSave,
  initialData,
  isLoading = false,
  className = '',
}: SocialMediaInfoInputProps) {
  const [formData, setFormData] = useState<SocialMediaInfo>({
    platforms: initialData?.platforms || [],
  });

  const [errors, setErrors] = useState<SocialMediaInfoValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<'Instagram' | 'LinkedIn'>>(
    new Set(initialData?.platforms?.map(p => p.platform) || [])
  );

  // Auto-save functionality
  useEffect(() => {
    if (onSave && Object.keys(touched).length > 0) {
      const timer = setTimeout(() => {
        onSave(formData);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData, onSave, touched]);

  // Sync platforms when selectedPlatforms changes
  useEffect(() => {
    setFormData(prevFormData => {
      const newPlatforms: PlatformConfig[] = [];
      
      selectedPlatforms.forEach(platform => {
        const existing = prevFormData.platforms.find(p => p.platform === platform);
        if (existing) {
          newPlatforms.push(existing);
        } else {
          // Create new platform config with defaults
          newPlatforms.push({
            platform,
            postsPerWeek: 3,
            imageFormat: getDefaultFormat(platform),
            postingType: getDefaultPostingType(platform),
          });
        }
      });

      return { ...prevFormData, platforms: newPlatforms };
    });
  }, [selectedPlatforms]);

  const validateForm = (): boolean => {
    const newErrors: SocialMediaInfoValidationErrors = {};

    // Platforms validation
    if (formData.platforms.length === 0) {
      newErrors.platforms = 'At least one platform must be selected';
    } else {
      // Validate each platform
      for (let i = 0; i < formData.platforms.length; i++) {
        const platform = formData.platforms[i];
        if (platform.postsPerWeek < 1 || platform.postsPerWeek > 50) {
          newErrors.platforms = `Posts per week for ${platform.platform} must be between 1 and 50`;
          break;
        }
        if (!platform.imageFormat) {
          newErrors.platforms = `Image format for ${platform.platform} is required`;
          break;
        }
      }
    }

    // Validate posting type for each platform
    for (let i = 0; i < formData.platforms.length; i++) {
      const platform = formData.platforms[i];
      if (!platform.postingType || platform.postingType.trim() === '') {
        newErrors.platforms = `Posting type for ${platform.platform} is required`;
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      platforms: [],
    });
    setSelectedPlatforms(new Set());
    setErrors({});
    setTouched({});
  };

  const togglePlatform = (platform: 'Instagram' | 'LinkedIn') => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platform)) {
      newSelected.delete(platform);
      // Remove platform from formData
      setFormData({
        ...formData,
        platforms: formData.platforms.filter(p => p.platform !== platform),
      });
    } else {
      newSelected.add(platform);
      // Add platform to formData with defaults
      const newPlatform: PlatformConfig = {
        platform,
        postsPerWeek: formData.defaultPostsPerWeek || 3,
        imageFormat: getDefaultFormat(platform),
      };
      setFormData({
        ...formData,
        platforms: [...formData.platforms, newPlatform],
      });
    }
    setSelectedPlatforms(newSelected);
    setTouched({ ...touched, platforms: true });
  };

  const updatePlatformPostsPerWeek = (platform: 'Instagram' | 'LinkedIn', value: number) => {
    setFormData({
      ...formData,
      platforms: formData.platforms.map(p =>
        p.platform === platform ? { ...p, postsPerWeek: value } : p
      ),
    });
    setTouched({ ...touched, [`${platform}_posts`]: true });
  };

  const updatePlatformImageFormat = (platform: 'Instagram' | 'LinkedIn', format: ImageFormat) => {
    setFormData({
      ...formData,
      platforms: formData.platforms.map(p =>
        p.platform === platform ? { ...p, imageFormat: format } : p
      ),
    });
    setTouched({ ...touched, [`${platform}_format`]: true });
  };

  const updatePlatformPostingType = (platform: 'Instagram' | 'LinkedIn', postingType: string) => {
    setFormData({
      ...formData,
      platforms: formData.platforms.map(p =>
        p.platform === platform ? { ...p, postingType } : p
      ),
    });
    setTouched({ ...touched, [`${platform}_postingType`]: true });
  };

  const getPlatformConfig = (platform: 'Instagram' | 'LinkedIn'): PlatformConfig | undefined => {
    return formData.platforms.find(p => p.platform === platform);
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Platform Selection */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">
            Select Platforms *
          </label>
          <div className="space-y-3">
            {/* Instagram */}
            <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedPlatforms.has('Instagram')}
                onChange={() => togglePlatform('Instagram')}
                className="w-5 h-5 text-indigo-600 dark:text-indigo-400 rounded border-zinc-300 dark:border-zinc-600 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <div className="flex-1">
                <div className="font-medium text-zinc-900 dark:text-zinc-100">Instagram</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Photo and video sharing platform</div>
              </div>
            </label>

            {/* LinkedIn */}
            <label className="flex items-center gap-3 p-4 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:border-indigo-500 dark:hover:border-indigo-500 cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={selectedPlatforms.has('LinkedIn')}
                onChange={() => togglePlatform('LinkedIn')}
                className="w-5 h-5 text-indigo-600 dark:text-indigo-400 rounded border-zinc-300 dark:border-zinc-600 focus:ring-indigo-500"
                disabled={isLoading}
              />
              <div className="flex-1">
                <div className="font-medium text-zinc-900 dark:text-zinc-100">LinkedIn</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400">Professional networking platform</div>
              </div>
            </label>
          </div>
          {errors.platforms && touched.platforms && (
            <p className="text-sm text-red-500 mt-2 animate-shake" role="alert">
              {errors.platforms}
            </p>
          )}
        </div>

        {/* Platform Configuration Cards */}
        {formData.platforms.map((platformConfig) => {
          const formats = getFormatsForPlatform(platformConfig.platform);
          return (
            <div
              key={platformConfig.platform}
              className="p-6 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 space-y-4"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                  {platformConfig.platform} Configuration
                </h3>
                <button
                  type="button"
                  onClick={() => togglePlatform(platformConfig.platform)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-medium"
                  disabled={isLoading}
                >
                  Remove
                </button>
              </div>

              {/* Posts Per Week */}
              <div className="group">
                <label
                  htmlFor={`${platformConfig.platform}_posts`}
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Posts Per Week *
                </label>
                <input
                  type="number"
                  id={`${platformConfig.platform}_posts`}
                  value={platformConfig.postsPerWeek}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 0;
                    updatePlatformPostsPerWeek(platformConfig.platform, value);
                  }}
                  onBlur={() => setTouched({ ...touched, [`${platformConfig.platform}_posts`]: true })}
                  min="1"
                  max="50"
                  className="w-full px-4 py-3 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  disabled={isLoading}
                />
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Range: 1-50 posts per week
                </p>
              </div>

              {/* Posting Type Selection */}
              <div className="group">
                <label
                  htmlFor={`${platformConfig.platform}_postingType`}
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Posting Type *
                </label>
                <select
                  id={`${platformConfig.platform}_postingType`}
                  value={platformConfig.postingType}
                  onChange={(e) => {
                    updatePlatformPostingType(platformConfig.platform, e.target.value);
                  }}
                  onBlur={() => setTouched({ ...touched, [`${platformConfig.platform}_postingType`]: true })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  disabled={isLoading}
                >
                  {getPostingTypesForPlatform(platformConfig.platform).map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  Select the type of content you'll post on {platformConfig.platform}
                </p>
              </div>

              {/* Image Format Selection */}
              <div className="group">
                <label
                  htmlFor={`${platformConfig.platform}_format`}
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2"
                >
                  Image Format *
                </label>
                <select
                  id={`${platformConfig.platform}_format`}
                  value={formats.findIndex(f => f.aspectRatio === platformConfig.imageFormat.aspectRatio)}
                  onChange={(e) => {
                    const selectedFormat = formats[parseInt(e.target.value)];
                    updatePlatformImageFormat(platformConfig.platform, selectedFormat);
                  }}
                  onBlur={() => setTouched({ ...touched, [`${platformConfig.platform}_format`]: true })}
                  className="w-full px-4 py-3 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all duration-200"
                  disabled={isLoading}
                >
                  {formats.map((format, index) => (
                    <option key={index} value={index}>
                      {format.label}
                    </option>
                  ))}
                </select>

                {/* Format Details Display */}
                <div className="mt-3 p-4 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
                  <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Selected Format Details:
                  </div>
                  <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                    <div>
                      <span className="font-medium">Aspect Ratio:</span> {platformConfig.imageFormat.aspectRatio}
                    </div>
                    <div>
                      <span className="font-medium">Dimensions:</span> {platformConfig.imageFormat.minWidth}x{platformConfig.imageFormat.minHeight}px
                    </div>
                    <div>
                      <span className="font-medium">File Types:</span> {platformConfig.imageFormat.fileTypes.join(', ')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

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
              'Submit Social Media Configuration'
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
            <span className="font-medium">Social media configuration submitted successfully!</span>
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

