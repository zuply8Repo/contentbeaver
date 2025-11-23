"use client";

import { useState } from "react";
import ImageSelectionInput from "../../ui/input/image-selection";
import { ImagePost, ImageSelection as ImageSelectionData } from "../../ui/input/types";

export default function ImageSelectionTestPage() {
  const [confirmedImages, setConfirmedImages] = useState<ImagePost[] | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [imageSetIndex, setImageSetIndex] = useState(0);

  // Multiple sets of images for regeneration (captions stay the same)
  const imageSets: ImagePost[][] = [
    // Set 1: Original images
    [
      {
        id: "1",
        imageUrl: "https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=1080&h=1080&fit=crop",
        caption: "🎄 Celebrate the holiday season with our special collection! Limited time offers on festive favorites. #HolidayShopping #SpecialOffers",
      },
      {
        id: "2",
        imageUrl: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1080&h=1080&fit=crop",
        caption: "✨ Introducing our latest innovation! Experience the future of technology with cutting-edge features designed for you. #NewProduct #Innovation",
      },
      {
        id: "3",
        imageUrl: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1080&h=1080&fit=crop",
        caption: "🔥 Black Week is here! Don't miss out on exclusive deals and massive savings. Shop now before it's too late! #BlackWeek #Sale",
      },
    ],
    // Set 2: Alternative images (same captions)
    [
      {
        id: "1",
        imageUrl: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=1080&h=1080&fit=crop",
        caption: "🎄 Celebrate the holiday season with our special collection! Limited time offers on festive favorites. #HolidayShopping #SpecialOffers",
      },
      {
        id: "2",
        imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1080&h=1080&fit=crop",
        caption: "✨ Introducing our latest innovation! Experience the future of technology with cutting-edge features designed for you. #NewProduct #Innovation",
      },
      {
        id: "3",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1080&h=1080&fit=crop",
        caption: "🔥 Black Week is here! Don't miss out on exclusive deals and massive savings. Shop now before it's too late! #BlackWeek #Sale",
      },
    ],
    // Set 3: More alternative images (same captions)
    [
      {
        id: "1",
        imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1080&h=1080&fit=crop",
        caption: "🎄 Celebrate the holiday season with our special collection! Limited time offers on festive favorites. #HolidayShopping #SpecialOffers",
      },
      {
        id: "2",
        imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1080&h=1080&fit=crop",
        caption: "✨ Introducing our latest innovation! Experience the future of technology with cutting-edge features designed for you. #NewProduct #Innovation",
      },
      {
        id: "3",
        imageUrl: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1080&h=1080&fit=crop",
        caption: "🔥 Black Week is here! Don't miss out on exclusive deals and massive savings. Shop now before it's too late! #BlackWeek #Sale",
      },
    ],
  ];

  const currentImages = imageSets[imageSetIndex];

  const handleConfirm = (images: ImagePost[]) => {
    setConfirmedImages(images);
    console.log("✅ Images Confirmed:", images);
  };

  const handleRegenerate = () => {
    setIsRegenerating(true);
    console.log("🔄 Regenerating images...");
    
    // Simulate API call delay
    setTimeout(() => {
      // Cycle to the next image set (captions stay the same)
      const nextIndex = (imageSetIndex + 1) % imageSets.length;
      setImageSetIndex(nextIndex);
      setIsRegenerating(false);
      console.log("✅ Images Regenerated - New image set:", nextIndex + 1);
    }, 1500);
  };

  const handleSave = (data: Partial<ImageSelectionData>) => {
    console.log("💾 Auto-saved image selection:", data);
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
                  Image Selection
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Test page for the ImageSelectionInput component - Review and confirm social media images
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
                    Review Social Media Images
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Review the three images and their captions. Confirm to proceed or regenerate to get new images (captions will remain the same).
                  </p>
                </div>

                <ImageSelectionInput
                  images={currentImages}
                  onConfirm={handleConfirm}
                  onRegenerate={handleRegenerate}
                  onSave={handleSave}
                  isLoading={false}
                  isRegenerating={isRegenerating}
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
                    <span>Review the three images and their associated captions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>
                      Click "Confirm Images" to accept the current set
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>
                      Click "Regenerate Images" to get new images (captions stay the same)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>Form auto-saves as you interact (check console)</span>
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
                    <span>Three image display with captions</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Image regeneration (captions preserved)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Responsive grid layout</span>
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
                    <span>Error handling for failed images</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Loading states</span>
                  </div>
                </div>
              </div>

              {/* Key Behavior Card */}
              <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-indigo-200 dark:border-indigo-900 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  🔑 Key Behavior
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-indigo-200 dark:border-indigo-800">
                    <div className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                      Regeneration
                    </div>
                    <div className="text-xs text-zinc-600 dark:text-zinc-400">
                      When you regenerate, only the images change. The captions remain exactly the same, ensuring consistent messaging across different visual options.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Confirmed Images Display */}
          {confirmedImages && (
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
                  Confirmed Images
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {confirmedImages.map((image, index) => (
                  <div
                    key={image.id}
                    className="bg-zinc-50 dark:bg-zinc-800 rounded-lg border-2 border-green-200 dark:border-green-800 overflow-hidden"
                  >
                    <div className="relative aspect-square bg-zinc-200 dark:bg-zinc-700">
                      <img
                        src={image.imageUrl}
                        alt={`Confirmed image ${index + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        Confirmed
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="mb-2">
                        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                          Caption
                        </span>
                      </div>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-wrap">
                        {image.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Image Selection Test Page • Built with Next.js 16 & Tailwind CSS
              4
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

