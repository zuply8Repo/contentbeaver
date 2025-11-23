"use client";

import { useState } from "react";
import SocialMediaInput from "../../ui/input/social-media-input";
import { SocialMediaInfo } from "../../ui/input/types";
import { ApiResponse, SaveSocialMediaInfoResponse } from "@/app/lib/types/api";

export default function SocialMediaTestPage() {
  const [submittedData, setSubmittedData] = useState<SocialMediaInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [apiResponse, setApiResponse] =
    useState<SaveSocialMediaInfoResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Sample initial data for testing
  const sampleData: SocialMediaInfo = {
    platforms: [
      {
        platform: "Instagram",
        postsPerWeek: 5,
        postingType: "Reel",
        imageFormat: {
          aspectRatio: "1:1",
          minWidth: 1080,
          minHeight: 1080,
          maxWidth: 1080,
          maxHeight: 1080,
          fileTypes: ["JPG", "PNG"],
          label: "Square (1:1) - 1080x1080px",
        },
      },
      {
        platform: "LinkedIn",
        postsPerWeek: 3,
        postingType: "Image Post",
        imageFormat: {
          aspectRatio: "16:9",
          minWidth: 1200,
          minHeight: 675,
          maxWidth: 1200,
          maxHeight: 675,
          fileTypes: ["JPG", "PNG"],
          label: "Landscape (16:9) - 1200x675px",
        },
      },
    ],
  };

  const handleSubmit = async (data: SocialMediaInfo) => {
    console.log("📱 Social Media Configuration Submitted:", data);
    setIsLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      // Call the API endpoint
      const response = await fetch("/api/social-media", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ socialMediaInfo: data }),
      });

      const result: ApiResponse<SaveSocialMediaInfoResponse> =
        await response.json();

      if (result.success && result.data) {
        // Success - show the submitted data and API response
        setSubmittedData(data);
        setApiResponse(result.data);
        console.log("✅ API Response:", result);
        alert(
          `Social media configuration saved successfully!\n\nID: ${result.data.id}\n\nCheck the console and display below for details.`
        );
      } else {
        // Error from API
        const errorMessage = result.error?.message || "Unknown error occurred";
        setError(errorMessage);
        console.error("❌ API Error:", result.error);
        alert(`Error: ${errorMessage}`);
      }
    } catch (err) {
      // Network or other error
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect to server";
      setError(errorMessage);
      console.error("❌ Network Error:", err);
      alert(`Network Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = (data: Partial<SocialMediaInfo>) => {
    console.log("💾 Auto-saved data:", data);
  };

  const handleLoadSample = () => {
    // Reset to trigger re-render with sample data
    setSubmittedData(null);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-300">
        {/* Header */}
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Social Media Configuration
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Test page for the SocialMediaInput component
                </p>
              </div>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-150"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  <svg
                    className="w-5 h-5 text-yellow-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-5 h-5 text-zinc-700"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8">
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                    Configure Social Media Settings
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Define your posting rhythm and image format requirements for
                    each platform.
                  </p>
                </div>

                <SocialMediaInput
                  onSubmit={handleSubmit}
                  onSave={handleSave}
                  initialData={sampleData}
                  isLoading={isLoading}
                />
              </div>
            </div>

            {/* Info Panel */}
            <div className="lg:col-span-1 space-y-6">
              {/* Instructions Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  💡 Instructions
                </h3>
                <ul className="space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>Select at least one platform (Instagram or LinkedIn)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>
                      Configure posts per week for each selected platform (1-50)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>Select posting type for each platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>Select image format for each platform</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>Form auto-saves as you type (check console)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>Toggle dark mode to test both themes</span>
                  </li>
                </ul>
              </div>

              {/* Features Card */}
              <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  ✨ Features
                </h3>
                <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Multi-platform support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Platform-specific image formats</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Real-time validation</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Auto-save functionality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Dark mode support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Responsive design</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Smooth animations</span>
                  </div>
                </div>
              </div>

              {/* Actions Card */}
              <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-indigo-200 dark:border-indigo-900 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  🔧 Test Actions
                </h3>
                <button
                  onClick={handleLoadSample}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-150 border border-zinc-200 dark:border-zinc-700"
                >
                  Reload Sample Data
                </button>
                <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2">
                  The form is pre-filled with sample data for easy testing
                </p>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mt-8 bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-xl shadow-red-200/50 dark:shadow-red-950/50 border-2 border-red-200 dark:border-red-800 p-6">
              <div className="flex items-center gap-2 mb-2">
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-red-700 dark:text-red-300">
                  Submission Failed
                </h3>
              </div>
              <p className="text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Submitted Data Display */}
          {submittedData && !error && (
            <div className="mt-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-8">
              <div className="flex items-center gap-2 mb-4">
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                  Submitted Social Media Configuration
                </h3>
              </div>

              {/* API Response Info */}
              {apiResponse && (
                <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                    🎉 Successfully Saved to Database (Mock)
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        ID:
                      </span>
                      <p className="text-green-700 dark:text-green-300 font-mono text-xs mt-1 break-all">
                        {apiResponse.id}
                      </p>
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Created:
                      </span>
                      <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                        {new Date(apiResponse.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <span className="text-green-600 dark:text-green-400 font-medium">
                        Updated:
                      </span>
                      <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                        {new Date(apiResponse.updatedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-2">
                    Platform Configurations
                  </h4>
                  <div className="space-y-4">
                    {submittedData.platforms.map((platform, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-semibold text-zinc-900 dark:text-zinc-100">
                            {platform.platform}
                          </h5>
                          <span className="text-sm text-zinc-600 dark:text-zinc-400">
                            {platform.postsPerWeek} posts/week
                          </span>
                        </div>
                        <div className="space-y-1 text-sm text-zinc-600 dark:text-zinc-400">
                          <div>
                            <span className="font-medium">Posting Type:</span>{" "}
                            {platform.postingType}
                          </div>
                          <div>
                            <span className="font-medium">Image Format:</span>{" "}
                            {platform.imageFormat.label}
                          </div>
                          <div>
                            <span className="font-medium">Aspect Ratio:</span>{" "}
                            {platform.imageFormat.aspectRatio}
                          </div>
                          <div>
                            <span className="font-medium">Dimensions:</span>{" "}
                            {platform.imageFormat.minWidth}x
                            {platform.imageFormat.minHeight}px
                          </div>
                          <div>
                            <span className="font-medium">File Types:</span>{" "}
                            {platform.imageFormat.fileTypes.join(", ")}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    💡 Check the browser console for detailed data output
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Social Media Configuration Test Page • Built with Next.js 16 &
              Tailwind CSS 4
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

