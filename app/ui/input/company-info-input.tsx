"use client";

import { useState, useEffect } from "react";
import {
  CompanyInfo,
  CompanyInfoInputProps,
  CompanyInfoValidationErrors,
} from "./types";

const PREDEFINED_INDUSTRIES = [
  "Technology",
  "Fashion & Apparel",
  "Food & Beverage",
  "Health & Wellness",
  "Beauty & Cosmetics",
  "Home & Living",
  "Sports & Fitness",
  "Education",
  "Finance",
  "Entertainment",
  "Travel & Hospitality",
  "Automotive",
  "Real Estate",
  "E-commerce",
  "B2B Services",
];

export default function CompanyInfoInput({
  onSubmit,
  onSave,
  onDataChange,
  initialData,
  isLoading = false,
  className = "",
}: CompanyInfoInputProps) {
  const [formData, setFormData] = useState<CompanyInfo>({
    companyName: initialData?.companyName || "",
    industryNiche: initialData?.industryNiche || "",
    productService: initialData?.productService || "",
    audience: initialData?.audience || "",
    mission: initialData?.mission || "",
    vision: initialData?.vision || "",
    statements: initialData?.statements || [""],
  });

  const [errors, setErrors] = useState<CompanyInfoValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);

  // Auto-save functionality
  useEffect(() => {
    if (onSave && Object.keys(touched).length > 0) {
      const timer = setTimeout(() => {
        onSave(formData);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [formData, onSave, touched]);

  // Notify parent of full, current data immediately when it changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(formData);
    }
  }, [formData, onDataChange]);

  const validateForm = (): boolean => {
    const newErrors: CompanyInfoValidationErrors = {};

    // Company Name validation (optional, but validate length if provided)
    if (formData.companyName.trim()) {
      if (formData.companyName.length < 2) {
        newErrors.companyName = "Company name must be at least 2 characters";
      } else if (formData.companyName.length > 100) {
        newErrors.companyName = "Company name must not exceed 100 characters";
      }
    }

    // Industry/Niche validation (optional, but validate length if provided)
    if (formData.industryNiche.trim()) {
      if (formData.industryNiche.length < 2) {
        newErrors.industryNiche =
          "Industry/Niche must be at least 2 characters";
      } else if (formData.industryNiche.length > 100) {
        newErrors.industryNiche =
          "Industry/Niche must not exceed 100 characters";
      }
    }

    // Product/Service validation (optional, but validate length if provided)
    if (formData.productService.trim()) {
      if (formData.productService.length < 10) {
        newErrors.productService =
          "Product/Service must be at least 10 characters";
      } else if (formData.productService.length > 300) {
        newErrors.productService =
          "Product/Service must not exceed 300 characters";
      }
    }

    // Audience validation (optional, but validate length if provided)
    if (formData.audience.trim()) {
      if (formData.audience.length < 10) {
        newErrors.audience = "Audience must be at least 10 characters";
      } else if (formData.audience.length > 500) {
        newErrors.audience = "Audience must not exceed 500 characters";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Re-run validation whenever fields have been touched and the data changes
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      validateForm();
    }
  }, [formData, touched]);

  const addStatement = () => {
    if (formData.statements.length < 5) {
      setFormData({ ...formData, statements: [...formData.statements, ""] });
    }
  };

  const removeStatement = (index: number) => {
    const newStatements = formData.statements.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      statements: newStatements.length ? newStatements : [""],
    });
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
      {/* Form submission is controlled by the parent page; prevent default here. */}
      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {/* Company Name */}
        <div className="group">
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
          >
            Company Name{" "}
            <span className="text-zinc-400 text-xs">(optional)</span>
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
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-200 dark:border-zinc-700 focus:border-indigo-500"
            }`}
            placeholder="Enter your company name"
            maxLength={100}
            disabled={isLoading}
            aria-invalid={
              errors.companyName && touched.companyName ? "true" : "false"
            }
            aria-describedby={
              errors.companyName ? "companyName-error" : undefined
            }
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
            Industry/Niche{" "}
            <span className="text-zinc-400 text-xs">(optional)</span>
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
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-200 dark:border-zinc-700 focus:border-indigo-500"
            }`}
            placeholder="e.g., Technology, Fashion, Food & Beverage"
            maxLength={100}
            disabled={isLoading}
            aria-invalid={
              errors.industryNiche && touched.industryNiche ? "true" : "false"
            }
            aria-describedby={
              errors.industryNiche ? "industryNiche-error" : undefined
            }
          />

          {/* Industry Dropdown */}
          {showIndustryDropdown &&
            filteredIndustries.length > 0 &&
            formData.industryNiche && (
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
            Product/Service{" "}
            <span className="text-zinc-400 text-xs">(optional)</span>
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
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-200 dark:border-zinc-700 focus:border-indigo-500"
            }`}
            placeholder="Describe what your company offers"
            maxLength={300}
            disabled={isLoading}
            aria-invalid={
              errors.productService && touched.productService ? "true" : "false"
            }
            aria-describedby={
              errors.productService ? "productService-error" : undefined
            }
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
            Target Audience{" "}
            <span className="text-zinc-400 text-xs">(optional)</span>
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
                ? "border-red-500 focus:border-red-500"
                : "border-zinc-200 dark:border-zinc-700 focus:border-indigo-500"
            }`}
            placeholder="Describe your target audience (demographics, interests, needs)"
            maxLength={500}
            disabled={isLoading}
            aria-invalid={
              errors.audience && touched.audience ? "true" : "false"
            }
            aria-describedby={errors.audience ? "audience-error" : undefined}
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

        {/* Mission, Vision, and Statements fields have been removed from the UI as per instructions. */}
      </form>

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
