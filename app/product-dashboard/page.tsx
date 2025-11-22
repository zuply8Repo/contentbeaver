"use client";

import { useState } from "react";
import ProductSpecInput from "@/app/ui/input/product-spec-input";
import { ProductSpec } from "@/app/ui/input/types";
import ProductThumbnailsSummary from "@/app/ui/product-thumbnails-summary";

export default function ProductDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Temporary mock products to preview the thumbnails section
  const mockProducts: { id: string; imageUrl?: string; alt?: string }[] = [
    {
      id: "product-1",
      imageUrl: "/window.svg",
      alt: "Travel bag product thumbnail",
    },
    {
      id: "product-2",
      // No imageUrl here on purpose to showcase the emoji placeholder state
      alt: "Product without image thumbnail",
    },
  ];

  const handleSubmit = async (data: ProductSpec) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/product-specs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ productSpec: data }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error?.message || "Failed to save product specification"
        );
      }

      // Show success message
      setShowSuccess(true);

      // Reset form state after delay
      setTimeout(() => {
        setShowForm(false);
        setShowSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error submitting product spec:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-white dark:bg-zinc-900 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header with back button */}
          <div className="mb-8">
            <button
              onClick={() => setShowForm(false)}
              className="inline-flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors duration-150 mb-4"
              disabled={isSubmitting}
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
              <span className="text-sm font-medium">Back to Dashboard</span>
            </button>
            <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100">
              Create Product Specification
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mt-2">
              Fill in the details to add your first product
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300">
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {showSuccess && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 flex items-center gap-2 animate-fadeIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">
                Product specification saved successfully!
              </span>
            </div>
          )}

          {/* Form */}
          <ProductSpecInput onSubmit={handleSubmit} isLoading={isSubmitting} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Product Dashboard
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Manage your product specifications
          </p>
        </div>

        {/* Product thumbnails preview section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Your Products Preview
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Here&apos;s a quick preview of how your products will appear as
                thumbnails.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 px-4 py-3">
            <ProductThumbnailsSummary products={mockProducts} />
          </div>
        </section>

        {/* Empty State Card */}

        {/* Optional: Help text */}
        <div className="text-center mt-8">
          <p className="text-sm text-zinc-500 dark:text-zinc-500">
            Create detailed product specifications to showcase your products
          </p>
        </div>
      </div>
    </div>
  );
}
