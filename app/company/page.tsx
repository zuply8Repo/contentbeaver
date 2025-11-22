'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import CompanyInfoInput from '@/app/ui/input/company-info-input';
import { CompanyInfo } from '@/app/ui/input/types';

export default function CompanyPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CompanyInfo) => {
    setIsLoading(true);
    
    try {
      // Optional: Save data to API or localStorage
      console.log('Company Info submitted:', data);
      
      // You can save to localStorage for later use
      localStorage.setItem('companyInfo', JSON.stringify(data));
      
      // Navigate to branding page
      setTimeout(() => {
        router.push('/branding');
      }, 500);
    } catch (error) {
      console.error('Error submitting company info:', error);
      setIsLoading(false);
    }
  };

  const handleSave = async (data: CompanyInfo) => {
    // Auto-save functionality
    console.log('Auto-saving company info:', data);
    localStorage.setItem('companyInfo', JSON.stringify(data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Company Information
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Tell us about your company to get started
          </p>
        </div>

        {/* Company Info Form */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
          <CompanyInfoInput
            onSubmit={handleSubmit}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

