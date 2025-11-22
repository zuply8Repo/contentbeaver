'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BrandingInput from '@/app/ui/input/branding-input';
import { BrandingInfo } from '@/app/ui/input/types';

export default function BrandingPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: BrandingInfo) => {
    setIsLoading(true);
    
    try {
      // Optional: Save data to API or localStorage
      console.log('Branding Info submitted:', data);
      
      // You can save to localStorage for later use
      localStorage.setItem('brandingInfo', JSON.stringify(data));
      
      // Navigate to product dashboard
      setTimeout(() => {
        router.push('/product-dashboard');
      }, 500);
    } catch (error) {
      console.error('Error submitting branding info:', error);
      setIsLoading(false);
    }
  };

  const handleSave = async (data: BrandingInfo) => {
    // Auto-save functionality
    console.log('Auto-saving branding info:', data);
    localStorage.setItem('brandingInfo', JSON.stringify(data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-zinc-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            Branding Information
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Define your brand's visual identity and personality
          </p>
        </div>

        {/* Branding Info Form */}
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-xl p-8">
          <BrandingInput
            onSubmit={handleSubmit}
            onSave={handleSave}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

