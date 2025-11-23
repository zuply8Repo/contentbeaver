"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import ProductCard from "@/app/ui/product-card";
import { Linkedin, Instagram, Check } from "lucide-react";

type Platform = "linkedin" | "instagram";

export default function SMConfigPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");

  const [selectedPlatforms, setSelectedPlatforms] = useState<Set<Platform>>(
    new Set()
  );
  const [postCount, setPostCount] = useState<number>(5);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Redirect if no product ID
  useEffect(() => {
    if (!productId) {
      router.push("/product-dashboard");
    }
  }, [productId, router]);

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(platform)) {
        newSet.delete(platform);
      } else {
        newSet.add(platform);
      }
      return newSet;
    });
  };

  const handleGenerate = async () => {
    if (selectedPlatforms.size === 0) {
      alert("Please select at least one platform");
      return;
    }

    if (postCount < 1 || postCount > 20) {
      alert("Please enter a number between 1 and 20");
      return;
    }

    setIsGenerating(true);
    setShowSuccess(false);

    // Simulate API call with dummy data
    await new Promise((resolve) => setTimeout(resolve, 3000));

    setIsGenerating(false);
    setShowSuccess(true);

    // Hide success message after 5 seconds
    setTimeout(() => setShowSuccess(false), 5000);
  };

  if (!productId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/product-dashboard")}
          className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors mb-6"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Page Title */}
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-8">
          Social Media Configuration
        </h1>

        {/* Product Card */}
        <div className="mb-8">
          <ProductCard productId={productId} />
        </div>

        {/* Configuration Form */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
          {/* Platform Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              Select Platforms
            </label>
            <div className="flex gap-6">
              {/* LinkedIn Button - circular icon with check badge */}
              <button
                type="button"
                onClick={() => togglePlatform("linkedin")}
                className={`group relative flex flex-col items-center gap-2 focus:outline-none ${
                  selectedPlatforms.has("linkedin") ? "" : ""
                }`}
              >
                <div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all shadow-sm ${
                    selectedPlatforms.has("linkedin")
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 ring-2 ring-blue-500/30"
                      : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <Linkedin
                    className={`w-7 h-7 transition-colors ${
                      selectedPlatforms.has("linkedin")
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                    }`}
                  />

                  {/* Check indicator */}
                  <div
                    className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] transition-all ${
                      selectedPlatforms.has("linkedin")
                        ? "bg-blue-500 text-white shadow-md"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {selectedPlatforms.has("linkedin") && (
                      <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium ${
                    selectedPlatforms.has("linkedin")
                      ? "text-blue-900 dark:text-blue-100"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  LinkedIn
                </span>
              </button>

              {/* Instagram Button - circular icon with check badge */}
              <button
                type="button"
                onClick={() => togglePlatform("instagram")}
                className="group relative flex flex-col items-center gap-2 focus:outline-none"
              >
                <div
                  className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all shadow-sm ${
                    selectedPlatforms.has("instagram")
                      ? "border-pink-500 bg-pink-50 dark:bg-pink-950/40 ring-2 ring-pink-500/30"
                      : "border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                  }`}
                >
                  <Instagram
                    className={`w-7 h-7 transition-colors ${
                      selectedPlatforms.has("instagram")
                        ? "text-pink-600 dark:text-pink-400"
                        : "text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"
                    }`}
                  />

                  {/* Check indicator */}
                  <div
                    className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] transition-all ${
                      selectedPlatforms.has("instagram")
                        ? "bg-pink-500 text-white shadow-md"
                        : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400"
                    }`}
                  >
                    {selectedPlatforms.has("instagram") && (
                      <Check className="w-3 h-3" />
                    )}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium ${
                    selectedPlatforms.has("instagram")
                      ? "text-pink-900 dark:text-pink-100"
                      : "text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  Instagram
                </span>
              </button>
            </div>
            {selectedPlatforms.size > 0 && (
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-3">
                Selected: {Array.from(selectedPlatforms).join(", ")}
              </p>
            )}
          </div>

          {/* Post Count Input */}
          <div className="mb-8">
            <label
              htmlFor="postCount"
              className="block text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-3"
            >
              How many posts to generate?
            </label>
            <input
              type="number"
              id="postCount"
              min="1"
              max="20"
              value={postCount}
              onChange={(e) => setPostCount(parseInt(e.target.value) || 1)}
              className="w-full max-w-xs px-4 py-3 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              placeholder="5"
            />
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              Enter a number between 1 and 20
            </p>
          </div>

          {/* Generate Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating || selectedPlatforms.size === 0}
              className="px-8 py-3 rounded-lg bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Posts"
              )}
            </button>

            {showSuccess && (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 animate-fade-in">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-sm font-medium">
                  Posts generated successfully! (Dummy data)
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
