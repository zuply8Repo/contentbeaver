"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ThemeSelector from "@/app/ui/input/theme-selector";

export default function ThemeSelectionPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleThemeSubmit = async (
    selectedTheme: string,
    themeData: { id: string; text: string; columnName: string }
  ) => {
    setIsSubmitting(true);
    setError(null);

    console.log("📤 [ThemeSelectionPage] Submitting to API:", {
      selectedTheme,
      themeId: themeData.id,
      themeText: themeData.text,
      columnName: themeData.columnName,
    });

    try {
      // Submit theme selection to API with theme ID
      const response = await fetch("/api/theme-selection", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          selectedTheme,
          themeId: themeData.id,
        }),
      });

      console.log(
        "📥 [ThemeSelectionPage] API response status:",
        response.status
      );

      const result = await response.json();

      console.log("📥 [ThemeSelectionPage] API response:", result);

      if (result.success) {
        // Show success state
        setShowSuccess(true);

        // Optional: Redirect after a delay
        // setTimeout(() => {
        //   router.push('/next-step');
        // }, 2000);
      } else {
        setError(result.error?.message || "Failed to save theme selection");
        setIsSubmitting(false);
      }
    } catch (err) {
      console.error("Error submitting theme:", err);
      setError("An unexpected error occurred. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Loading Overlay */}
      {isSubmitting && !showSuccess && (
        <div className="fixed inset-0 bg-white bg-opacity-95 flex items-center justify-center z-50">
          <div className="text-center">
            <div className="relative">
              {/* Animated spinner */}
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-indigo-200 border-t-indigo-600 mx-auto"></div>

              {/* Pulsing background */}
              <div className="absolute inset-0 rounded-full bg-indigo-100 animate-ping opacity-20"></div>
            </div>

            <h2 className="mt-6 text-2xl font-bold text-gray-900">
              Saving Your Selection
            </h2>
            <p className="mt-2 text-gray-600">
              Please wait while we process your theme choice...
            </p>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-4">
              <div
                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="text-center max-w-md px-6">
            {/* Success checkmark */}
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-3xl font-bold text-gray-900 mb-3">
              Theme Saved Successfully!
            </h2>
            <p className="text-gray-600 mb-6">
              Your theme selection has been saved. You're all set!
            </p>

            {/* Optional: Next action button */}
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg transition-colors duration-200"
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="fixed top-4 right-4 max-w-md bg-red-50 border-l-4 border-red-500 p-4 rounded shadow-lg z-40">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto flex-shrink-0 text-red-500 hover:text-red-700"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <ThemeSelector
          onSubmit={handleThemeSubmit}
          isLoading={isSubmitting}
          className="animate-fade-in"
        />
      </div>
    </div>
  );
}
