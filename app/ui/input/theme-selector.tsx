"use client";

import { useState, useEffect } from "react";
import { ThemeOption, ThemeSelectorProps } from "./types";

export default function ThemeSelector({
  onSubmit,
  onThemeSelect,
  initialSelection = null,
  isLoading = false,
  className = "",
}: ThemeSelectorProps) {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(
    initialSelection
  );
  const [selectedThemeData, setSelectedThemeData] =
    useState<ThemeOption | null>(null);
  const [themes, setThemes] = useState<ThemeOption[]>([]);
  const [isLoadingThemes, setIsLoadingThemes] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch themes when component mounts
  useEffect(() => {
    fetchThemes();
  }, []);

  const fetchThemes = async () => {
    setIsLoadingThemes(true);
    setError(null);

    try {
      const response = await fetch("/api/theme-selection");
      const result = await response.json();

      if (result.success && result.data) {
        setThemes(result.data.themes);
        if (result.data.selectedTheme) {
          setSelectedTheme(result.data.selectedTheme);
        }
      } else {
        setError(result.error?.message || "Failed to load themes");
      }
    } catch (err) {
      console.error("Error fetching themes:", err);
      setError("Failed to load themes. Please try again.");
    } finally {
      setIsLoadingThemes(false);
    }
  };

  const handleThemeClick = (theme: ThemeOption) => {
    if (isLoading || isLoadingThemes) return;

    console.log("🎨 [ThemeSelector] Theme selected:", {
      themeId: theme.id,
      columnName: theme.columnName,
      text: theme.text,
    });

    setSelectedTheme(theme.columnName);
    setSelectedThemeData(theme);

    if (onThemeSelect) {
      onThemeSelect(theme);
    }
  };

  const handleSubmit = () => {
    if (!selectedTheme || !selectedThemeData || isLoading) return;

    console.log("✅ [ThemeSelector] Submitting theme:", {
      selectedTheme,
      themeData: selectedThemeData,
    });

    if (onSubmit) {
      onSubmit(selectedTheme, selectedThemeData);
    }
  };

  const isDisabled = isLoading || isLoadingThemes;

  return (
    <div className={`w-full max-w-4xl mx-auto ${className}`}>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Choose Your Theme
        </h2>
        <p className="text-gray-600">
          Select the theme that best represents your brand
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={fetchThemes}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Try again
          </button>
        </div>
      )}

      {/* Loading State */}
      {isLoadingThemes && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="ml-4 text-gray-600">Loading themes...</p>
        </div>
      )}

      {/* Theme Options */}
      {!isLoadingThemes && !error && themes.length > 0 && (
        <div className="space-y-4 mb-8">
          {themes.map((theme) => {
            const isSelected = selectedTheme === theme.columnName;

            return (
              <button
                key={theme.columnName}
                onClick={() => handleThemeClick(theme)}
                disabled={isDisabled}
                className={`
                  w-full p-6 rounded-xl border-2 text-left transition-all duration-200
                  ${
                    isSelected
                      ? "border-indigo-600 bg-indigo-50 shadow-md"
                      : "border-gray-200 bg-white hover:border-indigo-300 hover:shadow-sm"
                  }
                  ${
                    isDisabled
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                `}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Radio indicator */}
                      <div
                        className={`
                          w-5 h-5 rounded-full border-2 flex items-center justify-center
                          ${
                            isSelected
                              ? "border-indigo-600 bg-indigo-600"
                              : "border-gray-300 bg-white"
                          }
                        `}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>

                      <h3
                        className={`text-lg font-semibold ${
                          isSelected ? "text-indigo-900" : "text-gray-900"
                        }`}
                      >
                        {theme.columnName.charAt(0).toUpperCase() +
                          theme.columnName.slice(1)}
                      </h3>
                    </div>

                    <p
                      className={`text-sm ml-8 ${
                        isSelected ? "text-indigo-700" : "text-gray-600"
                      }`}
                    >
                      {theme.text}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!isLoadingThemes && !error && themes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No themes available</p>
        </div>
      )}

      {/* Submit Button */}
      {themes.length > 0 && (
        <div className="flex justify-end gap-4">
          <button
            onClick={handleSubmit}
            disabled={!selectedTheme || isDisabled}
            className={`
              px-8 py-3 rounded-lg font-semibold text-white transition-all duration-200
              ${
                !selectedTheme || isDisabled
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl"
              }
            `}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Saving...
              </span>
            ) : (
              "Confirm Selection"
            )}
          </button>
        </div>
      )}
    </div>
  );
}
