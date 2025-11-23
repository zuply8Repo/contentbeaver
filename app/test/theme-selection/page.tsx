"use client";

import { useState } from "react";
import ThemeSelectionInput from "../../ui/input/theme-selection";
import { Theme, ThemeSelection as ThemeSelectionData } from "../../ui/input/types";

export default function ThemeSelectionTestPage() {
  const [selectedTheme, setSelectedTheme] = useState<ThemeSelectionData | null>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [themeSetIndex, setThemeSetIndex] = useState(0);

  // Multiple sets of themes for regeneration
  const themeSets: Theme[][] = [
    // Set 1: Original themes
    [
      {
        id: "christmas",
        title: "Christmas",
        description: "Festive holiday content with seasonal messaging, warm colors, and gift-focused promotions. Perfect for December campaigns and holiday shopping.",
      },
      {
        id: "new-product-launch",
        title: "New Product Launch",
        description: "Exciting announcement content highlighting new features, benefits, and innovation. Ideal for building anticipation and driving early adoption.",
      },
      {
        id: "black-week",
        title: "Black Week",
        description: "High-energy promotional content with special offers, discounts, and limited-time deals. Designed to drive urgency and maximize sales during the shopping event.",
      },
    ],
    // Set 2: Alternative themes
    [
      {
        id: "summer-sale",
        title: "Summer Sale",
        description: "Bright and energetic content perfect for summer campaigns. Focus on seasonal products, vacation vibes, and warm-weather promotions.",
      },
      {
        id: "back-to-school",
        title: "Back to School",
        description: "Educational and motivational content targeting students and parents. Ideal for August-September campaigns with focus on preparation and learning.",
      },
      {
        id: "valentines-day",
        title: "Valentine's Day",
        description: "Romantic and heartfelt content with love-themed messaging. Perfect for February campaigns focusing on gifts, relationships, and emotional connections.",
      },
    ],
    // Set 3: More alternative themes
    [
      {
        id: "spring-collection",
        title: "Spring Collection",
        description: "Fresh and vibrant content celebrating new beginnings. Ideal for March-May campaigns with focus on renewal, growth, and seasonal products.",
      },
      {
        id: "anniversary-celebration",
        title: "Anniversary Celebration",
        description: "Milestone-focused content celebrating achievements and milestones. Perfect for commemorating company anniversaries or product milestones.",
      },
      {
        id: "flash-sale",
        title: "Flash Sale",
        description: "Urgent and time-sensitive promotional content. Designed to create immediate action with limited-time offers and exclusive deals.",
      },
    ],
  ];

  const currentThemes = themeSets[themeSetIndex];

  const handleThemeSelect = (themeId: string | null) => {
    if (themeId) {
      const theme = currentThemes.find((t) => t.id === themeId);
      if (theme) {
        setSelectedTheme({ selectedThemeId: themeId });
        console.log("🎨 Theme Selected:", theme);
      }
    } else {
      setSelectedTheme(null);
      console.log("🎨 Theme Deselected");
    }
  };

  const handleRegenerate = () => {
    // Cycle to the next theme set
    const nextIndex = (themeSetIndex + 1) % themeSets.length;
    setThemeSetIndex(nextIndex);
    // Clear selection when regenerating
    setSelectedTheme(null);
    console.log("🔄 Themes Regenerated - New theme set:", nextIndex + 1);
  };

  const handleSave = (data: Partial<ThemeSelectionData>) => {
    console.log("💾 Auto-saved theme selection:", data);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const selectedThemeData = selectedTheme?.selectedThemeId
    ? currentThemes.find((t) => t.id === selectedTheme.selectedThemeId)
    : null;

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen bg-linear-to-br from-zinc-50 via-white to-zinc-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 transition-colors duration-300">
        {/* Header */}
        <header className="border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  Theme Selection
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Test page for the ThemeSelection component - Social Media Posting Themes
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
                    Select Social Media Posting Theme
                  </h2>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    Choose a theme that will structure your social media content
                    and define the posting rhythm.
                  </p>
                </div>

                <ThemeSelectionInput
                  themes={currentThemes}
                  onSelect={handleThemeSelect}
                  onSave={handleSave}
                  onRegenerate={handleRegenerate}
                  initialData={selectedTheme || undefined}
                  isLoading={false}
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
                    <span>Select one theme from the three available options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>
                      Each theme represents a different social media posting
                      strategy
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>
                      Click a checkbox to select a theme (only one can be
                      selected)
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                      •
                    </span>
                    <span>Form auto-saves as you make selections (check console)</span>
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
                    <span>Single selection behavior</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Visual feedback for selected theme</span>
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
                  <div className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Accessibility features</span>
                  </div>
                </div>
              </div>

              {/* Themes Info Card */}
              <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-indigo-200 dark:border-indigo-900 p-6">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
                  🎨 Available Themes
                </h3>
                <div className="space-y-3 text-sm">
                  {currentThemes.map((theme) => (
                    <div
                      key={theme.id}
                      className="p-3 rounded-lg bg-white dark:bg-zinc-800/50 border border-indigo-200 dark:border-indigo-800"
                    >
                      <div className="font-semibold text-indigo-700 dark:text-indigo-300 mb-1">
                        {theme.title}
                      </div>
                      <div className="text-xs text-zinc-600 dark:text-zinc-400">
                        {theme.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Selected Theme Display */}
          {selectedThemeData && (
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
                  Selected Theme
                </h3>
              </div>

              <div className="p-6 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border-2 border-indigo-200 dark:border-indigo-800">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-2xl font-bold text-indigo-700 dark:text-indigo-300">
                    {selectedThemeData.title}
                  </h4>
                  <span className="px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-200 dark:border-indigo-800">
                    Active
                  </span>
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
                  {selectedThemeData.description}
                </p>
                <div className="mt-4 pt-4 border-t border-indigo-200 dark:border-indigo-800">
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    💡 This theme will structure your social media content
                    generation and posting rhythm.
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
              Theme Selection Test Page • Built with Next.js 16 & Tailwind CSS
              4
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

