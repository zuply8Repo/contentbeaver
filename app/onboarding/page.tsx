'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import CompanyInfoInput from '@/app/ui/input/company-info-input';
import BrandingInput from '@/app/ui/input/branding-input';
import { CompanyInfo, BrandingInfo } from '@/app/ui/input/types';

export default function OnboardingPage() {
  const router = useRouter();
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);
  const [brandingInfo, setBrandingInfo] = useState<BrandingInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSubmitting(true);

    try {
      // Build a safe payload with sensible defaults
      const company: CompanyInfo = companyInfo ?? {
        companyName: '',
        industryNiche: '',
        productService: '',
        audience: '',
        mission: '',
        vision: '',
        statements: [],
      };

      const colorPalette = brandingInfo?.colorPalette ?? [];
      const brandMood = brandingInfo?.mood ?? [];

      const res = await fetch('/api/company-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          companyInfo: company,
          colorPalette,
          brandMood,
        }),
      });

      const json = await res.json().catch(() => ({}));

      if (!res.ok || !json.success) {
        const message =
          json?.error?.message ?? 'Failed to save onboarding information.';
        setErrorMessage(message);
        console.error('Error saving onboarding info:', json);
        return;
      }

      setSuccessMessage('Onboarding information saved successfully.');

      // Navigate to the next step (e.g., product dashboard) after a short delay
      setTimeout(() => {
        router.push('/product-dashboard');
      }, 800);
    } catch (err) {
      console.error('Unexpected error saving onboarding info:', err);
      setErrorMessage('An unexpected error occurred while saving data.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Onboarding
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Tell us about your company and brand so we can tailor your experience.
            </p>
          </div>
        </div>

        {/* Status messages */}
        {errorMessage && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm">
            {errorMessage}
          </div>
        )}

        {successMessage && (
          <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm">
            {successMessage}
          </div>
        )}

        {/* Company Info */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-4">
          <header>
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Company Information
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Basic details about your business, product, and target audience.
            </p>
          </header>

          <CompanyInfoInput
            onDataChange={(data) => setCompanyInfo(data)}
            isLoading={isSubmitting}
            className="mt-4"
          />
        </section>

        {/* Branding Info */}
        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8 space-y-4">
          <header>
            <h2 className="text-xl sm:text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
              Branding Information
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
              Define your brand&apos;s visual identity and personality.
            </p>
          </header>

          <BrandingInput
            onDataChange={(data) => setBrandingInfo(data)}
            isLoading={isSubmitting}
            className="mt-4"
          />
        </section>

        {/* Global submit button */}
        <div className="flex justify-end pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
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
              'Submit Onboarding'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


