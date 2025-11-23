"use client";

import { useEffect, useState } from "react";
import { ApiResponse, GetUploadByIdResponse } from "@/app/lib/types/api";

interface ProductCardProps {
  productId: string;
}

export default function ProductCard({ productId }: ProductCardProps) {
  const [product, setProduct] = useState<GetUploadByIdResponse["upload"] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(`/api/upload/${productId}`);
        const result: ApiResponse<GetUploadByIdResponse> = await response.json();

        if (!result.success || !result.data) {
          setError(result.error?.message || "Failed to load product");
          return;
        }

        setProduct(result.data.upload);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
      } finally {
        setIsLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-2/3" />
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-full" />
            <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded animate-pulse w-4/5" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="w-full rounded-2xl border border-red-200/80 dark:border-red-900/60 bg-red-50/80 dark:bg-red-900/20 px-4 py-3">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
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
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-xs font-medium">
            {error || "Product not found"}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-zinc-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        {/* Image - Compact avatar style */}
        <div className="flex-shrink-0">
          <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/70 dark:border-zinc-700/70">
            <img
              src={product.public_url}
              alt="Product"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Description - Right Side */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
              Product description
            </h3>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
              {new Date(product.created_at).toLocaleDateString()}
            </span>
          </div>
          <p className="text-sm text-zinc-900 dark:text-zinc-100 line-clamp-3 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
    </div>
  );
}

