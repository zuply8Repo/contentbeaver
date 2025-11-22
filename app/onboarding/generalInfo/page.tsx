"use client";

import { useRouter } from "next/navigation";

export default function GeneralInfoPage() {
  const router = useRouter();

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
            General Information
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Welcome to the onboarding process! This page will collect your general business information.
          </p>
        </div>

        {/* Placeholder content */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <svg
                className="w-6 h-6 text-indigo-600 dark:text-indigo-400 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm text-indigo-700 dark:text-indigo-300">
                This is a placeholder page. You can integrate your existing onboarding components here, such as CompanyInfoInput, BrandingInput, etc.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Step 1: Company Info
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Collect basic company information, mission, and vision.
                </p>
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Step 2: Branding
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Define your brand colors, mood, and visual identity.
                </p>
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Step 3: Product Specs
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Add your product specifications and details.
                </p>
              </div>

              <div className="p-6 bg-zinc-50 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Step 4: Final Setup
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Review and complete your business setup.
                </p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-zinc-200 dark:border-zinc-800">
              <button
                onClick={() => router.push("/welcome")}
                className="px-6 py-3 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg font-medium hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors"
              >
                Back to Welcome
              </button>
              <button
                onClick={() => router.push("/test/onboarding")}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-indigo-500/50"
              >
                View Full Onboarding Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

