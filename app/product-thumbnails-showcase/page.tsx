import React from "react";
import ProductThumbnailsSummary from "../ui/product-thumbnails-summary";

const mockProductsFew = [
  { id: "1", imageUrl: "https://placehold.co/80x80?text=P1", alt: "Product 1" },
  { id: "2", imageUrl: "https://placehold.co/80x80?text=P2", alt: "Product 2" },
  { id: "3", imageUrl: "https://placehold.co/80x80?text=P3", alt: "Product 3" },
];

const mockProductsMany = Array.from({ length: 12 }, (_, i) => ({
  id: `${i + 1}`,
  imageUrl: `https://placehold.co/80x80?text=P${i + 1}`,
  alt: `Product ${i + 1}`,
}));

export default function ProductThumbnailsShowcasePage() {
  return (
    <div className="max-w-2xl mx-auto py-12 space-y-10">
      <h1 className="text-2xl font-bold mb-6">Product Thumbnails Summary Showcase</h1>
      <section>
        <h2 className="font-semibold mb-2">No Products</h2>
        <ProductThumbnailsSummary products={[]} />
      </section>
      <section>
        <h2 className="font-semibold mb-2 mt-6">A Few Products</h2>
        <ProductThumbnailsSummary products={mockProductsFew} />
      </section>
      <section>
        <h2 className="font-semibold mb-2 mt-6">Many Products / Overflow</h2>
        <ProductThumbnailsSummary products={mockProductsMany} />
      </section>
    </div>
  );
}
