"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface ProductThumbnail {
  id: string;
  imageUrl?: string; // Can be undefined for placeholder/mock
  alt?: string;
}

interface Props {
  products: ProductThumbnail[];
  className?: string;
}

export const ProductThumbnailsSummary: React.FC<Props> = ({
  products,
  className,
}) => {
  const router = useRouter();

  // Helper to render a single thumbnail or placeholder
  const renderThumbnail = (
    product?: ProductThumbnail,
    isPlaceholder = false,
    key?: React.Key
  ) => {
    if (isPlaceholder) {
      return (
        <button
          key={key}
          type="button"
          className="relative flex items-center justify-center w-20 h-20 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:bg-gray-200 transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          aria-label="Add product"
          onClick={() => router.push("/image-upload")}
        >
          <span className="text-3xl text-gray-400">+</span>
        </button>
      );
    }
    return (
      <div
        key={product?.id}
        className="relative w-20 h-20 bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden flex items-center justify-center mr-2"
      >
        {product?.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.alt || "Product thumbnail"}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-300 text-2xl">👜</span>
        )}
      </div>
    );
  };

  return (
    <div
      className={"flex items-center gap-2 overflow-x-auto " + (className || "")}
    >
      {products.length === 0
        ? renderThumbnail(undefined, true, "placeholder-new")
        : [
            ...products.map((product) =>
              renderThumbnail(product, false, product.id)
            ),
            renderThumbnail(undefined, true, "placeholder-end"),
          ]}
    </div>
  );
};

export default ProductThumbnailsSummary;
