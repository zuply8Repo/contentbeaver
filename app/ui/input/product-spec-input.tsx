'use client';

import { useState, useEffect } from 'react';
import { ProductSpec, ProductSpecInputProps, ValidationErrors } from './types';

const PREDEFINED_TAGS = [
  'Electronics',
  'Software',
  'Hardware',
  'Mobile',
  'Web',
  'Cloud',
  'AI/ML',
  'IoT',
];

export default function ProductSpecInput({
  onSubmit,
  onSave,
  initialData,
  isLoading = false,
  className = '',
}: ProductSpecInputProps) {
  const [formData, setFormData] = useState<ProductSpec>({
    productName: initialData?.productName || '',
    description: initialData?.description || '',
    features: initialData?.features || [''],
    technicalSpecs: initialData?.technicalSpecs || '',
    tags: initialData?.tags || [],
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [customTag, setCustomTag] = useState('');
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
    const newErrors: ValidationErrors = {};

    // Product Name validation
    if (!formData.productName.trim()) {
      newErrors.productName = 'Product name is required';
    } else if (formData.productName.length < 3) {
      newErrors.productName = 'Product name must be at least 3 characters';
    } else if (formData.productName.length > 100) {
      newErrors.productName = 'Product name must not exceed 100 characters';
    }

    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must not exceed 500 characters';
    }

    // Features validation
    const validFeatures = formData.features.filter((f) => f.trim());
    if (validFeatures.length === 0) {
      newErrors.features = 'At least one feature is required';
    } else if (validFeatures.length > 10) {
      newErrors.features = 'Maximum 10 features allowed';
    } else if (validFeatures.some((f) => f.length > 100)) {
      newErrors.features = 'Each feature must not exceed 100 characters';
    }

    // Technical Specs validation
    if (formData.technicalSpecs.length > 1000) {
      newErrors.technicalSpecs = 'Technical specs must not exceed 1000 characters';
    }

    // Tags validation
    if (formData.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    } else if (formData.tags.length > 8) {
      newErrors.tags = 'Maximum 8 tags allowed';
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
      productName: '',
      description: '',
      features: [''],
      technicalSpecs: '',
      tags: [],
    });
    setErrors({});
    setTouched({});
  };

  const addFeature = () => {
    if (formData.features.length < 10) {
      setFormData({ ...formData, features: [...formData.features, ''] });
    }
  };

  const removeFeature = (index: number) => {
    const newFeatures = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: newFeatures.length ? newFeatures : [''] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...formData.features];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addTag = (tag: string) => {
    if (!formData.tags.includes(tag) && formData.tags.length < 8) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) });
  };

  const handleAddCustomTag = () => {
    if (customTag.trim() && !formData.tags.includes(customTag.trim())) {
      addTag(customTag.trim());
      setCustomTag('');
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div className="group">
          <label
            htmlFor="productName"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            Product Name *
          </label>
          <input
            type="text"
            id="productName"
            value={formData.productName}
            onChange={(e) => {
              setFormData({ ...formData, productName: e.target.value });
              setTouched({ ...touched, productName: true });
            }}
            onBlur={() => setTouched({ ...touched, productName: true })}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              errors.productName && touched.productName
                ? 'border-red-500 focus:border-red-500'
                : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500'
            }`}
            placeholder="Enter product name"
            maxLength={100}
            disabled={isLoading}
            aria-invalid={errors.productName && touched.productName ? 'true' : 'false'}
            aria-describedby={errors.productName ? 'productName-error' : undefined}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.productName && touched.productName && (
              <p
                id="productName-error"
                className="text-sm text-red-500 animate-shake"
                role="alert"
              >
                {errors.productName}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
              {formData.productName.length}/100
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="group">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            Product Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => {
              setFormData({ ...formData, description: e.target.value });
              setTouched({ ...touched, description: true });
            }}
            onBlur={() => setTouched({ ...touched, description: true })}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y ${
              errors.description && touched.description
                ? 'border-red-500 focus:border-red-500'
                : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500'
            }`}
            placeholder="Describe your product in detail"
            maxLength={500}
            disabled={isLoading}
            aria-invalid={errors.description && touched.description ? 'true' : 'false'}
            aria-describedby={errors.description ? 'description-error' : undefined}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.description && touched.description && (
              <p
                id="description-error"
                className="text-sm text-red-500 animate-shake"
                role="alert"
              >
                {errors.description}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
              {formData.description.length}/500
            </p>
          </div>
        </div>

        {/* Key Features */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Key Features * (Max 10)
          </label>
          <div className="space-y-3">
            {formData.features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={feature}
                  onChange={(e) => {
                    updateFeature(index, e.target.value);
                    setTouched({ ...touched, features: true });
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder={`Feature ${index + 1}`}
                  maxLength={100}
                  disabled={isLoading}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="px-4 py-3 rounded-lg border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                    disabled={isLoading}
                    aria-label={`Remove feature ${index + 1}`}
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          {formData.features.length < 10 && (
            <button
              type="button"
              onClick={addFeature}
              className="mt-3 px-4 py-2 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 text-sm font-medium"
              disabled={isLoading}
            >
              + Add Feature
            </button>
          )}
          {errors.features && touched.features && (
            <p className="text-sm text-red-500 mt-2 animate-shake" role="alert">
              {errors.features}
            </p>
          )}
        </div>

        {/* Technical Specifications */}
        <div className="group">
          <label
            htmlFor="technicalSpecs"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            Technical Specifications
            <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">
              (Optional - Markdown supported)
            </span>
          </label>
          <textarea
            id="technicalSpecs"
            value={formData.technicalSpecs}
            onChange={(e) => {
              setFormData({ ...formData, technicalSpecs: e.target.value });
              setTouched({ ...touched, technicalSpecs: true });
            }}
            rows={6}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 font-mono text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y ${
              errors.technicalSpecs && touched.technicalSpecs
                ? 'border-red-500 focus:border-red-500'
                : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500'
            }`}
            placeholder="Enter technical specifications...&#10;&#10;Example:&#10;- Processor: Intel i7&#10;- RAM: 16GB DDR4&#10;- Storage: 512GB SSD"
            maxLength={1000}
            disabled={isLoading}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.technicalSpecs && touched.technicalSpecs && (
              <p className="text-sm text-red-500 animate-shake" role="alert">
                {errors.technicalSpecs}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
              {formData.technicalSpecs.length}/1000
            </p>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Tags/Categories * (Max 8)
          </label>
          
          {/* Selected Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-200 dark:border-indigo-800"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-indigo-900 dark:hover:text-indigo-100 transition-colors"
                  disabled={isLoading}
                  aria-label={`Remove tag ${tag}`}
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

          {/* Predefined Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {PREDEFINED_TAGS.filter((tag) => !formData.tags.includes(tag)).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => addTag(tag)}
                className="px-3 py-1.5 rounded-full border-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 transition-all duration-150"
                disabled={isLoading || formData.tags.length >= 8}
              >
                + {tag}
              </button>
            ))}
          </div>

          {/* Custom Tag Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={customTag}
              onChange={(e) => setCustomTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomTag();
                }
              }}
              className="flex-1 px-4 py-2 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="Add custom tag"
              disabled={isLoading || formData.tags.length >= 8}
            />
            <button
              type="button"
              onClick={handleAddCustomTag}
              className="px-4 py-2 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-150"
              disabled={isLoading || formData.tags.length >= 8 || !customTag.trim()}
            >
              Add
            </button>
          </div>

          {errors.tags && touched.tags && (
            <p className="text-sm text-red-500 mt-2 animate-shake" role="alert">
              {errors.tags}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
              'Submit Product Specification'
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
            <span className="font-medium">Product specification submitted successfully!</span>
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

