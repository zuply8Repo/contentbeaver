"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ImageUpload from "@/app/ui/input/image-upload";
import {
  ApiResponse,
  UploadImageResponse,
  ImageFile,
} from "@/app/lib/types/api";

export default function ImageUploadTestPage() {
  const router = useRouter();
  const [basicImage, setBasicImage] = useState<ImageFile | null>(null);
  const [productDescription, setProductDescription] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleSave = async () => {
    if (!basicImage || !productDescription.trim()) {
      alert("Please upload an image and enter a description");
      return;
    }

    setIsSaving(true);
    setSuccessMessage("");

    try {
      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append("file", basicImage.file);
      formData.append("description", productDescription);

      // Send to API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result: ApiResponse<UploadImageResponse> = await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.data ||
        !result.data.upload?.id
      ) {
        throw new Error(result.error?.message || "Upload failed");
      }

      const uploadId = result.data.upload.id;

      // Optional: keep success message for debugging
      setSuccessMessage(
        `Image uploaded successfully! Redirecting to config for ID: ${uploadId}`
      );
      console.log("Upload successful:", result.data);

      // Redirect to SM Config page for the newly created product
      router.push(`/sm-config?id=${uploadId}`);
    } catch (error) {
      console.error("Upload error:", error);
      alert(
        `Upload failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/product-dashboard")}
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
            Image Upload Component Test
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Test the image upload component with different configurations.
          </p>
        </div>

        {/* Test Sections */}
        <div className="space-y-8">
          {/* Basic Image Upload */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Basic Image Upload
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Upload a single image. The component will replace the previous
                image if one is already uploaded.
              </p>
            </div>
            <ImageUpload
              label="Upload Image"
              onChange={(image: ImageFile | null) => {
                setBasicImage(image);
                console.log("Image changed:", image);
              }}
            />
          </div>

          {/* Product Description */}
          <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
                Product Description
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                Enter a product description to generate content.
              </p>
            </div>
            <div className="group">
              <label
                htmlFor="productDescription"
                className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 transition-colors group-focus-within:text-indigo-600 dark:group-focus-within:text-indigo-400"
              >
                Product Description
              </label>
              <textarea
                id="productDescription"
                value={productDescription}
                onChange={(e) => setProductDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 dark:placeholder-zinc-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-y"
                placeholder="Enter product description..."
                disabled={isSaving}
              />
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={
                    isSaving || !productDescription.trim() || !basicImage
                  }
                  className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSaving ? (
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
                      Saving...
                    </span>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
              {successMessage && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                  <p className="text-sm text-green-800 dark:text-green-200 break-all">
                    {successMessage}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
        </div>
      </div>
    </div>
  );
}
