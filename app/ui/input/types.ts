export interface ProductSpec {
  productName: string;
  description: string;
  features: string[];
  technicalSpecs: string;
  tags: string[];
}

export interface ProductSpecInputProps {
  onSubmit?: (data: ProductSpec) => void;
  onSave?: (data: Partial<ProductSpec>) => void;
  initialData?: Partial<ProductSpec>;
  isLoading?: boolean;
  className?: string;
}

export interface ValidationErrors {
  productName?: string;
  description?: string;
  features?: string;
  technicalSpecs?: string;
  tags?: string;
}

