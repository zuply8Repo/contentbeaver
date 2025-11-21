"use client";

import { useState } from "react";
import CompanyInfoInput from "../../ui/input/company-info-input";
import BrandingInput from "../../ui/input/branding-input";
import { CompanyInfo, BrandingInfo } from "../../ui/input/types";
import { ApiResponse, SaveCompanyInfoResponse, SaveBrandingInfoResponse } from "@/app/lib/types/api";

export default function OnboardingTestPage() {
  const [companyData, setCompanyData] = useState<CompanyInfo | null>(null);
  const [brandingData, setBrandingData] = useState<BrandingInfo | null>(null);
  const [companyLoading, setCompanyLoading] = useState(false);
  const [brandingLoading, setBrandingLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [companyApiResponse, setCompanyApiResponse] = useState<SaveCompanyInfoResponse | null>(null);
  const [brandingApiResponse, setBrandingApiResponse] = useState<SaveBrandingInfoResponse | null>(null);
  const [companyError, setCompanyError] = useState<string | null>(null);
  const [brandingError, setBrandingError] = useState<string | null>(null);

  // Sample initial data for testing
  const sampleCompanyData = {
    companyName: "TechFlow Solutions",
    industryNiche: "Technology",
    productService: "We provide cutting-edge SaaS solutions for small and medium-sized businesses to streamline their operations and boost productivity.",
    audience: "Small to medium-sized businesses (10-500 employees) in the B2B sector, particularly focusing on tech-savvy managers and entrepreneurs looking to modernize their workflows and reduce operational costs.",
    mission: "Our mission is to empower businesses with intelligent, user-friendly software that simplifies complex processes and enables teams to focus on what matters most - growing their business and serving their customers.",
    vision: "We envision a world where every business, regardless of size, has access to enterprise-grade tools that level the playing field and enable them to compete effectively in the digital economy.",
    statements: [
      "Innovation through simplicity",
      "Customer success is our success",
      "Building for the future",
    ],
  };

  const sampleBrandingData = {
    colorPalette: [
      { id: "1", hex: "#6366F1", name: "Primary" },
      { id: "2", hex: "#8B5CF6", name: "Secondary" },
      { id: "3", hex: "#EC4899", name: "Accent" },
    ],
    mood: ["Professional", "Modern", "Energetic", "Friendly"],
  };

  const handleCompanySubmit = async (data: CompanyInfo) => {
    console.log("🏢 Company Information Submitted:", data);
    setCompanyLoading(true);
    setCompanyError(null);
    setCompanyApiResponse(null);

    try {
      const response = await fetch("/api/company-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ companyInfo: data }),
      });

      const result: ApiResponse<SaveCompanyInfoResponse> = await response.json();

      if (result.success && result.data) {
        setCompanyData(data);
        setCompanyApiResponse(result.data);
        console.log("✅ Company API Response:", result);
        alert(
          `Company information saved successfully!\n\nID: ${result.data.id}\n\nCheck the console and display below for details.`
        );
      } else {
        const errorMessage = result.error?.message || "Unknown error occurred";
        setCompanyError(errorMessage);
        console.error("❌ Company API Error:", result.error);
        alert(`Error: ${errorMessage}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect to server";
      setCompanyError(errorMessage);
      console.error("❌ Company Network Error:", err);
      alert(`Network Error: ${errorMessage}`);
    } finally {
      setCompanyLoading(false);
    }
  };

  const handleBrandingSubmit = async (data: BrandingInfo) => {
    console.log("🎨 Branding Information Submitted:", data);
    setBrandingLoading(true);
    setBrandingError(null);
    setBrandingApiResponse(null);

    try {
      const response = await fetch("/api/branding-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ brandingInfo: data }),
      });

      const result: ApiResponse<SaveBrandingInfoResponse> = await response.json();

      if (result.success && result.data) {
        setBrandingData(data);
        setBrandingApiResponse(result.data);
        console.log("✅ Branding API Response:", result);
        alert(
          `Branding information saved successfully!\n\nID: ${result.data.id}\n\nCheck the console and display below for details.`
        );
      } else {
        const errorMessage = result.error?.message || "Unknown error occurred";
        setBrandingError(errorMessage);
        console.error("❌ Branding API Error:", result.error);
        alert(`Error: ${errorMessage}`);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to connect to server";
      setBrandingError(errorMessage);
      console.error("❌ Branding Network Error:", err);
      alert(`Network Error: ${errorMessage}`);
    } finally {
      setBrandingLoading(false);
    }
  };

  const handleCompanySave = (data: Partial<CompanyInfo>) => {
    console.log("💾 Company auto-saved data:", data);
  };

  const handleBrandingSave = (data: Partial<BrandingInfo>) => {
    console.log("💾 Branding auto-saved data:", data);
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
                  Onboarding Components Test
                </h1>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Company Information & Branding Input Components
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
          {/* Components Grid */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
            {/* Company Information Component */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🏢</span>
                  Company Information
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Enter your company's basic information and values
                </p>
              </div>

              <CompanyInfoInput
                onSubmit={handleCompanySubmit}
                onSave={handleCompanySave}
                initialData={sampleCompanyData}
                isLoading={companyLoading}
              />
            </div>

            {/* Branding Component */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center gap-2">
                  <span className="text-2xl">🎨</span>
                  Branding Information
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Define your brand's visual identity and personality
                </p>
              </div>

              <BrandingInput
                onSubmit={handleBrandingSubmit}
                onSave={handleBrandingSave}
                initialData={sampleBrandingData}
                isLoading={brandingLoading}
              />
            </div>
          </div>

          {/* Instructions Card */}
          <div className="bg-linear-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-indigo-200 dark:border-indigo-900 p-6 mb-8">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              💡 Instructions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                  Company Information Features:
                </h4>
                <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                    <span>Industry dropdown with suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                    <span>Dynamic brand statements array</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                    <span>Character counters on all fields</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                    <span>Real-time validation</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm font-semibold text-indigo-700 dark:text-indigo-300 mb-2">
                  Branding Features:
                </h4>
                <ul className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                    <span>Color palette picker (up to 6 colors)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                    <span>Hex code validation and manual input</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                    <span>Predefined & custom mood tags</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 dark:text-indigo-400 mt-0.5">•</span>
                    <span>Visual color preview</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Error Displays */}
          {companyError && (
            <div className="mb-8 bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-xl border-2 border-red-200 dark:border-red-800 p-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-red-700 dark:text-red-300">
                  Company Information Submission Failed
                </h3>
              </div>
              <p className="text-red-600 dark:text-red-400">{companyError}</p>
            </div>
          )}

          {brandingError && (
            <div className="mb-8 bg-red-50 dark:bg-red-900/20 rounded-2xl shadow-xl border-2 border-red-200 dark:border-red-800 p-6">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-red-700 dark:text-red-300">
                  Branding Information Submission Failed
                </h3>
              </div>
              <p className="text-red-600 dark:text-red-400">{brandingError}</p>
            </div>
          )}

          {/* Submitted Data Display */}
          {(companyData || brandingData) && (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Company Data Display */}
              {companyData && !companyError && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      🏢 Company Information Saved
                    </h3>
                  </div>

                  {companyApiResponse && (
                    <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                        🎉 Successfully Saved (Mock DB)
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-green-600 dark:text-green-400 font-medium">ID:</span>
                          <p className="text-green-700 dark:text-green-300 font-mono text-xs mt-1 break-all">
                            {companyApiResponse.id}
                          </p>
                        </div>
                        <div>
                          <span className="text-green-600 dark:text-green-400 font-medium">Created:</span>
                          <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                            {new Date(companyApiResponse.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">Company:</span>
                      <p className="text-zinc-900 dark:text-zinc-100">{companyData.companyName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">Industry:</span>
                      <p className="text-zinc-900 dark:text-zinc-100">{companyData.industryNiche}</p>
                    </div>
                    <div>
                      <span className="font-medium text-zinc-500 dark:text-zinc-400">Product/Service:</span>
                      <p className="text-zinc-700 dark:text-zinc-300">{companyData.productService}</p>
                    </div>
                    {companyData.statements.filter((s) => s.trim()).length > 0 && (
                      <div>
                        <span className="font-medium text-zinc-500 dark:text-zinc-400">Statements:</span>
                        <ul className="mt-1 space-y-1">
                          {companyData.statements
                            .filter((s) => s.trim())
                            .map((statement, index) => (
                              <li key={index} className="flex items-start gap-2 text-zinc-700 dark:text-zinc-300">
                                <span className="text-indigo-600 dark:text-indigo-400">→</span>
                                <span>{statement}</span>
                              </li>
                            ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Branding Data Display */}
              {brandingData && !brandingError && (
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-zinc-950/50 border border-zinc-200 dark:border-zinc-800 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                      🎨 Branding Information Saved
                    </h3>
                  </div>

                  {brandingApiResponse && (
                    <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                      <h4 className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
                        🎉 Successfully Saved (Mock DB)
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-green-600 dark:text-green-400 font-medium">ID:</span>
                          <p className="text-green-700 dark:text-green-300 font-mono text-xs mt-1 break-all">
                            {brandingApiResponse.id}
                          </p>
                        </div>
                        <div>
                          <span className="text-green-600 dark:text-green-400 font-medium">Created:</span>
                          <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                            {new Date(brandingApiResponse.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 block mb-2">
                        Color Palette:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {brandingData.colorPalette.map((color) => (
                          <div key={color.id} className="flex items-center gap-2 p-2 rounded-lg bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                            <div
                              className="w-8 h-8 rounded border-2 border-zinc-300 dark:border-zinc-600"
                              style={{ backgroundColor: color.hex }}
                            />
                            <div>
                              <p className="text-xs font-medium text-zinc-900 dark:text-zinc-100">{color.name}</p>
                              <p className="text-xs font-mono text-zinc-600 dark:text-zinc-400">{color.hex}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400 block mb-2">
                        Mood Tags:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {brandingData.mood.map((mood) => (
                          <span
                            key={mood}
                            className="px-3 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-sm font-medium border border-indigo-200 dark:border-indigo-800"
                          >
                            {mood}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-200 dark:border-zinc-800 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
              Onboarding Components Test Page • Built with Next.js & Tailwind CSS
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

