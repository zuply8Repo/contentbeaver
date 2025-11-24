"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoadingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [timeElapsed, setTimeElapsed] = useState(0);
  const [hasTimedOut, setHasTimedOut] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);

  // Timeout duration in seconds (2 minutes = 120 seconds)
  const TIMEOUT_DURATION = 120;

  useEffect(() => {
    // Redirect if no product ID
    if (!productId) {
      router.push("/product-dashboard");
      return;
    }

    // Timer to track elapsed time
    const timer = setInterval(() => {
      setTimeElapsed((prev) => {
        const newTime = prev + 1;
        if (newTime >= TIMEOUT_DURATION) {
          setHasTimedOut(true);
          clearInterval(timer);
        }
        return newTime;
      });
    }, 1000);

    // TODO: Set up webhook listener or polling mechanism to receive signal from n8n
    // When signal is received, navigate to results page or dashboard
    // Example:
    // const checkStatus = async () => {
    //   const response = await fetch(`/api/posts/status?productId=${productId}`);
    //   const data = await response.json();
    //   if (data.ready) {
    //     router.push(`/posts?productId=${productId}`);
    //   }
    // };
    // const statusChecker = setInterval(checkStatus, 5000);

    return () => {
      clearInterval(timer);
      // clearInterval(statusChecker); // Uncomment when implementing polling
    };
  }, [productId, router]);

  const handleCancel = () => {
    setIsCancelled(true);
    // TODO: Make API call to cancel the generation process
    // await fetch('/api/posts/cancel', { method: 'POST', body: JSON.stringify({ productId }) });
    setTimeout(() => {
      router.push(`/sm-config?id=${productId}`);
    }, 500);
  };

  const handleRetry = () => {
    router.push(`/sm-config?id=${productId}`);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  if (isCancelled) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-orange-100 dark:bg-orange-950/40 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-orange-600 dark:text-orange-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Generation Cancelled
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400">
              Redirecting you back...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (hasTimedOut) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-lg">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-950/40 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-600 dark:text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Generation Timeout
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              The post generation is taking longer than expected. Your request
              may still be processing in the background.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
              >
                Try Again
              </button>
              <button
                onClick={() => router.push("/product-dashboard")}
                className="px-6 py-3 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-all duration-150"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-lg">
          {/* Animated gradient spinner */}
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 opacity-20 animate-pulse"></div>
            <div className="absolute inset-2 rounded-full bg-white dark:bg-zinc-900"></div>
            <svg
              className="absolute inset-0 w-24 h-24 animate-spin"
              viewBox="0 0 100 100"
              fill="none"
            >
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="url(#gradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="220"
                strokeDashoffset="60"
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#9333EA" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Generating Your Posts
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6">
            Our AI is crafting engaging content for your social media. This may
            take a few moments...
          </p>

          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 mb-2">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>Time elapsed: {formatTime(timeElapsed)}</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-1000 ease-out"
                style={{
                  width: `${Math.min(
                    (timeElapsed / TIMEOUT_DURATION) * 100,
                    95
                  )}%`,
                }}
              ></div>
            </div>
          </div>

          {/* Status messages */}
          <div className="mb-6 text-sm text-zinc-600 dark:text-zinc-400 space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span>Analyzing your product information</span>
            </div>
            {timeElapsed > 15 && (
              <div className="flex items-center justify-center gap-2 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                <span>Crafting engaging content</span>
              </div>
            )}
            {timeElapsed > 30 && (
              <div className="flex items-center justify-center gap-2 animate-fade-in">
                <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse"></div>
                <span>Optimizing for selected platforms</span>
              </div>
            )}
          </div>

          {/* Cancel button */}
          <button
            onClick={handleCancel}
            className="px-6 py-2 rounded-lg border-2 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 text-sm font-medium hover:border-zinc-300 dark:hover:border-zinc-600 hover:text-zinc-900 dark:hover:text-zinc-200 transition-all duration-150"
          >
            Cancel Generation
          </button>
        </div>

        {/* Info box */}
        <div className="mt-6 p-4 rounded-xl bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> Large batch requests may take up to 2
            minutes. You&apos;ll be notified once your posts are ready.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoadingPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        </div>
      }
    >
      <LoadingContent />
    </Suspense>
  );
}

