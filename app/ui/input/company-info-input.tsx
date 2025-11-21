'use client';

import { useState, useEffect } from 'react';
import { CompanyInfo, CompanyInfoInputProps, CompanyInfoValidationErrors } from './types';

const PREDEFINED_INDUSTRIES = [
  'Technology',
  'Fashion & Apparel',
  'Food & Beverage',
  'Health & Wellness',
  'Beauty & Cosmetics',
  'Home & Living',
  'Sports & Fitness',
  'Education',
  'Finance',
  'Entertainment',
  'Travel & Hospitality',
  'Automotive',
  'Real Estate',
  'E-commerce',
  'B2B Services',
];

export default function CompanyInfoInput({
  onSubmit,
  onSave,
  initialData,
  isLoading = false,
  className = '',
}: CompanyInfoInputProps) {
  const [formData, setFormData] = useState<CompanyInfo>({
    companyName: initialData?.companyName || '',
    industryNiche: initialData?.industryNiche || '',
    productService: initialData?.productService || '',
    audience: initialData?.audience || '',
    mission: initialData?.mission || '',
    vision: initialData?.vision || '',
    statements: initialData?.statements || [''],
  });

  const [errors, setErrors] = useState<CompanyInfoValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
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
    const newErrors: CompanyInfoValidationErrors = {};

    // Company Name validation
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    } else if (formData.companyName.length > 100) {
      newErrors.companyName = 'Company name must not exceed 100 characters';
    }

    // Industry/Niche validation
    if (!formData.industryNiche.trim()) {
      newErrors.industryNiche = 'Industry/Niche is required';
    } else if (formData.industryNiche.length < 2) {
      newErrors.industryNiche = 'Industry/Niche must be at least 2 characters';
    } else if (formData.industryNiche.length > 100) {
      newErrors.industryNiche = 'Industry/Niche must not exceed 100 characters';
    }

    // Product/Service validation
    if (!formData.productService.trim()) {
      newErrors.productService = 'Product/Service is required';
    } else if (formData.productService.length < 10) {
      newErrors.productService = 'Product/Service must be at least 10 characters';
    } else if (formData.productService.length > 300) {
      newErrors.productService = 'Product/Service must not exceed 300 characters';
    }

    // Audience validation
    if (!formData.audience.trim()) {
      newErrors.audience = 'Audience is required';
    } else if (formData.audience.length < 10) {
      newErrors.audience = 'Audience must be at least 10 characters';
    } else if (formData.audience.length > 500) {
      newErrors.audience = 'Audience must not exceed 500 characters';
    }

    // Mission validation
    if (!formData.mission.trim()) {
      newErrors.mission = 'Mission is required';
    } else if (formData.mission.length < 10) {
      newErrors.mission = 'Mission must be at least 10 characters';
    } else if (formData.mission.length > 500) {
      newErrors.mission = 'Mission must not exceed 500 characters';
    }

    // Vision validation
    if (!formData.vision.trim()) {
      newErrors.vision = 'Vision is required';
    } else if (formData.vision.length < 10) {
      newErrors.vision = 'Vision must be at least 10 characters';
    } else if (formData.vision.length > 500) {
      newErrors.vision = 'Vision must not exceed 500 characters';
    }

    // Statements validation
    const validStatements = formData.statements.filter((s) => s.trim());
    if (validStatements.length > 5) {
      newErrors.statements = 'Maximum 5 statements allowed';
    } else if (validStatements.some((s) => s.length > 200)) {
      newErrors.statements = 'Each statement must not exceed 200 characters';
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
      companyName: '',
      industryNiche: '',
      productService: '',
      audience: '',
      mission: '',
      vision: '',
      statements: [''],
    });
    setErrors({});
    setTouched({});
  };

  const addStatement = () => {
    if (formData.statements.length < 5) {
      setFormData({ ...formData, statements: [...formData.statements, ''] });
    }
  };

  const removeStatement = (index: number) => {
    const newStatements = formData.statements.filter((_, i) => i !== index);
    setFormData({ ...formData, statements: newStatements.length ? newStatements : [''] });
  };

  const updateStatement = (index: number, value: string) => {
    const newStatements = [...formData.statements];
    newStatements[index] = value;
    setFormData({ ...formData, statements: newStatements });
  };

  const selectIndustry = (industry: string) => {
    setFormData({ ...formData, industryNiche: industry });
    setTouched({ ...touched, industryNiche: true });
    setShowIndustryDropdown(false);
  };

  const filteredIndustries = PREDEFINED_INDUSTRIES.filter((industry) =>
    industry.toLowerCase().includes(formData.industryNiche.toLowerCase())
  );

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Company Name */}
        <div className="group">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            Company Name *
          </label>
          <input
            type="text"
            id="companyName"
            value={formData.companyName}
            onChange={(e) => {
              setFormData({ ...formData, companyName: e.target.value });
              setTouched({ ...touched, companyName: true });
            }}
            onBlur={() => setTouched({ ...touched, companyName: true })}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              errors.companyName && touched.companyName
                ? 'border-red-500 focus:border-red-500'
                : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500'
            }`}
            placeholder="Enter your company name"
            maxLength={100}
            disabled={isLoading}
            aria-invalid={errors.companyName && touched.companyName ? 'true' : 'false'}
            aria-describedby={errors.companyName ? 'companyName-error' : undefined}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.companyName && touched.companyName && (
              <p
                id="companyName-error"
                className="text-sm text-red-500 animate-shake"
                role="alert"
              >
                {errors.companyName}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
              {formData.companyName.length}/100
            </p>
          </div>
        </div>

        {/* Industry/Niche */}
        <div className="group relative">
          <label
            htmlFor="industryNiche"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            Industry/Niche *
          </label>
          <input
            type="text"
            id="industryNiche"
            value={formData.industryNiche}
            onChange={(e) => {
              setFormData({ ...formData, industryNiche: e.target.value });
              setTouched({ ...touched, industryNiche: true });
              setShowIndustryDropdown(true);
            }}
            onBlur={() => {
              setTouched({ ...touched, industryNiche: true });
              setTimeout(() => setShowIndustryDropdown(false), 200);
            }}
            onFocus={() => setShowIndustryDropdown(true)}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 ${
              errors.industryNiche && touched.industryNiche
                ? 'border-red-500 focus:border-red-500'
                : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500'
            }`}
            placeholder="e.g., Technology, Fashion, Food & Beverage"
            maxLength={100}
            disabled={isLoading}
            aria-invalid={errors.industryNiche && touched.industryNiche ? 'true' : 'false'}
            aria-describedby={errors.industryNiche ? 'industryNiche-error' : undefined}
          />
          
          {/* Industry Dropdown */}
          {showIndustryDropdown && filteredIndustries.length > 0 && formData.industryNiche && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredIndustries.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => selectIndustry(industry)}
                  className="w-full px-4 py-2 text-left text-sm text-zinc-700 dark:text-zinc-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors"
                >
                  {industry}
                </button>
              ))}
            </div>
          )}

          <div className="flex justify-between items-center mt-1">
            {errors.industryNiche && touched.industryNiche && (
              <p
                id="industryNiche-error"
                className="text-sm text-red-500 animate-shake"
                role="alert"
              >
                {errors.industryNiche}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
              {formData.industryNiche.length}/100
            </p>
          </div>
        </div>

        {/* Product/Service */}
        <div className="group">
          <label
            htmlFor="productService"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            Product/Service *
          </label>
          <textarea
            id="productService"
            value={formData.productService}
            onChange={(e) => {
              setFormData({ ...formData, productService: e.target.value });
              setTouched({ ...touched, productService: true });
            }}
            onBlur={() => setTouched({ ...touched, productService: true })}
            rows={3}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y ${
              errors.productService && touched.productService
                ? 'border-red-500 focus:border-red-500'
                : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500'
            }`}
            placeholder="Describe what your company offers"
            maxLength={300}
            disabled={isLoading}
            aria-invalid={errors.productService && touched.productService ? 'true' : 'false'}
            aria-describedby={errors.productService ? 'productService-error' : undefined}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.productService && touched.productService && (
              <p
                id="productService-error"
                className="text-sm text-red-500 animate-shake"
                role="alert"
              >
                {errors.productService}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
              {formData.productService.length}/300
            </p>
          </div>
        </div>

        {/* Audience */}
        <div className="group">
          <label
            htmlFor="audience"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            Target Audience *
          </label>
          <textarea
            id="audience"
            value={formData.audience}
            onChange={(e) => {
              setFormData({ ...formData, audience: e.target.value });
              setTouched({ ...touched, audience: true });
            }}
            onBlur={() => setTouched({ ...touched, audience: true })}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y ${
              errors.audience && touched.audience
                ? 'border-red-500 focus:border-red-500'
                : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500'
            }`}
            placeholder="Describe your target audience (demographics, interests, needs)"
            maxLength={500}
            disabled={isLoading}
            aria-invalid={errors.audience && touched.audience ? 'true' : 'false'}
            aria-describedby={errors.audience ? 'audience-error' : undefined}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.audience && touched.audience && (
              <p
                id="audience-error"
                className="text-sm text-red-500 animate-shake"
                role="alert"
              >
                {errors.audience}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
              {formData.audience.length}/500
            </p>
          </div>
        </div>

        {/* Mission */}
        <div className="group">
          <label
            htmlFor="mission"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            Mission Statement *
          </label>
          <textarea
            id="mission"
            value={formData.mission}
            onChange={(e) => {
              setFormData({ ...formData, mission: e.target.value });
              setTouched({ ...touched, mission: true });
            }}
            onBlur={() => setTouched({ ...touched, mission: true })}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y ${
              errors.mission && touched.mission
                ? 'border-red-500 focus:border-red-500'
                : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500'
            }`}
            placeholder="What is your company's mission? What drives you?"
            maxLength={500}
            disabled={isLoading}
            aria-invalid={errors.mission && touched.mission ? 'true' : 'false'}
            aria-describedby={errors.mission ? 'mission-error' : undefined}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.mission && touched.mission && (
              <p
                id="mission-error"
                className="text-sm text-red-500 animate-shake"
                role="alert"
              >
                {errors.mission}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
              {formData.mission.length}/500
            </p>
          </div>
        </div>

        {/* Vision */}
        <div className="group">
          <label
            htmlFor="vision"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            Vision Statement *
          </label>
          <textarea
            id="vision"
            value={formData.vision}
            onChange={(e) => {
              setFormData({ ...formData, vision: e.target.value });
              setTouched({ ...touched, vision: true });
            }}
            onBlur={() => setTouched({ ...touched, vision: true })}
            rows={4}
            className={`w-full px-4 py-3 rounded-lg border-2 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-y ${
              errors.vision && touched.vision
                ? 'border-red-500 focus:border-red-500'
                : 'border-zinc-200 dark:border-zinc-700 focus:border-indigo-500'
            }`}
            placeholder="What is your company's vision for the future?"
            maxLength={500}
            disabled={isLoading}
            aria-invalid={errors.vision && touched.vision ? 'true' : 'false'}
            aria-describedby={errors.vision ? 'vision-error' : undefined}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.vision && touched.vision && (
              <p
                id="vision-error"
                className="text-sm text-red-500 animate-shake"
                role="alert"
              >
                {errors.vision}
              </p>
            )}
            <p className="text-xs text-zinc-500 dark:text-zinc-400 ml-auto">
              {formData.vision.length}/500
            </p>
          </div>
        </div>

        {/* Statements */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
            Brand Statements (Optional, Max 5)
          </label>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">
            Add positioning statements, values, or other key brand messages
          </p>
          <div className="space-y-3">
            {formData.statements.map((statement, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={statement}
                  onChange={(e) => {
                    updateStatement(index, e.target.value);
                    setTouched({ ...touched, statements: true });
                  }}
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  placeholder={`Statement ${index + 1}`}
                  maxLength={200}
                  disabled={isLoading}
                />
                {formData.statements.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStatement(index)}
                    className="px-4 py-3 rounded-lg border-2 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                    disabled={isLoading}
                    aria-label={`Remove statement ${index + 1}`}
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
          {formData.statements.length < 5 && (
            <button
              type="button"
              onClick={addStatement}
              className="mt-3 px-4 py-2 rounded-lg border-2 border-dashed border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:border-indigo-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-150 text-sm font-medium"
              disabled={isLoading}
            >
              + Add Statement
            </button>
          )}
          {errors.statements && touched.statements && (
            <p className="text-sm text-red-500 mt-2 animate-shake" role="alert">
              {errors.statements}
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
              'Submit Company Information'
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
            <span className="font-medium">Company information submitted successfully!</span>
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

